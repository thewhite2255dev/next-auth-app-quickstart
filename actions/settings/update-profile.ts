"use server";

import { getUserById } from "@/data/auth/user";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { ProfileFormValues } from "@/types/settings";
import { getTranslations } from "next-intl/server";

export const updateProfile = async (values: ProfileFormValues) => {
  const t = await getTranslations();
  const user = await currentUser();

  if (!user) {
    return { error: t("common.messages.notAuthorized") };
  }

  const dbUser = await getUserById(user.id as string);

  if (!dbUser) {
    return { error: t("common.messages.notAuthorized") };
  }

  try {
    await prisma.user.update({
      where: {
        id: dbUser.id,
      },
      data: { ...values },
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return { error: t("common.messages.generic") };
  }

  revalidatePath("/");

  return { success: t("zod.common.messages.profileUpdated") };
};
