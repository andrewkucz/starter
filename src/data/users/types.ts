export type UserSession = {
  id: string;
  expiresAt: Date;
  updatedAt: Date;
  userAgent: string | null;
  ipAddress: string | null;
};

export type User = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: "admin" | "user";
  onboarded: boolean;
  sessions: Array<UserSession>;
};
