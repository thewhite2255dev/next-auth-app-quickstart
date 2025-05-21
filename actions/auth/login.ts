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
import { LoginFormValues } from "@/types/auth";
import { LoginFormSchema } from "@/schemas/auth";
import { getTranslations } from "next-intl/server";
import { getTwoFactorTokenByToken } from "@/data/auth/two-factor-token";
import { revalidatePath } from "next/cache";

export const login = async (values: LoginFormValues) => {
  const t = await getTranslations("Form");

  try {
    const validatedFields = LoginFormSchema(t).safeParse(values);

    if (!validatedFields.success) {
      return { error: t("errors.fields.invalid") };
    }

    const { email, password, code } = validatedFields.data;

    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.email || !existingUser.password) {
      return { error: t("errors.email.notFound") };
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
      return { error: t("errors.invalidCredentials") };
    }

    if (existingUser.isTwoFactorEnabled && existingUser.email) {
      if (code) {
        const twoFactorToken = await getTwoFactorTokenByToken(code);

        if (!twoFactorToken || twoFactorToken.token !== code) {
          return { error: t("errors.invalidCode") };
        }

        const hasExpired = new Date(twoFactorToken.expires) < new Date();

        if (hasExpired) {
          return { error: t("errors.codeExpired") };
        }

        const existingUser = await getUserByEmail(twoFactorToken.email);

        if (!existingUser || !existingUser.email || !existingUser.password) {
          return { error: t("errors.email.notFound") };
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
      } else {
        const twoFactorToken = await generateTwoFactorToken(existingUser.email);
        await sendTwoFactorTokenEmail(existingUser.email, twoFactorToken.token);
        return { twoFactor: true };
      }
    }

    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error(t("login.states.error"), error);
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: t("errors.invalidCredentials") };
        default:
          return { error: t("errors.generic") };
      }
    }

    throw error;
  }
};
