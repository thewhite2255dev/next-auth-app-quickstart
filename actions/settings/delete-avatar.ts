"use server";

import { prisma } from "@/lib/prisma";
import { getUserById } from "@/data/auth/user";
import { currentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import cloudinary from "@/lib/cloudinary-config";
import { getCloudinaryPublicId } from "@/lib/utils/utils";
import { getTranslations } from "next-intl/server";

export const deleteAvatar = async () => {
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
    const publicId = getCloudinaryPublicId(dbUser.image || "");

    if (publicId) {
      await cloudinary.api.delete_resources([publicId], {
        type: "upload",
        resource_type: "image",
      });
    }

    await prisma.user.update({
      where: { id: dbUser.id },
      data: { image: null },
    });

    revalidatePath("/");

    return { success: t("zod.common.messages.avatarDeleted") };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return { error: t("common.messages.generic") };
  }
};
