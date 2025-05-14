"use server";

import { getUserById, getUserByUsername } from "@/data/auth/user";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { AccountFormValues } from "@/types/settings";
import { getTranslations } from "next-intl/server";

export const updateAccount = async (values: AccountFormValues) => {
  const t = await getTranslations();

  const user = await currentUser();

  if (!user) {
    return { error: t("common.messages.notAuthorized") };
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return { error: t("common.messages.notAuthorized") };
  }

  if (values.username && values.username !== dbUser.username) {
    const existingUser = await getUserByUsername(values.username);

    if (existingUser) {
      return { error: t("zod.common.messages.usernameFound") };
    }
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

  return { success: t("zod.common.messages.accountUpdated") };
};
