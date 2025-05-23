"use server";

import { getUserById } from "@/data/auth/user";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import cloudinary from "@/lib/cloudinary-config";
import { getCloudinaryPublicId } from "@/lib/utils/cloudinary";
import { getTranslations } from "next-intl/server";
import { CloudinaryResource } from "@/types/cloudinary";

export const updateAvatar = async (resource: CloudinaryResource) => {
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
      where: {
        id: dbUser.id,
      },
      data: {
        image: resource.secure_url,
      },
    });

    revalidatePath("/");

    return { success: t("zod.common.messages.avatarUpdated") };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return { error: t("common.messages.generic") };
  }
};
