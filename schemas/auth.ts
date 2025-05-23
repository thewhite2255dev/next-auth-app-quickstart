/* eslint-disable @typescript-eslint/no-explicit-any */
import * as z from "zod";

export const LoginFormSchema = (t: (key: string, object?: any) => string) =>
  z.object({
    email: z
      .string()
      .min(1, {
        message: t("login.errors.email.required"),
      })
      .email({
        message: t("login.errors.email.invalid"),
      }),
    password: z.string().min(1, {
      message: t("login.errors.password.required"),
    }),
    code: z.string().optional(),
  });

export const SignupFormSchema = (t: (key: string, object?: any) => string) =>
  z.object({
    email: z
      .string()
      .min(1, {
        message: t("signup.errors.email.required"),
      })
      .email({
        message: t("signup.errors.email.invalid"),
      }),
    password: z
      .string()
      .min(1, {
        message: t("signup.errors.password.required"),
      })
      .min(8, {
        message: t("signup.errors.password.minLength", { min: 8 }),
      }),
    name: z
      .string()
      .min(1, {
        message: t("signup.errors.name.required"),
      })
      .min(2, {
        message: t("signup.errors.name.minLength", { min: 2 }),
      })
      .max(50, {
        message: t("signup.errors.name.maxLength", { max: 50 }),
      }),
  });

export const ResetPasswordFormSchema = (
  t: (key: string, object?: any) => string,
) =>
  z.object({
    password: z
      .string()
      .min(1, {
        message: t("resetPassword.errors.password.required"),
      })
      .min(8, {
        message: t("resetPassword.errors.password.minLength", { min: 8 }),
      }),
  });

export const ForgotPasswordFormSchema = (
  t: (key: string, object?: any) => string,
) =>
  z.object({
    email: z
      .string()
      .min(1, {
        message: t("forgotPassword.errors.email.required"),
      })
      .email({
        message: t("forgotPassword.errors.email.invalid"),
      }),
  });
