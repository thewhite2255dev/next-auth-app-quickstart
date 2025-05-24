"use server";

import { getUserById } from "@/data/auth/user";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { ProfileFormValues } from "@/types/settings";
import { getTranslations } from "next-intl/server";

export const updateProfile = async (values: ProfileFormValues) => {
  const t = await getTranslations("Form");
  const user = await currentUser();

  try {
    if (!user) {
      return { error: t("errors.notAuthorized") };
    }

    const dbUser = await getUserById(user.id as string);

    if (!dbUser) {
      return { error: t("errors.notAuthorized") };
    }

    await prisma.user.update({
      where: {
        id: dbUser.id,
      },
      data: { ...values },
    });

    revalidatePath("/");

    return {
      success: true,
      message: t("settings.updateProfile.states.success"),
    };
  } catch (error) {
    console.error(t("settings.updateProfile.states.error"), error);
    return {
      error: t("errors.generic"),
    };
  }
};
