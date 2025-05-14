"use server";

import { getUserByEmail } from "@/data/auth/user";
import { generatePasswordResetToken } from "@/data/auth/tokens";
import { sendPasswordResetEmail } from "@/lib/mail";
import { ForgotPasswordFormValues } from "@/types/auth";
import { ForgotPasswordFormSchema } from "@/schemas/auth";
import { getTranslations } from "next-intl/server";
import { ActionResult } from "@/types/action";

export const forgotPassword = async (
  values: ForgotPasswordFormValues,
): Promise<ActionResult> => {
  const t = await getTranslations("Form");

  try {
    const validateFields = ForgotPasswordFormSchema(t).safeParse(values);

    if (!validateFields.success) {
      return {
        message: t("errors.fields.invalid"),
      };
    }

    const { email } = validateFields.data;

    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
      return { error: t("errors.email.notFound") };
    }

    const passwordToken = await generatePasswordResetToken(email);

    await sendPasswordResetEmail(passwordToken.email, passwordToken.token);

    return {
      success: true,
      message: t("forgotPassword.states.resetEmailSent"),
    };
  } catch (error) {
    console.error(t("forgotPassword.states.error"), error);
    return {
      error: t("errors.generic"),
    };
  }
};
