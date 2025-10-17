"use server";

import { getUserById } from "@/data/auth/user";
import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { ActionResult } from "@/types/action";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { authenticator } from "otplib";
import QRCode from "qrcode";

export const generateTOTP = async (service: string): Promise<ActionResult> => {
  const t = await getTranslations();
  const user = await currentUser();

  try {
    if (!user) {
      return { error: t("Form.errors.notAuthorized") };
    }

    const dbUser = await getUserById(user.id);

    if (!dbUser) {
      return { error: t("Form.errors.notAuthorized") };
    }

    const secret = authenticator.generateSecret();
    const uri = authenticator.keyuri(user?.email, service, secret);
    const qr = await QRCode.toDataURL(uri, { margin: 1, width: 300 });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isTotpEnabled: true,
        totpSecret: secret,
      },
    });

    revalidatePath("/");

    return {
      success: true,
      message: t("Form.totp.generate.states.success"),
      data: { secret, uri, qr },
    };
  } catch (error) {
    console.error(t("Form.totp.generate.states.error"), error);
    return {
      error: t("Form.errors.generic"),
    };
  }
};
