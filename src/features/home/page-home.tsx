import { Link } from "@tanstack/react-router";
import { ArrowRightIcon, BookOpenIcon, LayoutDashboardIcon, SparklesIcon } from "lucide-react";

import { Logo } from "#/components/brand";
import { Page, PageContent, PageHeader } from "#/components/layout/page-layout";
import { Badge } from "#/components/ui/badge";
import { buttonVariants } from "#/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/components/ui/card";
import { cn } from "#/lib/utils";

export function PageHome() {
  return (
    <Page>
      <PageHeader className="md:hidden">
        <Logo className="mx-auto" />
      </PageHeader>
      <PageContent className="gap-5 py-6">
        <section className="space-y-3 py-2">
          <Badge variant="secondary">
            <SparklesIcon className="mr-1 size-3" />
            Start here
          </Badge>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Welcome to your new app</h1>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              A focused TanStack Start foundation with authentication, Drizzle, polished application
              screens, and an admin workspace ready for real data.
            </p>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2" aria-label="Choose an application">
          <Card className="ring-2 ring-ring ring-offset-2 ring-offset-background">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BookOpenIcon className="size-4" />
                  Application
                </CardTitle>
                <Badge>You are here</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Browse the catalog and manage your personal account from the customer-facing
                application.
              </CardDescription>
            </CardContent>
          </Card>
          <Link to="/manager/dashboard" className="group no-underline">
            <Card className="h-full transition group-hover:-translate-y-0.5 group-hover:shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <LayoutDashboardIcon className="size-4" />
                    Manager
                  </CardTitle>
                  <ArrowRightIcon className="size-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Manage books, users, and application health from a compact administration
                  workspace.
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        </section>

        <section className="bento-grid" aria-label="Starter features">
          <article className="bento-card bento-tall bento-ink">
            <p className="bento-kicker">TanStack Start</p>
            <h2>One app, end to end.</h2>
            <p>Type-safe routes and server capabilities without splitting your mental model.</p>
          </article>
          <article className="bento-card bento-warm">
            <p className="bento-kicker">Drizzle</p>
            <h2>Own your data.</h2>
          </article>
          <article className="bento-card bento-tall bento-gridlines">
            <p className="bento-kicker">UI system</p>
            <h2>Small pieces that compose.</h2>
            <div className="bento-orbit" aria-hidden />
          </article>
          <article className="bento-card bento-cool">
            <p className="bento-kicker">Better Auth</p>
            <h2>Authentication included.</h2>
          </article>
        </section>

        <div className="flex justify-center">
          <Link
            to="/app/books"
            className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "no-underline")}
          >
            Explore the catalog <ArrowRightIcon />
          </Link>
        </div>
      </PageContent>
    </Page>
  );
}
