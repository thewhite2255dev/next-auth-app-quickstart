"use server";

import { generateTwoFactorToken } from "@/data/auth/tokens";
import { getUserByEmail } from "@/data/auth/user";
import { sendTwoFactorTokenEmail } from "@/lib/mail";
import type { ActionResult } from "@/types/action";
import { getTranslations } from "next-intl/server";

export const resendTwoFactorCode = async (
  email: string,
): Promise<ActionResult> => {
  const t = await getTranslations("Form");

  try {
    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.email || !existingUser.password) {
      return { error: t("errors.email.notFound") };
    }

    if (existingUser.isTwoFactorEnabled && existingUser.email) {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await sendTwoFactorTokenEmail(existingUser.email, twoFactorToken.token);
    }

    return { success: true, message: t("twoFactor.success.resendCode") };
  } catch (error) {
    console.error(t("twoFactor.errors.resendCode"), error);
    return {
      error: t("errors.generic"),
    };
  }
};
