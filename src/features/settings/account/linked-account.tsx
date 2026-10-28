import { getProviderName } from "@better-auth-ui/core";
import {
  providerIcons,
  useAccountInfo,
  useLinkSocial,
  useUnlinkAccount,
} from "@better-auth-ui/react";
import type { Account, SocialProvider } from "better-auth";
import { Link2, Link2Off, Plug } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth/browser";
import { cn } from "@/lib/utils";

export type LinkedAccountProps = {
  account?: Account;
  provider: SocialProvider;
  existing?: boolean;
};

export function LinkedAccount({ account, provider, existing }: LinkedAccountProps) {
  const { data: accountInfo, isPending: isLoadingInfo } = useAccountInfo(authClient, {
    query: { accountId: account?.accountId ?? "" },
    enabled: Boolean(account),
  });

  const { mutate: linkSocial, isPending: isLinking } = useLinkSocial(authClient);

  const { mutate: unlinkAccount, isPending: isUnlinking } = useUnlinkAccount(authClient, {
    onSuccess: () => toast.success("Account unlinked"),
  });

  const ProviderIcon = providerIcons[provider];
  const providerName = getProviderName(provider);

  const displayName = accountInfo?.user?.email || accountInfo?.user?.name || account?.accountId;

  return (
    <Card className="bg-transparent border-0 ring-0 shadow-none">
      <CardContent className="flex items-center justify-between gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
          {ProviderIcon ? (
            <ProviderIcon className={cn("size-4.5", !account && "opacity-50")} />
          ) : (
            <Plug className={cn("size-4.5", !account && "opacity-50")} />
          )}
        </div>

        <div className="flex flex-col min-w-0">
          <span className="text-sm font-medium leading-tight">{providerName}</span>

          {account && isLoadingInfo ? (
            <Skeleton className="my-0.5 h-3 w-24" />
          ) : (
            <span className="text-xs text-muted-foreground truncate">
              {account ? displayName : `Link ${existing ? "another " : ""}${providerName} account`}
            </span>
          )}
        </div>

        {account ? (
          <Button
            className="ml-auto shrink-0"
            variant="outline"
            size="sm"
            onClick={() => unlinkAccount({ accountId: account.accountId })}
            disabled={isUnlinking}
            aria-label={`Unlink ${providerName} account`}
          >
            {isUnlinking ? <Spinner /> : <Link2Off />}
            Unlink
          </Button>
        ) : (
          <Button
            className="ml-auto shrink-0"
            variant="outline"
            size="sm"
            onClick={() =>
              linkSocial({
                provider,
                callbackURL: "/account",
              })
            }
            disabled={isLinking}
            aria-label={`Link ${providerName} account`}
          >
            {isLinking ? <Spinner /> : <Link2 />}
            Link
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
