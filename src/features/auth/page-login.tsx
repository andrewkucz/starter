import { useForm } from "@tanstack/react-form";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRightIcon, LockKeyholeIcon } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

import { Logo } from "#/components/brand";
import ThemeToggle from "#/components/ThemeToggle";
import { Button } from "#/components/ui/button";
import { Field, FieldError, Input, Label } from "#/components/ui/form-controls";
import { authClient } from "#/lib/auth/client";

const loginSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export function PageLogin() {
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string>();
  const form = useForm({
    defaultValues: { email: "", password: "" },
    validators: { onBlur: loginSchema },
    onSubmit: async ({ value }) => {
      setFormError(undefined);
      const result = await authClient.signIn.email({
        email: value.email,
        password: value.password,
      });
      if (result.error) {
        setFormError(
          result.error.message || "We couldn't sign you in. Check your details and try again.",
        );
        return;
      }
      await navigate({ to: "/app" });
    },
  });

  return (
    <main className="grid min-h-dvh bg-background lg:grid-cols-2">
      <section className="flex min-h-dvh flex-col p-6 md:p-10">
        <div className="flex items-center justify-between">
          <Link to="/login" className="text-foreground no-underline">
            <Logo />
          </Link>
          <ThemeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center py-12">
          <form
            className="grid w-full max-w-sm gap-6"
            onSubmit={(event) => {
              event.preventDefault();
              event.stopPropagation();
              void form.handleSubmit();
            }}
          >
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-bold">Welcome back</h1>
              <p className="text-sm text-muted-foreground">
                Sign in with the account configured by Better Auth.
              </p>
            </div>
            <div className="grid gap-4">
              <form.Field name="email">
                {(field) => (
                  <Field>
                    <Label htmlFor={field.name}>Email</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="email"
                      autoComplete="email"
                      autoFocus
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) => field.handleChange(event.target.value)}
                    />
                    {field.state.meta.isTouched && field.state.meta.errors[0] ? (
                      <FieldError>
                        {String(field.state.meta.errors[0]?.message ?? field.state.meta.errors[0])}
                      </FieldError>
                    ) : null}
                  </Field>
                )}
              </form.Field>
              <form.Field name="password">
                {(field) => (
                  <Field>
                    <div className="flex items-center justify-between">
                      <Label htmlFor={field.name}>Password</Label>
                      <span className="text-xs text-muted-foreground">8+ characters</span>
                    </div>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="password"
                      autoComplete="current-password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) => field.handleChange(event.target.value)}
                    />
                    {field.state.meta.isTouched && field.state.meta.errors[0] ? (
                      <FieldError>
                        {String(field.state.meta.errors[0]?.message ?? field.state.meta.errors[0])}
                      </FieldError>
                    ) : null}
                  </Field>
                )}
              </form.Field>
              {formError ? (
                <div
                  role="alert"
                  className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
                >
                  {formError}
                </div>
              ) : null}
              <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting] as const}>
                {([canSubmit, isSubmitting]) => (
                  <Button
                    type="submit"
                    size="lg"
                    disabled={!canSubmit || isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? "Signing in…" : "Sign in"}
                    <ArrowRightIcon />
                  </Button>
                )}
              </form.Subscribe>
            </div>
            <p className="text-center text-xs leading-relaxed text-muted-foreground">
              This scaffold uses email and password because that is what the current Better Auth
              server enables.
            </p>
          </form>
        </div>
        <p className="text-center text-xs text-muted-foreground">
          Built with TanStack Start, Drizzle, and Better Auth.
        </p>
      </section>
      <section className="login-art hidden overflow-hidden bg-neutral-900 lg:flex" aria-hidden>
        <div className="login-art-grid" />
        <div className="login-art-copy">
          <span className="login-art-icon">
            <LockKeyholeIcon />
          </span>
          <p>
            Thoughtful defaults.
            <br />
            Room to make it yours.
          </p>
        </div>
      </section>
    </main>
  );
}
