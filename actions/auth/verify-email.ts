"use server";

import { getUserByEmail } from "@/data/auth/user";
import { getVerificationTokenByToken } from "@/data/auth/verification-token";
import { prisma } from "@/lib/prisma";
import type { ActionResult } from "@/types/action";
import { getTranslations } from "next-intl/server";

export const verifyEmail = async (token: string): Promise<ActionResult> => {
  const t = await getTranslations();

  try {
    if (!token) {
      return {
        error: t("Form.errors.token.missing"),
      };
    }

    const existingToken = await getVerificationTokenByToken(token);

    if (!existingToken) {
      return { error: t("Form.errors.token.invalid") };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
      return { error: t("Form.errors.token.expired") };
    }

    const existingUser = await getUserByEmail(existingToken.email);

    if (!existingUser) {
      return { error: t("Form.errors.email.notFound") };
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

    return { success: true, message: t("Form.verifyEmail.states.success") };
  } catch (error) {
    console.error(t("Form.verifyEmail.states.error"), error);
    return {
      error: t("Form.errors.generic"),
    };
  }
};
