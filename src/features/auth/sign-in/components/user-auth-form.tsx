import { providerIcons, useSignInSocial } from "@better-auth-ui/react";
import { Loader2, Plug } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/browser";
import { useQuery } from "@tanstack/react-query";
import { authProvidersQuery } from "@/lib/auth/providers";
import { cn } from "@/lib/utils";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLFormElement> {
  redirectTo?: string;
}

export function UserAuthForm({ className, redirectTo, ...props }: UserAuthFormProps) {
  const { mutate: signInSocial, isPending } = useSignInSocial(authClient);
  const { data: providers, error } = useQuery(authProvidersQuery);
  const callbackURL = redirectTo || "/dashboard";

  // Social providers are optional; render nothing until at least one is configured.
  if (!providers?.length && !error) return null;

  return (
    <form className={cn("grid gap-3", className)} {...props}>
      <div className="flex items-center gap-3 text-xs text-muted-foreground uppercase">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>
      {error ? (
        <p role="alert" className="text-destructive text-sm">
          Could not load sign-in options. Refresh to try again.
        </p>
      ) : null}
      {providers?.map((provider) => {
        const ProviderIcon = providerIcons[provider.id];
        const Icon = isPending ? Loader2 : ProviderIcon || Plug;

        return (
          <Button
            key={provider.id}
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() =>
              signInSocial({
                provider: provider.id,
                callbackURL,
              })
            }
          >
            <Icon className={cn("h-4 w-4", isPending && "animate-spin")} />
            {isPending ? "Redirecting..." : `Continue with ${provider.displayName}`}
          </Button>
        );
      })}
    </form>
  );
}
