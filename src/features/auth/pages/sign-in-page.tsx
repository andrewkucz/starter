import { getRouteApi } from "@tanstack/react-router";
import { AppLink } from "@/components/app-link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmailAuthForm } from "../sign-in/components/email-auth-form";
import { UserAuthForm } from "../sign-in/components/user-auth-form";

const route = getRouteApi("/_app/_auth/sign-in");

export function SignIn() {
  const { redirect: redirectTo } = route.useSearch();

  return (
    <Card className="max-w-sm w-full gap-4">
      <CardHeader>
        <CardTitle className="text-lg tracking-tight">Sign in</CardTitle>
        <CardDescription>Enter your email and password to continue.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <EmailAuthForm mode="sign-in" redirectTo={redirectTo} />
        <UserAuthForm redirectTo={redirectTo} />
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <AppLink
            to="/sign-up"
            search={{ redirect: redirectTo }}
            className="text-primary underline"
          >
            Sign up
          </AppLink>
        </p>
      </CardContent>
    </Card>
  );
}
