"use server";

import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { getUserByEmail } from "@/data/auth/user";
import { generateVerificationToken } from "@/data/auth/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import type { SignupFormValues } from "@/types/auth";
import { SignupFormSchema } from "@/schemas/auth";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";

export const signup = async (values: SignupFormValues) => {
  const t = await getTranslations();

  try {
    const validateFields = SignupFormSchema(t).safeParse(values);

    if (!validateFields.success) {
      return { error: t("Form.errors.fields.invalid") };
    }

    const { email, password } = validateFields.data;

    // if (username) {
    //   const existingUser = await getUserByUsername(username);

    //   if (existingUser) {
    //     return { error: t("Form.errors.usernameFound") };
    //   }
    // }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      values.password = hashedPassword;
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return { error: t("Form.errors.emailFound") };
    }

    const normalizedEmail = email.toLowerCase();

    await prisma.user.create({
      data: {
        ...values,
        email: normalizedEmail,
      },
    });

    const verificationToken = await generateVerificationToken(email);

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
    );

    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error(t("Form.signup.states.error"), error);
    return { error: t("Form.errors.generic") };
  }
};
