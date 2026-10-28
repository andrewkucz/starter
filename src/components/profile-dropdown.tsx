import { useSession } from "@better-auth-ui/react";
import { Link } from "@tanstack/react-router";
import {
  ChevronsUpDownIcon,
  LaptopIcon,
  LogOutIcon,
  MoonIcon,
  SettingsIcon,
  SunIcon,
} from "lucide-react";
import { SignOutDialog } from "@/components/sign-out-dialog";
import { useTheme, type UserTheme, UserThemeSchema } from "@/components/theme-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useDialogState from "@/hooks/use-dialog-state";
import { authClient } from "@/lib/auth/browser";
import { getSessionUserDisplay } from "@/lib/auth/user-display";
import { cn } from "@/lib/utils";

const themes: Array<{ value: UserTheme; label: string; icon: typeof SunIcon }> = [
  { value: "light", label: "Light", icon: SunIcon },
  { value: "dark", label: "Dark", icon: MoonIcon },
  { value: "system", label: "System", icon: LaptopIcon },
];

export function ProfileDropdown({
  variant = "avatar",
  compact = false,
  side = "bottom",
}: {
  variant?: "avatar" | "sidebar";
  compact?: boolean;
  side?: "top" | "right" | "bottom" | "left";
} = {}) {
  const [open, setOpen] = useDialogState();
  const { data: session } = useSession(authClient);
  const { userTheme, setTheme } = useTheme();
  const user = getSessionUserDisplay(session?.user);

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size={variant === "sidebar" ? "lg" : "icon-sm"}
            className={cn(
              "relative",
              variant === "avatar" && "rounded-full",
              variant === "sidebar" &&
                "h-12 w-full justify-start gap-2 overflow-hidden px-2 data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground",
              variant === "sidebar" && compact && "justify-center",
            )}
            aria-label="Open user menu"
          >
            <Avatar className="size-8 shrink-0">
              <AvatarImage src={user.image} alt={user.name} />
              <AvatarFallback>{user.initials}</AvatarFallback>
            </Avatar>
            {variant === "sidebar" && !compact ? (
              <>
                <span className="min-w-0 flex-1 truncate text-left text-sm font-semibold">
                  {user.name}
                </span>
                <ChevronsUpDownIcon className="ml-auto size-4 text-muted-foreground" />
              </>
            ) : null}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56 rounded-lg"
          side={side}
          sideOffset={4}
          align="end"
          forceMount
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-1.5">
                <p className="text-sm leading-none font-medium">{user.name}</p>
                {user.email ? (
                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                ) : null}
              </div>
            </DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link to="/account">
                <SettingsIcon />
                Account
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={userTheme}
            onValueChange={(value) => setTheme(UserThemeSchema.parse(value))}
          >
            {themes.map(({ value, label, icon: Icon }) => (
              <DropdownMenuRadioItem key={value} value={value} indicatorSide="right">
                <Icon />
                {label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={() => setOpen(true)}>
            <LogOutIcon />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SignOutDialog open={!!open} onOpenChange={setOpen} />
    </>
  );
}
