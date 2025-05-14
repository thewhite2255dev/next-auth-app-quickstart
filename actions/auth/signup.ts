"use server";

import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { getUserByEmail, getUserByUsername } from "@/data/auth/user";
import { generateVerificationToken } from "@/data/auth/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import { SignupFormValues } from "@/types/auth";
import { SignupFormSchema } from "@/schemas/auth";
import { getTranslations } from "next-intl/server";

export const signup = async (values: SignupFormValues) => {
  const t = await getTranslations("Form");

  try {
    const validateFields = SignupFormSchema(t).safeParse(values);

    if (!validateFields.success) {
      return { error: t("errors.fields.invalid") };
    }

    const { email, password } = validateFields.data;

    // if (username) {
    //   const existingUser = await getUserByUsername(username);

    //   if (existingUser) {
    //     return { error: t("errors.usernameFound") };
    //   }
    // }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      values.password = hashedPassword;
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return { error: t("errors.emailFound") };
    }

    const normalizedEmail = email.toLowerCase();

    await prisma.user.create({
      data: {
        ...values,
        email: normalizedEmail,
        username: "",
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars

    const verificationToken = await generateVerificationToken(email);

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
    );

    return { success: t("signup.states.success") };
  } catch (error) {
    console.error(t("signup.states.error"), error);
    return { error: t("errors.generic") };
  }
};
