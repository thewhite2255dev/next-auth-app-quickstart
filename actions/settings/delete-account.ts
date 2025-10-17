"use server";

import { prisma } from "@/lib/prisma";
import { getUserById } from "@/data/auth/user";
import { currentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import cloudinary from "@/lib/cloudinary-config";
import bcrypt from "bcryptjs";
import type { DeleteAccountFormValues } from "@/types/settings";
import { DeleteAccountSchema } from "@/schemas/settings";
import { getCloudinaryPublicId } from "@/lib/utils/cloudinary";
import { getTranslations } from "next-intl/server";
import type { ActionResult } from "@/types/action";

export const deleteAccount = async (
  values: DeleteAccountFormValues,
): Promise<ActionResult> => {
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

    const validateFields = DeleteAccountSchema(t).safeParse(values);

    if (!validateFields.success) {
      return {
        message: t("Form.errors.fields.invalid"),
      };
    }

    const { email, password } = validateFields.data;

    if (email && email !== dbUser.email) {
      return { error: t("Form.settings.deleteAccount.errors.email.incorrect") };
    }

    if (password && dbUser.password) {
      const isPasswordMatch = await bcrypt.compare(password, dbUser.password);

      if (!isPasswordMatch) {
        return {
          error: t("Form.settings.deleteAccount.errors.password.incorrect"),
        };
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
      message: t("Form.settings.deleteAccount.states.success"),
    };
  } catch (error) {
    console.error(t("Form.settings.deleteAccount.states.error"), error);
    return {
      error: t("Form.errors.generic"),
    };
  }
};
