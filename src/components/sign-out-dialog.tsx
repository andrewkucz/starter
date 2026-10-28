import { useSignOut } from "@better-auth-ui/react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { authClient } from "@/lib/auth/browser";

interface SignOutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SignOutDialog({ open, onOpenChange }: SignOutDialogProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const { mutate: signOut } = useSignOut(authClient, {
    onSuccess: () => {
      const currentPath = location.pathname;
      void navigate({
        to: "/sign-in",
        search: { redirect: currentPath },
        replace: true,
      });
    },
  });

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Sign out"
      desc="Are you sure you want to sign out? You will need to sign in again to access your account."
      confirmText="Sign out"
      destructive
      handleConfirm={() => signOut()}
      className="sm:max-w-sm"
    />
  );
}
