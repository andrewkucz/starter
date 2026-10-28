import { Badge } from "@/components/ui/badge";

export function RoleBadges({ role }: { role: string | null | undefined }) {
  const roles =
    role
      ?.split(",")
      .map((item) => item.trim())
      .filter(Boolean) ?? [];

  if (!roles.length) return <Badge variant="outline">user</Badge>;

  return (
    <span className="inline-flex flex-wrap gap-1">
      {roles.map((item) => (
        <Badge key={item} variant={item === "admin" ? "default" : "secondary"}>
          {item}
        </Badge>
      ))}
    </span>
  );
}
