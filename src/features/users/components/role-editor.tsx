import { useMutation } from "@tanstack/react-query";
import { useRouteContext } from "@tanstack/react-router";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { RoleName } from "@/lib/auth/permissions";
import { hasRole } from "@/lib/auth/roles";
import { useAdminUserMutations } from "../api";
import { RoleBadges } from "./role-badges";

// "user" is the capability-less default, so it is implied when nothing else is selected.
const ASSIGNABLE_ROLES = [{ role: "admin", description: "Manage users." }] as const satisfies {
  role: Exclude<RoleName, "user">;
  description: string;
}[];

type AssignableRole = (typeof ASSIGNABLE_ROLES)[number]["role"];

function getAssignedRoles(role: string | null | undefined) {
  return ASSIGNABLE_ROLES.flatMap(({ role: name }) => (hasRole(role, name) ? [name] : []));
}

export function RoleEditor({ userId, role }: { userId: string; role: string | null | undefined }) {
  const { session } = useRouteContext({ from: "/_authenticated" });
  const isSelf = session.user.id === userId;
  const [editing, setEditing] = useState(false);
  const [selected, setSelected] = useState<AssignableRole[]>([]);
  const mutations = useAdminUserMutations();

  const { mutate: setRoles, isPending } = useMutation({
    ...mutations.setRoles,
    onSuccess: () => {
      toast.success("Roles updated.");
      setEditing(false);
    },
    onError: (error) => toast.error(error.message || "Unable to update roles."),
  });

  if (!editing) {
    return (
      <span className="inline-flex flex-wrap items-center gap-2">
        <RoleBadges role={role} />
        <Button
          variant="ghost"
          size="xs"
          onClick={() => {
            setSelected(getAssignedRoles(role));
            setEditing(true);
          }}
        >
          <Pencil aria-hidden="true" />
          Edit
        </Button>
      </span>
    );
  }

  const assigned = getAssignedRoles(role);

  const dirty =
    selected.length !== assigned.length || selected.some((name) => !assigned.includes(name));

  return (
    <form
      className="space-y-3"
      onSubmit={(event) => {
        event.preventDefault();
        setRoles({ userId, roles: selected.length ? selected : ["user"] });
      }}
    >
      <fieldset className="space-y-2" disabled={isPending}>
        <legend className="sr-only">Roles</legend>
        {ASSIGNABLE_ROLES.map(({ role: name, description }) => {
          const id = `user-role-${name}`;
          // Keep admins from locking themselves out of this page.
          const locked = isSelf && name === "admin";

          return (
            <div key={name} className="flex items-start gap-2">
              <Checkbox
                id={id}
                checked={selected.includes(name)}
                disabled={isPending || locked}
                onCheckedChange={(checked) =>
                  setSelected((current) =>
                    checked ? [...current, name] : current.filter((item) => item !== name),
                  )
                }
              />
              <div className="space-y-1">
                <Label htmlFor={id} className="leading-snug">
                  {name}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {locked ? "You can't remove your own admin role." : description}
                </p>
              </div>
            </div>
          );
        })}
      </fieldset>
      <div className="flex gap-2">
        <Button type="submit" size="xs" disabled={!dirty || isPending}>
          {isPending ? "Saving…" : "Save"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="xs"
          disabled={isPending}
          onClick={() => setEditing(false)}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
