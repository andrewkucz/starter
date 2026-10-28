"use client";

import { isReauthenticationRequiredError } from "@better-auth-ui/core";
import { useListSessions, useSession, useSignOut } from "@better-auth-ui/react";
import { useNavigate } from "@tanstack/react-router";
import { MonitorSmartphone } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth/browser";
import { cn } from "@/lib/utils";
import { ActiveSession } from "./active-session";

export type ActiveSessionsProps = {
  className?: string;
};

export function ActiveSessions({ className }: ActiveSessionsProps) {
  const { data: session } = useSession(authClient);

  const {
    data: sessions,
    isPending,
    isError,
    error,
    isFetching,
    refetch,
  } = useListSessions(authClient);

  const needsSignIn = isError && isReauthenticationRequiredError(error);
  const navigate = useNavigate();

  const { mutate: signOut, isPending: isSigningOut } = useSignOut(authClient, {
    onSuccess: () => void navigate({ to: "/sign-in", search: { redirect: "/account" } }),
    onError: () => toast.error("Unable to sign out. Please try again."),
  });

  const activeSessions = [...(sessions ?? [])].sort((activeSession) =>
    activeSession.id === session?.session.id ? -1 : 1,
  );

  return (
    <div>
      <h2 className="text-sm font-semibold mb-3">Active sessions</h2>

      <Card className={cn("p-0", className)}>
        <CardContent className="p-0">
          {isPending ? (
            <SessionRowSkeleton />
          ) : needsSignIn || activeSessions.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <MonitorSmartphone aria-hidden="true" />
                </EmptyMedia>
                <EmptyTitle>
                  {needsSignIn
                    ? "Sign in again to manage your sessions"
                    : isError
                      ? "Unable to load sessions"
                      : "No active sessions"}
                </EmptyTitle>
                <EmptyDescription>
                  {needsSignIn
                    ? "For your security, please sign in again to view and manage your active sessions."
                    : isError
                      ? "We couldn’t load your active sessions. Please try again."
                      : "Devices signed in to your account will appear here so you can review and manage their access."}
                </EmptyDescription>
              </EmptyHeader>
              {needsSignIn ? (
                <Button variant="outline" onClick={() => signOut()} disabled={isSigningOut}>
                  {isSigningOut ? "Redirecting…" : "Sign in again"}
                </Button>
              ) : isError ? (
                <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
                  {isFetching ? "Retrying…" : "Try again"}
                </Button>
              ) : null}
            </Empty>
          ) : (
            activeSessions.map((activeSession, index) => (
              <div key={activeSession.id}>
                {index > 0 && <Separator />}

                <ActiveSession activeSession={activeSession} />
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function SessionRowSkeleton() {
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
