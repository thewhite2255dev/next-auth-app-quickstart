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
import { getTwoFactorTokenByEmail } from "@/data/auth/two-factor-token";
import { LoginFormValues } from "@/types/auth";
import { LoginFormSchema } from "@/schemas/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { type ActionResult } from "@/types/action";

type LoginResult = ActionResult & {
  twoFactor?: boolean;
};

export const login = async (
  values: LoginFormValues,
  callbackUrl?: string,
): Promise<LoginResult> => {
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

      return { success: true, message: t("login.states.success") };
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
        const twoFactorToken = await getTwoFactorTokenByEmail(
          existingUser.email,
        );

        if (!twoFactorToken || twoFactorToken.token !== code) {
          return { error: t("errors.invalidCode") };
        }

        const hasExpired = new Date(twoFactorToken.expires) < new Date();

        if (hasExpired) {
          return { error: t("errors.codeExpired") };
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
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
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
    return { error: t("errors.generic") };
  }
};
