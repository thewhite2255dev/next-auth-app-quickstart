"use server";

import { getUserById } from "@/data/auth/user";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import type { AuthenticationFormValues } from "@/types/settings";
import { getTranslations } from "next-intl/server";

export const updateAuthentication = async (
  values: AuthenticationFormValues,
) => {
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

    const updateData: Partial<Pick<typeof dbUser, "isTwoFactorEnabled">> = {};

    if (values.isTwoFactorEnabled !== undefined) {
      updateData.isTwoFactorEnabled = values.isTwoFactorEnabled;
    }

    await prisma.user.update({
      where: {
        id: dbUser.id,
      },
      data: updateData,
    });

    revalidatePath("/");

    return {
      success: true,
      message: t("Form.settings.updateAuthentication.states.success"),
    };
  } catch (error) {
    console.error(t("Form.settings.updateAuthentication.states.error"), error);
    return {
      error: t("Form.errors.generic"),
    };
  }
};
