"use server";

import { generateVerificationToken } from "@/data/auth/tokens";
import { getUserByEmail } from "@/data/auth/user";
import { sendVerificationEmail } from "@/lib/mail";
import type { ActionResult } from "@/types/action";
import { getTranslations } from "next-intl/server";

export const resendVerifyEmailLink = async (
  email: string,
): Promise<ActionResult> => {
  const t = await getTranslations();

  try {
    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.email || !existingUser.password) {
      return { error: t("Form.errors.email.notFound") };
    }

    const verificationToken = await generateVerificationToken(email);

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
    );

    return {
      success: true,
      message: t("Form.verifyEmail.resend.states.success"),
    };
  } catch (error) {
    console.error(t("Form.verifyEmail.resend.states.error"), error);
    return {
      error: t("Form.errors.generic"),
    };
  }
};
