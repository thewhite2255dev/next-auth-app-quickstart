"use server";

import { getTranslations } from "next-intl/server";
import { authenticator } from "otplib";

export const verifyTOTP = async (token: string, secret: string) => {
  const t = await getTranslations();

  try {
    if (!token || !secret) {
      return { error: t("Form.errors.notAuthorized") };
    }

    const valid = authenticator.verify({ token, secret });

    return {
      message: t("Form.totp.verify.states.success"),
      totp: valid,
    };
  } catch (error) {
    console.error(t("Form.totp.verify.states.error"), error);
    return {
      error: t("Form.errors.generic"),
    };
  }
};
