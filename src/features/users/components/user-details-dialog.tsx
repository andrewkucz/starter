import { useQuery } from "@tanstack/react-query";
import Bowser from "bowser";
import { formatDistanceToNow } from "date-fns";
import { KeyRound, UserRound } from "lucide-react";
import type { ReactNode } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authProvidersQuery } from "@/lib/auth/providers";
import { getSessionUserDisplay } from "@/lib/auth/user-display";
import { adminUserQueries } from "../api";
import { RoleEditor } from "./role-editor";

export type UserSummary = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
};

function formatDateTime(value: Date | string | null | undefined) {
  return value ? new Date(value).toLocaleString() : "—";
}

function describeUserAgent(userAgent: string | null | undefined) {
  if (!userAgent) return "Unknown device";
  const ua = Bowser.parse(userAgent);
  return [ua.browser.name, ua.os.name].filter(Boolean).join(", ") || "Unknown device";
}

function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[7rem_1fr] gap-3 py-1.5 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="min-w-0 break-words">{children}</dd>
    </div>
  );
}

type UserDetailsData = Awaited<ReturnType<ReturnType<typeof adminUserQueries.detail>["queryFn"]>>;

function SectionHeading({ children, count }: { children: ReactNode; count?: number }) {
  return (
    <h3 className="text-sm font-medium">
      {children}
      {count !== undefined ? (
        <span className="ml-1.5 text-muted-foreground tabular-nums">{count}</span>
      ) : null}
    </h3>
  );
}

function BasicInfoPanel({ user, sessions }: UserDetailsData) {
  const lastActive = sessions[0]?.updatedAt;

  return (
    <dl>
      <DetailRow label="User ID">
        <code className="font-mono text-xs">{user.id}</code>
      </DetailRow>
      <DetailRow label="Email">
        <span className="inline-flex flex-wrap items-center gap-2">
          {user.email}
          <Badge variant={user.emailVerified ? "positive" : "secondary"}>
            {user.emailVerified ? "Verified" : "Unverified"}
          </Badge>
        </span>
      </DetailRow>
      <DetailRow label="Role">
        <RoleEditor userId={user.id} role={user.role} />
      </DetailRow>
      <DetailRow label="Status">
        {user.banned ? (
          <span className="space-y-1">
            <Badge variant="destructive">Banned</Badge>
            {user.banReason ? (
              <span className="block text-muted-foreground">{user.banReason}</span>
            ) : null}
            <span className="block text-muted-foreground">
              {user.banExpires ? `Until ${formatDateTime(user.banExpires)}` : "No expiry"}
            </span>
          </span>
        ) : (
          <Badge variant="positive">Active</Badge>
        )}
      </DetailRow>
      <DetailRow label="Joined">{formatDateTime(user.createdAt)}</DetailRow>
      <DetailRow label="Updated">{formatDateTime(user.updatedAt)}</DetailRow>
      <DetailRow label="Last active">
        {lastActive
          ? formatDistanceToNow(new Date(lastActive), { addSuffix: true })
          : "No active sessions"}
      </DetailRow>
    </dl>
  );
}

function ConnectedAccounts({ userId }: { userId: string }) {
  const { data, isPending, error } = useQuery(adminUserQueries.accounts(userId));
  const { data: providers } = useQuery(authProvidersQuery);

  if (isPending) return <Skeleton className="h-16 w-full" />;
  if (error) return <p className="text-sm text-destructive">{error.message}</p>;

  const providerName = (providerId: string) =>
    providerId === "credential"
      ? "Email & password"
      : (providers?.find((provider) => provider.id === providerId)?.displayName ?? providerId);

  return (
    <section className="space-y-2">
      <SectionHeading count={data.length}>Connected accounts</SectionHeading>
      {data.length ? (
        <ul className="divide-y rounded-md border text-sm">
          {data.map((linked) => (
            <li key={linked.id} className="flex items-center justify-between gap-3 px-3 py-2">
              <div className="min-w-0">
                <p className="truncate">{providerName(linked.providerId)}</p>
                <p className="truncate font-mono text-xs text-muted-foreground">
                  {linked.accountId}
                </p>
                {linked.scope ? (
                  <p className="truncate text-xs text-muted-foreground" title={linked.scope}>
                    {linked.scope}
                  </p>
                ) : null}
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">
                Linked {formatDistanceToNow(new Date(linked.createdAt), { addSuffix: true })}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">This user has no connected accounts.</p>
      )}
    </section>
  );
}

function AuthPanel({ user, sessions }: UserDetailsData) {
  return (
    <div className="space-y-6">
      <ConnectedAccounts userId={user.id} />

      <section className="space-y-2">
        <SectionHeading count={sessions.length}>Active sessions</SectionHeading>
        {sessions.length ? (
          <ul className="divide-y rounded-md border text-sm">
            {sessions.map((session) => (
              <li key={session.id} className="flex items-center justify-between gap-3 px-3 py-2">
                <div className="min-w-0">
                  <p className="truncate">{describeUserAgent(session.userAgent)}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {session.ipAddress || "Unknown IP"}
                    {session.impersonatedBy ? " · Impersonated" : ""}
                  </p>
                </div>
                <div className="shrink-0 text-right text-xs text-muted-foreground">
                  <p>
                    Active {formatDistanceToNow(new Date(session.updatedAt), { addSuffix: true })}
                  </p>
                  <p>Expires {formatDateTime(session.expiresAt)}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">This user has no active sessions.</p>
        )}
      </section>
    </div>
  );
}

const TABS = [
  { value: "basic", label: "Basic Info", icon: UserRound },
  { value: "auth", label: "Auth", icon: KeyRound },
] as const;

function UserDetails({ userId }: { userId: string }) {
  const { data, isPending, error } = useQuery(adminUserQueries.detail(userId));

  return (
    <Tabs defaultValue="basic" className="min-h-0 flex-1 gap-0">
      <TabsList
        variant="line"
        className="w-full shrink-0 justify-start gap-4 border-b px-6 py-0 group-data-[orientation=horizontal]/tabs:h-auto"
      >
        {TABS.map(({ value, label, icon: Icon }) => (
          <TabsTrigger
            key={value}
            value={value}
            className="h-10 flex-none rounded-none px-1 group-data-[orientation=horizontal]/tabs:after:bottom-[-2px]"
          >
            <Icon aria-hidden="true" />
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
      <div className="min-h-0 flex-1 overflow-y-auto p-6">
        {isPending ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-3/5" />
          </div>
        ) : error ? (
          <p className="text-sm text-destructive">{error.message}</p>
        ) : (
          <>
            <TabsContent value="basic">
              <BasicInfoPanel {...data} />
            </TabsContent>
            <TabsContent value="auth">
              <AuthPanel {...data} />
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
}

export function UserDetailsDialog({
  user,
  open,
  onOpenChange,
}: {
  user: UserSummary | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const display = getSessionUserDisplay(user);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[min(40rem,calc(100dvh-2rem))] flex-col gap-0 overflow-hidden p-0 sm:max-w-4xl">
        {user ? (
          <>
            <DialogHeader className="flex-row items-center gap-3 border-b p-6 pr-12 text-left">
              <Avatar className="size-10">
                <AvatarImage src={display.image} alt="" />
                <AvatarFallback>{display.initials}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 space-y-1">
                <DialogTitle className="truncate">{user.name || display.name}</DialogTitle>
                <DialogDescription className="truncate">{user.email}</DialogDescription>
              </div>
            </DialogHeader>
            <UserDetails key={user.id} userId={user.id} />
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
