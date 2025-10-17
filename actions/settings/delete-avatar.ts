"use server";

import { prisma } from "@/lib/prisma";
import { getUserById } from "@/data/auth/user";
import { currentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import cloudinary from "@/lib/cloudinary-config";
import { getCloudinaryPublicId } from "@/lib/utils/cloudinary";
import { getTranslations } from "next-intl/server";

export const deleteAvatar = async () => {
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
      where: { id: dbUser.id },
      data: { image: null },
    });

    revalidatePath("/");

    return {
      success: true,
      message: t("Form.settings.deleteAvatar.states.success"),
    };
  } catch (error) {
    console.error(t("Form.settings.deleteAvatar.states.error"), error);
    return {
      error: t("Form.errors.generic"),
    };
  }
};
