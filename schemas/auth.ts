/* eslint-disable @typescript-eslint/no-explicit-any */
import * as z from "zod";

export const LoginFormSchema = (t: (key: string, object?: any) => string) =>
  z.object({
    email: z
      .string()
      .min(1, {
        message: t("Form.login.errors.email.required"),
      })
      .email({
        message: t("Form.login.errors.email.invalid"),
      }),
    password: z.string().min(1, {
      message: t("Form.login.errors.password.required"),
    }),
    code: z.string().optional(),
  });

export const SignupFormSchema = (t: (key: string, object?: any) => string) =>
  z.object({
    email: z
      .string()
      .min(1, {
        message: t("Form.signup.errors.email.required"),
      })
      .email({
        message: t("Form.signup.errors.email.invalid"),
      }),
    password: z
      .string()
      .min(1, {
        message: t("Form.signup.errors.password.required"),
      })
      .min(8, {
        message: t("Form.signup.errors.password.minLength", { min: 8 }),
      }),
    name: z
      .string()
      .min(1, {
        message: t("Form.signup.errors.name.required"),
      })
      .min(2, {
        message: t("Form.signup.errors.name.minLength", { min: 2 }),
      })
      .max(50, {
        message: t("Form.signup.errors.name.maxLength", { max: 50 }),
      }),
  });

export const ResetPasswordFormSchema = (
  t: (key: string, object?: any) => string,
) =>
  z.object({
    password: z
      .string()
      .min(1, {
        message: t("Form.resetPassword.errors.password.required"),
      })
      .min(8, {
        message: t("Form.resetPassword.errors.password.minLength", { min: 8 }),
      }),
  });

export const ForgotPasswordFormSchema = (
  t: (key: string, object?: any) => string,
) =>
  z.object({
    email: z
      .string()
      .min(1, {
        message: t("Form.forgotPassword.errors.email.required"),
      })
      .email({
        message: t("Form.forgotPassword.errors.email.invalid"),
      }),
  });
