import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";
import { prisma } from "./lib/prisma";
import { getUserByEmail, getUserWithAccountById } from "./data/auth/user";
import { UserRole } from "@prisma/client";
import { getTwoFactorConfirmationByUserId } from "./data/auth/two-factor-confirmation";
import { generateUniqueUsername } from "./lib/utils/user";

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: {
    ...PrismaAdapter(prisma),
    createUser: async (user) => {
      const base =
        user.name || user.email?.split("@")[0] || `user${Date.now()}`;

      const username = await generateUniqueUsername(base);

      return prisma.user.create({
        data: {
          ...user,
          username,
        },
      });
    },
  },
  session: { strategy: "jwt" },
  ...authConfig,
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserByEmail(user.email as string);
      if (!existingUser?.emailVerified) return false;

      if (existingUser.isTwoFactorEnabled || existingUser.isTotpEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id as string,
        );

        if (!twoFactorConfirmation) return false;

        await prisma.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id },
        });
      }

      return true;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user = {
          ...session.user,
          id: token.sub,
          role: token.role as UserRole,
          isTwoFactorEnabled: token.isTwoFactorEnabled as boolean,
          isOAuth: token.isOAuth as boolean,
          name: token.name as string,
          email: token.email as string,
          image: token.image as string,
          username: token.username as string,
          location: token.location as string,
          bio: token.bio as string,
        };
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUserWithAccount = await getUserWithAccountById(token.sub);
      if (!existingUserWithAccount) return token;

      return {
        ...token,
        image: existingUserWithAccount.image,
        name: existingUserWithAccount.name,
        username: existingUserWithAccount.username,
        email: existingUserWithAccount.email,
        role: existingUserWithAccount.role,
        isOAuth: !!existingUserWithAccount.accounts,
        isTwoFactorEnabled: existingUserWithAccount.isTwoFactorEnabled,
        location: existingUserWithAccount.location,
        bio: existingUserWithAccount.bio,
      };
    },
  },
});
