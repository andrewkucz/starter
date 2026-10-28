type SessionUserLike = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

const DEFAULT_NAME = "User";
const DEFAULT_INITIALS = "U";

export function getSessionUserDisplay(user?: SessionUserLike | null) {
  const email = user?.email?.trim() ?? "";
  const name = user?.name?.trim() || email || DEFAULT_NAME;

  return {
    name,
    email,
    image: user?.image ?? "",
    initials: getInitials(name),
  };
}

function getInitials(value: string) {
  const initials = value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return initials || DEFAULT_INITIALS;
}
