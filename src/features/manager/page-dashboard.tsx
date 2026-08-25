import { Link } from "@tanstack/react-router";
import { ArrowRightIcon, BookOpenIcon, UserCheckIcon, UsersIcon } from "lucide-react";

import { Page, PageContent, PageHeader, PageTitle } from "#/components/layout/page-layout";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { books, users } from "#/data/catalog";

const stats = [
  { label: "Books", value: books.length, icon: BookOpenIcon, to: "/manager/books" as const },
  { label: "Users", value: users.length, icon: UsersIcon, to: "/manager/users" as const },
  {
    label: "Onboarded",
    value: users.filter((user) => user.onboarded).length,
    icon: UserCheckIcon,
    to: "/manager/users" as const,
  },
];

export function PageDashboard() {
  return (
    <Page>
      <PageHeader>
        <PageTitle>Dashboard</PageTitle>
      </PageHeader>
      <PageContent width="wide" className="gap-6 py-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Good morning, Mia</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here is what is happening across the application.
          </p>
        </div>
        <section className="grid gap-4 sm:grid-cols-3" aria-label="Application summary">
          {stats.map(({ icon: Icon, ...stat }) => (
            <Link key={stat.label} to={stat.to} className="group no-underline">
              <Card className="transition group-hover:shadow-md">
                <CardHeader className="flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm text-muted-foreground">{stat.label}</CardTitle>
                  <Icon className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="flex items-end justify-between">
                  <strong className="text-3xl">{stat.value}</strong>
                  <ArrowRightIcon className="size-4 text-muted-foreground transition group-hover:translate-x-1" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </section>
        <Card>
          <CardHeader>
            <CardTitle>Recently added books</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {books.slice(0, 4).map((book) => (
              <Link
                key={book.id}
                to="/manager/books/$id"
                params={{ id: book.id }}
                className="flex items-center gap-3 rounded-lg border p-3 text-foreground no-underline hover:bg-muted"
              >
                <span className="size-8 rounded-sm" style={{ backgroundColor: book.genre.color }} />
                <span className="min-w-0 flex-1">
                  <strong className="block truncate text-sm">{book.title}</strong>
                  <span className="block truncate text-xs text-muted-foreground">
                    {book.author}
                  </span>
                </span>
                <ArrowRightIcon className="size-4 text-muted-foreground" />
              </Link>
            ))}
          </CardContent>
        </Card>
      </PageContent>
    </Page>
  );
}
