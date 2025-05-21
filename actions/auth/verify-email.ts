"use server";

import { getUserByEmail } from "@/data/auth/user";
import { getVerificationTokenByToken } from "@/data/auth/verification-token";
import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";

export const verifyEmail = async (token: string) => {
  const t = await getTranslations("Form");

  try {
    if (!token) {
      return {
        error: t("errors.token.missing"),
      };
    }

    const existingToken = await getVerificationTokenByToken(token);

    if (!existingToken) {
      return { error: t("errors.token.invalid") };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
      return { error: t("errors.token.expired") };
    }

    const existingUser = await getUserByEmail(existingToken.email);

    if (!existingUser) {
      return { error: t("errors.email.notFound") };
    }

    await prisma.user.update({
      where: {
        id: existingUser.id,
      },

      data: {
        emailVerified: new Date(),
        email: existingToken.email,
      },
    });

    await prisma.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });

    return { success: t("verifyEmail.states.success") };
  } catch (error) {
    console.error(t("verifyEmail.states.error"), error);
    return {
      error: t("errors.generic"),
    };
  }
};
