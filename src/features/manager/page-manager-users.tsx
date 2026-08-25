import { Link, useNavigate } from "@tanstack/react-router";
import { PlusIcon, SearchIcon } from "lucide-react";

import { Page, PageContent, PageHeader, PageTitle } from "#/components/layout/page-layout";
import { Avatar } from "#/components/ui/avatar";
import { Badge } from "#/components/ui/badge";
import { buttonVariants } from "#/components/ui/button";
import { DataList, DataListCell, DataListRow } from "#/components/ui/data-list";
import { Input } from "#/components/ui/form-controls";
import { users } from "#/data/catalog";
import { cn } from "#/lib/utils";

export function PageManagerUsers({ searchTerm = "" }: { searchTerm?: string }) {
  const navigate = useNavigate();
  const items = users.filter((user) =>
    `${user.name} ${user.email} ${user.role}`.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  return (
    <Page>
      <PageHeader
        actions={
          <Link
            to="/manager/users/new"
            className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "no-underline")}
          >
            <PlusIcon />
            New user
          </Link>
        }
      >
        <div className="flex items-center gap-4">
          <PageTitle>Users</PageTitle>
          <label className="relative hidden w-full max-w-xs md:block">
            <span className="sr-only">Search users</span>
            <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="h-8 pl-9"
              type="search"
              value={searchTerm}
              onChange={(event) =>
                void navigate({
                  to: "/manager/users",
                  search: { searchTerm: event.target.value },
                  replace: true,
                })
              }
              placeholder="Search users…"
            />
          </label>
        </div>
      </PageHeader>
      <PageContent width="wide" className="py-6">
        <DataList>
          {items.length ? (
            items.map((user) => (
              <DataListRow key={user.id}>
                <DataListCell className="flex-none">
                  <Avatar name={user.name} />
                </DataListCell>
                <DataListCell>
                  <Link
                    to="/manager/users/$id"
                    params={{ id: user.id }}
                    className="font-medium text-foreground no-underline after:absolute after:inset-0"
                  >
                    {user.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </DataListCell>
                <DataListCell className="hidden sm:block">
                  <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                    {user.role}
                  </Badge>
                </DataListCell>
                <DataListCell className="hidden md:block">
                  <p className="text-sm text-muted-foreground">
                    {user.onboarded ? "Onboarded" : "Invitation pending"}
                  </p>
                </DataListCell>
              </DataListRow>
            ))
          ) : (
            <div className="p-10 text-center text-sm text-muted-foreground">
              No users match “{searchTerm}”.
            </div>
          )}
        </DataList>
        <p className="mt-3 text-xs text-muted-foreground">
          Showing {items.length} of {users.length} users
        </p>
      </PageContent>
    </Page>
  );
}
