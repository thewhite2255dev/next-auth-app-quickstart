"use server";

import bcrypt from "bcryptjs";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/data/auth/user";
import {
  generateVerificationToken,
  generateTwoFactorToken,
} from "@/data/auth/tokens";
import { sendVerificationEmail, sendTwoFactorTokenEmail } from "@/lib/mail";
import { prisma } from "@/lib/prisma";
import type { LoginFormValues } from "@/types/auth";
import { LoginFormSchema } from "@/schemas/auth";
import { getTranslations } from "next-intl/server";
import { getTwoFactorTokenByToken } from "@/data/auth/two-factor-token";
import { revalidatePath } from "next/cache";
import { verifyTOTP } from "../totp/verify";

export const login = async (values: LoginFormValues) => {
  const t = await getTranslations();

  try {
    const validatedFields = LoginFormSchema(t).safeParse(values);

    if (!validatedFields.success) {
      return { error: t("Form.errors.fields.invalid") };
    }

    const { email, password, code } = validatedFields.data;

    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.email || !existingUser.password) {
      return { error: t("Form.errors.email.notFound") };
    }

    if (!existingUser.emailVerified) {
      const verificationToken = await generateVerificationToken(
        existingUser.email,
      );

      await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token,
      );

      return { verifyEmail: true };
    }

    const passwordsMatch = await bcrypt.compare(
      password,
      existingUser.password,
    );

    if (!passwordsMatch) {
      return { error: t("Form.login.errors.invalidCredentials") };
    }

    if (existingUser.isTotpEnabled) {
      if (!existingUser.totpSecret) {
        return { error: t("Form.errors.totp.disabled") };
      }

      if (!code) return { totp: true };

      const isValidTotp = await verifyTOTP(code, existingUser.totpSecret);

      if (!isValidTotp) {
        return { error: t("Form.errors.invalidCode") };
      }

      await prisma.$transaction([
        prisma.twoFactorConfirmation.deleteMany({
          where: { userId: existingUser.id },
        }),
        prisma.twoFactorConfirmation.create({
          data: { userId: existingUser.id },
        }),
      ]);
    } else if (existingUser.isTwoFactorEnabled) {
      if (!code) {
        const twoFactorToken = await generateTwoFactorToken(existingUser.email);
        await sendTwoFactorTokenEmail(existingUser.email, twoFactorToken.token);
        return { twoFactor: true };
      }

      const twoFactorToken = await getTwoFactorTokenByToken(code);

      if (!twoFactorToken || twoFactorToken.token !== code) {
        return { error: t("Form.errors.invalidCode") };
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      if (hasExpired) {
        return { error: t("Form.errors.codeExpired") };
      }

      if (!existingUser || !existingUser.email || !existingUser.password) {
        return { error: t("Form.errors.email.notFound") };
      }

      await prisma.$transaction([
        prisma.twoFactorToken.delete({
          where: { id: twoFactorToken.id },
        }),
        prisma.twoFactorConfirmation.deleteMany({
          where: { userId: existingUser.id },
        }),
        prisma.twoFactorConfirmation.create({
          data: { userId: existingUser.id },
        }),
      ]);
    }

    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error(t("Form.login.states.error"), error);
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: t("Form.login.errors.invalidCredentials") };
        default:
          return { error: t("Form.errors.generic") };
      }
    }

    throw error;
  }
};
