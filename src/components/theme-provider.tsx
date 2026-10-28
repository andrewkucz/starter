import { ScriptOnce } from "@tanstack/react-router";
import { createClientOnlyFn, createIsomorphicFn } from "@tanstack/react-start";
import { createContext, use, useEffect, useState, type ReactNode } from "react";
import { z } from "zod";

export const UserThemeSchema = z.enum(["light", "dark", "system"]).catch("system");
export const AppThemeSchema = z.enum(["light", "dark"]).catch("light");

export type UserTheme = z.infer<typeof UserThemeSchema>;

export type AppTheme = z.infer<typeof AppThemeSchema>;

const themeStorageKey = "acme-theme";
const prefersDarkMediaQuery = "(prefers-color-scheme: dark)";

const getStoredUserTheme = createIsomorphicFn()
  .server((): UserTheme => "system")
  .client((): UserTheme => {
    try {
      return UserThemeSchema.parse(localStorage.getItem(themeStorageKey));
    } catch {
      return "system";
    }
  });

const setStoredTheme = createClientOnlyFn((theme: UserTheme) => {
  try {
    localStorage.setItem(themeStorageKey, UserThemeSchema.parse(theme));
  } catch {
    // Theme persistence is optional when storage is unavailable.
  }
});

const getSystemTheme = createIsomorphicFn()
  .server((): AppTheme => "light")
  .client((): AppTheme => (window.matchMedia(prefersDarkMediaQuery).matches ? "dark" : "light"));

const handleThemeChange = createClientOnlyFn((userTheme: UserTheme) => {
  const root = document.documentElement;
  root.classList.remove("light", "dark", "system");
  root.classList.add(userTheme === "system" ? getSystemTheme() : userTheme);

  if (userTheme === "system") {
    root.classList.add("system");
  }
});

const setupPreferredListener = createClientOnlyFn(() => {
  const mediaQuery = window.matchMedia(prefersDarkMediaQuery);
  const handleChange = () => handleThemeChange("system");
  mediaQuery.addEventListener("change", handleChange);

  return () => mediaQuery.removeEventListener("change", handleChange);
});

const themeScript: string = (function () {
  function themeFn() {
    try {
      const storedTheme = localStorage.getItem("acme-theme") || "system";
      const validTheme = ["light", "dark", "system"].includes(storedTheme) ? storedTheme : "system";

      if (validTheme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";

        document.documentElement.classList.add(systemTheme, "system");
      } else {
        document.documentElement.classList.add(validTheme);
      }
    } catch {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";

      document.documentElement.classList.add(systemTheme, "system");
    }
  }

  return `(${themeFn.toString()})();`;
})();

type ThemeContextProps = {
  userTheme: UserTheme;
  appTheme: AppTheme;
  setTheme: (theme: UserTheme) => void;
};

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [userTheme, setUserTheme] = useState<UserTheme>(getStoredUserTheme);

  useEffect(() => {
    if (userTheme !== "system") return;

    return setupPreferredListener();
  }, [userTheme]);

  const appTheme = userTheme === "system" ? getSystemTheme() : userTheme;

  const setTheme = (newUserTheme: UserTheme) => {
    setUserTheme(newUserTheme);
    setStoredTheme(newUserTheme);
    handleThemeChange(newUserTheme);
  };

  return (
    <ThemeContext value={{ userTheme, appTheme, setTheme }}>
      <ScriptOnce>{themeScript}</ScriptOnce>
      {children}
    </ThemeContext>
  );
}

export function useTheme() {
  const context = use(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}
