"use client";

import { useListAccounts } from "@better-auth-ui/react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth/browser";
import { useQuery } from "@tanstack/react-query";
import { authProvidersQuery } from "@/lib/auth/providers";
import { cn } from "@/lib/utils";
import { LinkedAccount } from "./linked-account";

export type LinkedAccountsProps = {
  className?: string;
};

const multipleAccountsPerProvider: boolean = true;
/**
 * Render a card showing linked social accounts and available social providers to link.
 *
 * Linked accounts (excluding the "credential" provider) are shown with an unlink control;
 * available providers are shown with a link control. Button states and labels reflect
 * ongoing link/unlink activity and use localization for provider-specific text.
 *
 * @returns A JSX element containing the linked accounts card
 */
export function LinkedAccounts({ className }: LinkedAccountsProps) {
  const { data: accounts, isPending } = useListAccounts(authClient);
  const {
    data: providers,
    isPending: loadingProviders,
    error: providersError,
  } = useQuery(authProvidersQuery);
  const oauthProviderIds = providers?.map((provider) => provider.id) ?? [];

  const linkedAccounts = accounts?.filter((account) => account.providerId !== "credential");

  const linkedProviderIds = new Set(linkedAccounts?.map((a) => a.providerId));

  const availableProviders =
    multipleAccountsPerProvider === false
      ? oauthProviderIds.filter((provider) => !linkedProviderIds.has(provider))
      : oauthProviderIds;

  const allRows = [
    ...(linkedAccounts?.map((account) => ({
      key: account.id,
      account,
      existing: undefined,
      provider: account.providerId,
    })) ?? []),
    ...(availableProviders?.map((provider) => ({
      key: provider,
      account: undefined,
      existing: !!linkedAccounts?.some((account) => account.providerId === provider),
      provider,
    })) ?? []),
  ];

  // Hidden until a social provider is configured or linked.
  if (!isPending && !loadingProviders && !providersError && allRows.length === 0) return null;

  return (
    <div>
      <h2 className="text-sm font-semibold mb-3">Linked accounts</h2>

      {providersError ? (
        <p role="alert" className="mb-3 text-sm text-destructive">
          Could not load available account providers. Refresh to try again.
        </p>
      ) : null}
      <Card className={cn("p-0", className)}>
        <CardContent className="p-0">
          {isPending || loadingProviders
            ? [0, 1].map((provider, index) => (
                <div key={provider}>
                  {index > 0 && <Separator />}
                  <AccountRowSkeleton />
                </div>
              ))
            : allRows.map((row, index) => (
                <div key={row.key}>
                  {index > 0 && <Separator />}

                  <LinkedAccount
                    account={row.account}
                    provider={row.provider}
                    existing={row.existing}
                  />
                </div>
              ))}
        </CardContent>
      </Card>
    </div>
  );
}

function AccountRowSkeleton() {
  return (
    <Card className="bg-transparent border-0 ring-0 shadow-none">
      <CardContent className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-md" />

        <div className="flex flex-col gap-1">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-3 w-32" />
        </div>
      </CardContent>
    </Card>
  );
}
