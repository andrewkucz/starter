export function parseAdminEmails(value: string | undefined) {
  if (!value) return [];

  return [
    ...new Set(
      value
        .split(",")
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean),
    ),
  ];
}
