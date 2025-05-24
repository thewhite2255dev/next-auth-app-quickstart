"use server";

import bcrypt from "bcryptjs";

import { getUserById } from "@/data/auth/user";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { PasswordFormValues } from "@/types/settings";
import { getTranslations } from "next-intl/server";

export const updatePassword = async (values: PasswordFormValues) => {
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

    const updateData: Partial<Pick<typeof dbUser, "password">> = {};

    if (values.password && values.resetPassword) {
      const passwordsMatch = await bcrypt.compare(
        values.password,
        dbUser.password as string,
      );

      if (!passwordsMatch) {
        return {
          error: t("settings.updatePassword.errors.password.incorrect"),
        };
      }

      const hashedPassword = await bcrypt.hash(
        values.resetPassword as string,
        10,
      );
      updateData.password = hashedPassword;
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
      message: t("settings.updatePassword.states.success"),
    };
  } catch (error) {
    console.error(t("settings.updatePassword.states.error"), error);
    return {
      error: t("errors.generic"),
    };
  }
};
