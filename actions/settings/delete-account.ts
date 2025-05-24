"use server";

import { prisma } from "@/lib/prisma";
import { getUserById } from "@/data/auth/user";
import { currentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import cloudinary from "@/lib/cloudinary-config";
import bcrypt from "bcryptjs";
import { DeleteAccountFormValues } from "@/types/settings";
import { DeleteAccountSchema } from "@/schemas/settings";
import { getCloudinaryPublicId } from "@/lib/utils/cloudinary";
import { getTranslations } from "next-intl/server";
import { ActionResult } from "@/types/action";

export const deleteAccount = async (
  values: DeleteAccountFormValues,
): Promise<ActionResult> => {
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

    const validateFields = DeleteAccountSchema(t).safeParse(values);

    if (!validateFields.success) {
      return {
        message: t("errors.fields.invalid"),
      };
    }

    const { email, password } = validateFields.data;

    if (email && email !== dbUser.email) {
      return { error: t("settings.deleteAccount.errors.email.incorrect") };
    }

    if (password && dbUser.password) {
      const isPasswordMatch = await bcrypt.compare(password, dbUser.password);

      if (!isPasswordMatch) {
        return { error: t("settings.deleteAccount.errors.password.incorrect") };
      }
    }

    const publicId = getCloudinaryPublicId(dbUser.image || "");

    if (publicId) {
      await cloudinary.api.delete_resources([publicId], {
        type: "upload",
        resource_type: "image",
      });
    }

    await prisma.user.delete({
      where: {
        email,
      },
    });

    revalidatePath("/");

    return {
      success: true,
      message: t("settings.deleteAccount.states.success"),
    };
  } catch (error) {
    console.error(t("settings.deleteAccount.states.error"), error);
    return {
      error: t("errors.generic"),
    };
  }
};
