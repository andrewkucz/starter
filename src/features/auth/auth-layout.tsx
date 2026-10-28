import { Outlet } from "@tanstack/react-router";

export function AuthLayout() {
  return (
    <main id="main-content" className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="flex w-full max-w-sm flex-col items-center space-y-2">
        <Outlet />
      </div>
    </main>
  );
}
