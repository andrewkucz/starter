import { Page, PageContent, PageHeader, PageTitle } from "@/components/layout/page-layout";
import { ActiveSessions } from "../account/active-sessions";
import { LinkedAccounts } from "../account/linked-accounts";
import { ContentSection } from "../components/content-section";

export function SettingsAccount() {
  return (
    <Page>
      <PageHeader>
        <PageTitle>Account</PageTitle>
      </PageHeader>
      <PageContent width="narrow" className="gap-6 py-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Account</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your linked accounts and active sessions.
          </p>
        </div>
        <ContentSection title="Account" desc="" hideHeading className="space-y-8">
          <LinkedAccounts />
          <ActiveSessions />
        </ContentSection>
      </PageContent>
    </Page>
  );
}
