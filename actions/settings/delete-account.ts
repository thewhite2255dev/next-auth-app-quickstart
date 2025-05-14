"use server";

import { prisma } from "@/lib/prisma";
import { getUserById } from "@/data/auth/user";
import { currentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import cloudinary from "@/lib/cloudinary-config";
import bcrypt from "bcryptjs";
import { DeleteAccountFormValues } from "@/types/settings";
import { DeleteAccountSchema } from "@/schemas/settings";
import { getCloudinaryPublicId } from "@/lib/utils/utils";
import { getTranslations } from "next-intl/server";

export const deleteAccount = async (values: DeleteAccountFormValues) => {
  const t = await getTranslations();
  const user = await currentUser();

  if (!user) {
    return { error: t("common.messages.notAuthorized") };
  }

  const dbUser = await getUserById(user.id as string);

  if (!dbUser) {
    return { error: t("common.messages.notAuthorized") };
  }

  const validateFields = DeleteAccountSchema(t).safeParse(values);

  if (!validateFields.success) {
    return { error: t("zod.common.messages.missingToken") };
  }

  const { email, password } = validateFields.data;

  if (email && email !== dbUser.email) {
    return { error: t("zod.common.messages.incorrectEmail") };
  }

  if (password && dbUser.password) {
    const isPasswordMatch = await bcrypt.compare(password, dbUser.password);

    if (!isPasswordMatch) {
      return { error: t("zod.common.messages.incorrectPassword") };
    }
  }

  try {
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

    return { success: t("zod.common.messages.accountDeleted") };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return { error: t("common.messages.generic") };
  }
};
