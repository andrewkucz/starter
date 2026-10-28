import { useSignInEmail, useSignUpEmail } from "@better-auth-ui/react";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "@tanstack/react-router";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/browser";
import { cn } from "@/lib/utils";

const MIN_PASSWORD_LENGTH = 8;

const signInSchema = z.object({
  name: z.string(),
  email: z.email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

const signUpSchema = signInSchema.extend({
  name: z.string().trim().min(1, "Enter your name."),
  password: z
    .string()
    .min(MIN_PASSWORD_LENGTH, `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`),
});

interface EmailAuthFormProps {
  mode: "sign-in" | "sign-up";
  redirectTo?: string;
  className?: string;
}

export function EmailAuthForm({ mode, redirectTo, className }: EmailAuthFormProps) {
  const router = useRouter();
  const callbackURL = redirectTo || "/dashboard";
  const onSuccess = () => router.history.push(callbackURL);
  const { mutate: signIn, isPending: signInIsPending } = useSignInEmail(authClient, { onSuccess });
  const { mutate: signUp, isPending: signUpIsPending } = useSignUpEmail(authClient, { onSuccess });
  const isPending = signInIsPending || signUpIsPending;

  const form = useForm({
    defaultValues: { name: "", email: "", password: "" },
    validators: { onSubmit: mode === "sign-up" ? signUpSchema : signInSchema },
    onSubmit: ({ value }) =>
      mode === "sign-up"
        ? signUp({ name: value.name, email: value.email, password: value.password })
        : signIn({ email: value.email, password: value.password }),
  });

  return (
    <form
      className={cn("grid gap-4", className)}
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      {mode === "sign-up" ? (
        <form.Field name="name">
          {(field) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>Name</FormLabel>
              <FormControl>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={!field.state.meta.isValid}
                  autoComplete="name"
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage errors={field.state.meta.errors} />
            </FormItem>
          )}
        </form.Field>
      ) : null}
      <form.Field name="email">
        {(field) => (
          <FormItem>
            <FormLabel htmlFor={field.name}>Email</FormLabel>
            <FormControl>
              <Input
                id={field.name}
                name={field.name}
                type="email"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                aria-invalid={!field.state.meta.isValid}
                autoComplete="email"
                disabled={isPending}
              />
            </FormControl>
            <FormMessage errors={field.state.meta.errors} />
          </FormItem>
        )}
      </form.Field>
      <form.Field name="password">
        {(field) => (
          <FormItem>
            <FormLabel htmlFor={field.name}>Password</FormLabel>
            <FormControl>
              <Input
                id={field.name}
                name={field.name}
                type="password"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                aria-invalid={!field.state.meta.isValid}
                autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
                disabled={isPending}
              />
            </FormControl>
            <FormMessage errors={field.state.meta.errors} />
          </FormItem>
        )}
      </form.Field>
      <Button type="submit" disabled={isPending}>
        {mode === "sign-up"
          ? isPending
            ? "Creating account…"
            : "Create account"
          : isPending
            ? "Signing in…"
            : "Sign in"}
      </Button>
    </form>
  );
}
