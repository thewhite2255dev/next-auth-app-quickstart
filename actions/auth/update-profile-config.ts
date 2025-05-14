"use server";

import { getUserById, getUserByUsername } from "@/data/auth/user";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { OnboardingFormSchema } from "@/schemas/auth";
import { getTranslations } from "next-intl/server";
import { OnboardingFormValues } from "@/types/auth";

export const updateProfileConfig = async (values: OnboardingFormValues) => {
  const t = await getTranslations("Form");

  try {
    const user = await currentUser();

    if (!user) {
      return { error: t("errors.notAuthorized") };
    }

    const dbUser = await getUserById(user.id as string);

    if (!dbUser) {
      return { error: t("errors.notAuthorized") };
    }

    const validateFields = OnboardingFormSchema(t).safeParse(values);

    if (!validateFields.success) {
      return { error: t("errors.fields.invalid") };
    }

    const { username, password } = validateFields.data;

    if (username && username !== dbUser.username) {
      const existingUser = await getUserByUsername(username);

      if (existingUser) {
        return { error: t("errors.usernameFound") };
      }
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      values.password = hashedPassword;
    }

    await prisma.user.update({
      where: {
        id: dbUser.id,
      },
      data: { ...values },
    });

    revalidatePath("/");

    return { success: t("profile.states.completed") };
  } catch (error) {
    console.log(t("profile.states.error"));
    return { error: t("errors.generic") };
  }
};
