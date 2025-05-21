"use server";

import { generatePasswordResetToken } from "@/data/auth/tokens";
import { getUserByEmail } from "@/data/auth/user";
import { sendPasswordResetEmail } from "@/lib/mail";
import type { ActionResult } from "@/types/action";
import { getTranslations } from "next-intl/server";

export const resendForgotPasswordLink = async (
  email: string,
): Promise<ActionResult> => {
  const t = await getTranslations("Form");

  try {
    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.email || !existingUser.password) {
      return { error: t("errors.email.notFound") };
    }

    const passwordToken = await generatePasswordResetToken(email);
    await sendPasswordResetEmail(passwordToken.email, passwordToken.token);

    return { success: true, message: t("forgotPassword.success.resendLink") };
  } catch (error) {
    console.error(t("forgotPassword.errors.resendLink"), error);
    return {
      error: t("errors.generic"),
    };
  }
};
