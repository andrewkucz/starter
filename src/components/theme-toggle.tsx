import { LaptopIcon, MoonIcon, SunIcon } from "lucide-react";

import { useTheme, UserThemeSchema } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";

export default function ThemeToggle() {
  const { userTheme, setTheme } = useTheme();

  const getNextTheme = () => {
    const themes = UserThemeSchema.unwrap().options;
    const currentIndex = themes.indexOf(userTheme);
    const nextIndex = (currentIndex + 1) % themes.length;

    return themes[nextIndex];
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(getNextTheme())}
      aria-label="Switch theme mode"
      title="Switch theme mode"
    >
      <span className="not-system:light:inline hidden" aria-hidden="true">
        <SunIcon />
      </span>
      <span className="not-system:dark:inline hidden" aria-hidden="true">
        <MoonIcon />
      </span>
      <span className="system:inline hidden" aria-hidden="true">
        <LaptopIcon />
      </span>
    </Button>
  );
}
