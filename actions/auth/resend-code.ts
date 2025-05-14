"use server";

import { getUserByEmail } from "@/data/auth/user";
import { generateTwoFactorToken } from "@/data/auth/tokens";
import { sendTwoFactorTokenEmail } from "@/lib/mail";
import { getTranslations } from "next-intl/server";

export const resendCode = async (email: string) => {
  const t = await getTranslations("Form");

  try {
    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
      return { error: t("errors.email.notFound") };
    }

    if (!existingUser.isTwoFactorEnabled) {
      return { error: t("errors.email.twoFactorNotEnabled") };
    }

    const twoFactorToken = await generateTwoFactorToken(existingUser.email);

    await sendTwoFactorTokenEmail(existingUser.email, twoFactorToken.token);

    return { success: t("resendCode.states.success") };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    console.log(t("resendCode.states.error"));
    return { error: t("errors.generic") };
  }
};
