"use server";

import { getUserById } from "@/data/auth/user";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import type { AccountFormValues } from "@/types/settings";
import { getTranslations } from "next-intl/server";

export const updateAccount = async (values: AccountFormValues) => {
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

    // if (values.username && values.username !== dbUser.username) {
    //   const existingUser = await getUserByUsername(values.username);

    //   if (existingUser) {
    //     return { error: t("Form.settings.usernameFound") };
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
      message: t("Form.settings.updateAccount.states.success"),
    };
  } catch (error) {
    console.error(t("Form.settings.updateAccount.states.error"), error);
    return {
      error: t("Form.errors.generic"),
    };
  }
};
