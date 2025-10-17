"use server";

import { getUserById } from "@/data/auth/user";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import cloudinary from "@/lib/cloudinary-config";
import { getCloudinaryPublicId } from "@/lib/utils/cloudinary";
import { getTranslations } from "next-intl/server";
import type { CloudinaryResource } from "@/types/cloudinary";

export const updateAvatar = async (resource: CloudinaryResource) => {
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

    return {
      success: true,
      message: t("Form.settings.updateAvatar.states.success"),
    };
  } catch (error) {
    console.error(t("Form.settings.updateAvatar.states.error"), error);
    return {
      error: t("Form.errors.generic"),
    };
  }
};
