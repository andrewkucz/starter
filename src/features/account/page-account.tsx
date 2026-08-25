import { useNavigate } from "@tanstack/react-router";
import { LogOutIcon, MailIcon, UserIcon } from "lucide-react";

import { Page, PageContent, PageHeader, PageTitle } from "#/components/layout/page-layout";
import ThemeToggle from "#/components/ThemeToggle";
import { Avatar } from "#/components/ui/avatar";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { authClient } from "#/lib/auth/client";

export function PageAccount() {
  const session = authClient.useSession();
  const navigate = useNavigate();
  const name = session.data?.user.name || "Mia Bennett";
  const email = session.data?.user.email || "mia@example.com";
  return (
    <Page>
      <PageHeader>
        <PageTitle>Account</PageTitle>
      </PageHeader>
      <PageContent className="gap-4 py-6" width="narrow">
        <Card>
          <CardHeader className="flex-row items-center gap-3">
            <Avatar name={name} className="size-11" />
            <div className="min-w-0 flex-1">
              <CardTitle className="truncate">{name}</CardTitle>
              <p className="mt-1 truncate text-xs text-muted-foreground">{email}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={async () => {
                await authClient.signOut();
                await navigate({ to: "/login" });
              }}
            >
              <LogOutIcon />
              Sign out
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="account-row">
              <span>
                <UserIcon />
                Name
              </span>
              <strong>{name}</strong>
            </div>
            <div className="account-row">
              <span>
                <MailIcon />
                Email
              </span>
              <span className="flex items-center gap-2">
                <Badge variant="positive">Verified</Badge>
                <strong>{email}</strong>
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Display preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="account-row -mx-5 -mb-5">
              <span>Color theme</span>
              <ThemeToggle />
            </div>
          </CardContent>
        </Card>
        <p className="text-center text-xs text-muted-foreground">
          Starter · TanStack Start · Vite+
        </p>
      </PageContent>
    </Page>
  );
}
