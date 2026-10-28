import { Link, useSearch } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmailAuthForm } from "../sign-in/components/email-auth-form";
import { UserAuthForm } from "../sign-in/components/user-auth-form";

export function SignUp() {
  const search = useSearch({ strict: false });
  const redirectTo = typeof search.redirect === "string" ? search.redirect : undefined;

  return (
    <Card className="max-w-sm w-full gap-4">
      <CardHeader>
        <CardTitle className="text-lg tracking-tight">Create an account</CardTitle>
        <CardDescription>Sign up with your email and a password.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <EmailAuthForm mode="sign-up" redirectTo={redirectTo} />
        <UserAuthForm redirectTo={redirectTo} />
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/sign-in" search={{ redirect: redirectTo }} className="text-primary underline">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
