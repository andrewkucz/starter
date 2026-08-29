import { useForm } from "@tanstack/react-form";
import { Link } from "@tanstack/react-router";
import { ArrowLeftIcon, CheckIcon } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

import { Page, PageContent, PageHeader, PageTitle } from "@/components/layout/page-layout";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldError, Input, Label, Select } from "@/components/ui/form-controls";
import type { User } from "@/data/users/types";

const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Enter a valid email"),
  role: z.enum(["admin", "user"]),
});

export function FormUserPage({ user }: { user?: User }) {
  const [saved, setSaved] = useState(false);
  const form = useForm({
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      role: user?.role ?? ("user" as const),
    },
    validators: { onBlur: userSchema },
    onSubmit: () => setSaved(true),
  });
  return (
    <form
      className="flex flex-1 flex-col"
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void form.handleSubmit();
      }}
    >
      <Page>
        <PageHeader
          before={
            <Link
              to={user ? "/manager/users/$id" : "/manager/users"}
              params={user ? { id: user.id } : undefined}
              className={buttonVariants({ variant: "ghost", size: "icon" })}
              aria-label="Back"
            >
              <ArrowLeftIcon />
            </Link>
          }
          actions={
            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting] as const}>
              {([canSubmit, isSubmitting]) => (
                <Button type="submit" size="sm" disabled={!canSubmit || isSubmitting}>
                  {saved ? <CheckIcon /> : null}
                  {saved ? "Saved" : user ? "Save" : "Create"}
                </Button>
              )}
            </form.Subscribe>
          }
        >
          <PageTitle>{user ? user.name : "New user"}</PageTitle>
        </PageHeader>
        <PageContent width="narrow" className="gap-4 py-6">
          {saved ? (
            <div
              role="status"
              className="rounded-md border border-positive-300 bg-positive-50 p-3 text-sm text-positive-800 dark:border-positive-800 dark:bg-positive-950 dark:text-positive-200"
            >
              Changes are staged in this UI scaffold. Wire this handler to a Better Auth admin
              action when authorization rules are defined.
            </div>
          ) : null}
          <Card>
            <CardContent className="grid gap-5 p-6">
              <form.Field name="name">
                {(field) => (
                  <Field>
                    <Label htmlFor={field.name}>Name</Label>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) => {
                        setSaved(false);
                        field.handleChange(event.target.value);
                      }}
                      autoFocus
                    />
                    {field.state.meta.errors[0] ? (
                      <FieldError>
                        {String(field.state.meta.errors[0]?.message ?? field.state.meta.errors[0])}
                      </FieldError>
                    ) : null}
                  </Field>
                )}
              </form.Field>
              <form.Field name="email">
                {(field) => (
                  <Field>
                    <Label htmlFor={field.name}>Email</Label>
                    <Input
                      id={field.name}
                      type="email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) => {
                        setSaved(false);
                        field.handleChange(event.target.value);
                      }}
                    />
                    {field.state.meta.errors[0] ? (
                      <FieldError>
                        {String(field.state.meta.errors[0]?.message ?? field.state.meta.errors[0])}
                      </FieldError>
                    ) : null}
                  </Field>
                )}
              </form.Field>
              <form.Field name="role">
                {(field) => (
                  <Field>
                    <Label htmlFor={field.name}>Role</Label>
                    <Select
                      id={field.name}
                      value={field.state.value}
                      onChange={(event) => {
                        setSaved(false);
                        field.handleChange(event.target.value as "admin" | "user");
                      }}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </Select>
                  </Field>
                )}
              </form.Field>
            </CardContent>
          </Card>
        </PageContent>
      </Page>
    </form>
  );
}
