"use server";

import bcrypt from "bcryptjs";

import { getUserById } from "@/data/auth/user";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { PasswordFormValues } from "@/types/settings";
import { getTranslations } from "next-intl/server";

export const updatePassword = async (values: PasswordFormValues) => {
  const t = await getTranslations();
  const user = await currentUser();

  if (!user) {
    return { error: t("common.messages.notAuthorized") };
  }

  const dbUser = await getUserById(user.id as string);

  if (!dbUser) {
    return { error: t("common.messages.notAuthorized") };
  }

  const updateData: Partial<Pick<typeof dbUser, "password">> = {};

  if (values.password && values.resetPassword) {
    const passwordsMatch = await bcrypt.compare(
      values.password,
      dbUser.password as string,
    );

    if (!passwordsMatch) {
      return { error: t("zod.common.messages.incorrectPassword") };
    }

    const hashedPassword = await bcrypt.hash(
      values.resetPassword as string,
      10,
    );
    updateData.password = hashedPassword;
  }

  try {
    await prisma.user.update({
      where: {
        id: dbUser.id,
      },
      data: updateData,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return { error: t("common.messages.generic") };
  }

  revalidatePath("/");

  return { success: t("zod.common.messages.passwordUpdated") };
};
