"use server";

import { getUserByEmail } from "@/data/auth/user";
import { getPasswordResetTokenByToken } from "@/data/auth/password-reset-token";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import type { ResetPasswordFormValues } from "@/types/auth";
import { ResetPasswordFormSchema } from "@/schemas/auth";
import { getTranslations } from "next-intl/server";

export const resetPassword = async (
  values: ResetPasswordFormValues,
  token: string | null,
) => {
  const t = await getTranslations();

  try {
    const validateFields = ResetPasswordFormSchema(t).safeParse(values);

    if (!validateFields.success) {
      return { error: t("Form.errors.fields.invalid") };
    }

    if (!validateFields.success) {
      return {
        message: t("Form.errors.fields.invalid"),
      };
    }

    const { password } = validateFields.data;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      values.password = hashedPassword;
    }

    if (!token) {
      return {
        error: t("Form.errors.token.missing"),
      };
    }

    const existingToken = await getPasswordResetTokenByToken(token);

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
        ...values,
        email: existingToken.email,
      },
    });

    await prisma.passwordResetToken.delete({
      where: {
        id: existingToken.id,
      },
    });

    return { success: true, message: t("Form.resetPassword.states.success") };
  } catch (error) {
    console.error(t("Form.forgotPassword.states.error"), error);
    return {
      error: t("Form.errors.generic"),
    };
  }
};
