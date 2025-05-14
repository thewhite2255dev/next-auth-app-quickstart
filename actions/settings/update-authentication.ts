"use server";

import { getUserById } from "@/data/auth/user";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { AuthenticationFormValues } from "@/types/settings";
import { getTranslations } from "next-intl/server";

export const updateAuthentication = async (
  values: AuthenticationFormValues,
) => {
  const t = await getTranslations();
  const user = await currentUser();

  if (!user) {
    return { error: t("common.messages.notAuthorized") };
  }

  const dbUser = await getUserById(user.id as string);

  if (!dbUser) {
    return { error: t("common.messages.notAuthorized") };
  }

  const updateData: Partial<Pick<typeof dbUser, "isTwoFactorEnabled">> = {};

  if (values.isTwoFactorEnabled !== undefined) {
    updateData.isTwoFactorEnabled = values.isTwoFactorEnabled;
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

  return { success: t("zod.common.messages.authenticationUpdated") };
};
