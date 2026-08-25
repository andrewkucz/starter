import { Link } from "@tanstack/react-router";
import { ArrowLeftIcon, LaptopIcon, PencilIcon, SmartphoneIcon } from "lucide-react";

import { Page, PageContent, PageHeader, PageTitle } from "#/components/layout/page-layout";
import { Avatar } from "#/components/ui/avatar";
import { Badge } from "#/components/ui/badge";
import { buttonVariants } from "#/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { getUser } from "#/data/catalog";
import { cn } from "#/lib/utils";

export function PageManagerUser({ id }: { id: string }) {
  const user = getUser(id);
  if (!user)
    return (
      <Page>
        <PageHeader>
          <PageTitle>User not found</PageTitle>
        </PageHeader>
        <PageContent>
          <p className="text-sm text-muted-foreground">That user is not in this scaffold.</p>
        </PageContent>
      </Page>
    );
  return (
    <Page>
      <PageHeader
        before={
          <Link
            to="/manager/users"
            className={buttonVariants({ variant: "ghost", size: "icon" })}
            aria-label="Back to users"
          >
            <ArrowLeftIcon />
          </Link>
        }
        actions={
          <Link
            to="/manager/users/$id/update"
            params={{ id }}
            className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "no-underline")}
          >
            <PencilIcon />
            Edit
          </Link>
        }
      >
        <PageTitle>{user.name}</PageTitle>
      </PageHeader>
      <PageContent
        width="wide"
        className="gap-4 py-6 xl:grid xl:grid-cols-[1fr_1.5fr] xl:items-start"
      >
        <Card>
          <CardHeader className="flex-row items-center gap-3">
            <Avatar name={user.name} className="size-11" />
            <div className="min-w-0">
              <CardTitle>{user.name}</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">{user.email}</p>
            </div>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role}</Badge>
            <span className="text-xs text-muted-foreground">
              {user.onboarded ? "Onboarded" : "Invitation pending"}
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Active sessions</CardTitle>
          </CardHeader>
          <CardContent className="divide-y p-0">
            <div className="flex items-center gap-3 px-5 py-4">
              <LaptopIcon className="size-5 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">Chrome on macOS</p>
                <p className="text-xs text-muted-foreground">
                  Current session · New York, United States
                </p>
              </div>
              <Badge variant="positive">Active</Badge>
            </div>
            <div className="flex items-center gap-3 px-5 py-4">
              <SmartphoneIcon className="size-5 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">Safari on iPhone</p>
                <p className="text-xs text-muted-foreground">Last active 2 days ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </PageContent>
    </Page>
  );
}
