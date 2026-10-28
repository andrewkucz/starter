import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, UsersIcon } from "lucide-react";
import { useState } from "react";

import { Page, PageContent, PageHeader, PageTitle } from "@/components/layout/page-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getSessionUserDisplay } from "@/lib/auth/user-display";
import { adminUserQueries, USERS_PAGE_SIZE } from "../api";
import { RoleBadges } from "../components/role-badges";
import { type UserSummary, UserDetailsDialog } from "../components/user-details-dialog";

const route = getRouteApi("/_authenticated/admin/users");

export function AdminUsersPage() {
  const { page } = route.useSearch();
  const navigate = route.useNavigate();

  const { data, isPending, isPlaceholderData, error } = useQuery({
    ...adminUserQueries.list(page),
    placeholderData: keepPreviousData,
  });

  const [selectedUser, setSelectedUser] = useState<UserSummary | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const total = data?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / USERS_PAGE_SIZE));
  const firstIndex = (page - 1) * USERS_PAGE_SIZE;

  const goToPage = (nextPage: number) =>
    void navigate({ search: (prev) => ({ ...prev, page: nextPage }) });

  const openDetails = (user: UserSummary) => {
    setSelectedUser(user);
    setDetailsOpen(true);
  };

  return (
    <Page>
      <PageHeader>
        <PageTitle>Users</PageTitle>
      </PageHeader>
      <PageContent width="wide" className="gap-4 py-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Everyone with an account. Select a user to see their details.
          </p>
        </div>
        <Card className="p-0">
          <CardContent className="p-0">
            {data?.users.length ? (
              <Table className={isPlaceholderData ? "opacity-60" : undefined}>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.users.map((user) => {
                    const display = getSessionUserDisplay(user);

                    return (
                      <TableRow
                        key={user.id}
                        className="cursor-pointer"
                        onClick={() => openDetails(user)}
                      >
                        <TableCell>
                          <button
                            type="button"
                            className="flex min-w-0 items-center gap-2 rounded-sm text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            onClick={(event) => {
                              event.stopPropagation();
                              openDetails(user);
                            }}
                          >
                            <Avatar className="size-7">
                              <AvatarImage src={display.image} alt="" />
                              <AvatarFallback className="text-xs">
                                {display.initials}
                              </AvatarFallback>
                            </Avatar>
                            <span className="min-w-0 truncate font-medium">{user.name}</span>
                          </button>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{user.email}</TableCell>
                        <TableCell>
                          <span className="inline-flex flex-wrap gap-1">
                            <RoleBadges role={user.role} />
                            {user.banned ? <Badge variant="destructive">banned</Badge> : null}
                          </span>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : isPending ? (
              <div className="space-y-3 p-6">
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-56" />
              </div>
            ) : (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <UsersIcon aria-hidden="true" />
                  </EmptyMedia>
                  <EmptyTitle>{error ? "Unable to load users" : "No users here"}</EmptyTitle>
                  <EmptyDescription>
                    {error?.message ?? "There are no users on this page."}
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </CardContent>
        </Card>
        {total > 0 ? (
          <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
            <p className="tabular-nums">
              {(firstIndex + 1).toLocaleString()}–
              {Math.min(firstIndex + USERS_PAGE_SIZE, total).toLocaleString()} of{" "}
              {total.toLocaleString()}
            </p>
            <div className="flex items-center gap-2">
              <span className="tabular-nums">
                Page {page.toLocaleString()} of {pageCount.toLocaleString()}
              </span>
              <Button
                variant="outline"
                size="icon-sm"
                aria-label="Previous page"
                disabled={page <= 1}
                onClick={() => goToPage(page - 1)}
              >
                <ChevronLeft />
              </Button>
              <Button
                variant="outline"
                size="icon-sm"
                aria-label="Next page"
                disabled={page >= pageCount}
                onClick={() => goToPage(page + 1)}
              >
                <ChevronRight />
              </Button>
            </div>
          </div>
        ) : null}
      </PageContent>

      <UserDetailsDialog user={selectedUser} open={detailsOpen} onOpenChange={setDetailsOpen} />
    </Page>
  );
}
