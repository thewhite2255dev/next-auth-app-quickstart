"use server";

import { getUserById } from "@/data/auth/user";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { AccountFormValues } from "@/types/settings";
import { getTranslations } from "next-intl/server";

export const updateAccount = async (values: AccountFormValues) => {
  const t = await getTranslations("Form");
  const user = await currentUser();

  try {
    if (!user) {
      return { error: t("errors.notAuthorized") };
    }

    const dbUser = await getUserById(user.id);

    if (!dbUser) {
      return { error: t("errors.notAuthorized") };
    }

    // if (values.username && values.username !== dbUser.username) {
    //   const existingUser = await getUserByUsername(values.username);

    //   if (existingUser) {
    //     return { error: t("settings.usernameFound") };
    //   }
    // }

    await prisma.user.update({
      where: {
        id: dbUser.id,
      },
      data: { ...values },
    });

    revalidatePath("/");

    return {
      success: true,
      message: t("settings.updateAccount.states.success"),
    };
  } catch (error) {
    console.error(t("settings.updateAccount.states.error"), error);
    return {
      error: t("errors.generic"),
    };
  }
};
