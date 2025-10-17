import { type DefaultSession } from "next-auth";
import { UserRole } from "@prisma/client";

export type ExtendedUser = DefaultSession["user"] & {
  isOAuth: boolean;

  id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  bio: string;
  location: string;
  role: UserRole;
  image: string;
  isTwoFactorEnabled: boolean;
  isTotpEnabled: boolean;
  totpSecret: string;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
