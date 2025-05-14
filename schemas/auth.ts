/* eslint-disable @typescript-eslint/no-explicit-any */
import * as z from "zod";

export const LoginFormSchema = (t: (key: string, object?: any) => string) =>
  z.object({
    email: z.string().email({
      message: t("login.errors.email.invalid"),
    }),
    password: z.string().min(1, {
      message: t("login.errors.password.required"),
    }),
    code: z.string().optional(),
  });

export const SignupFormSchema = (t: (key: string, object?: any) => string) =>
  z.object({
    email: z.string().email({
      message: t("signup.errors.email.invalid"),
    }),
    password: z.string().min(6, {
      message: t("signup.errors.password.minLength", { min: 6 }),
    }),
    name: z
      .string()
      .min(2, {
        message: t("signup.errors.name.minLength", { min: 2 }),
      })
      .max(50, {
        message: t("signup.errors.name.maxLength", { max: 50 }),
      }),
  });

export const OnboardingFormSchema = (
  t: (key: string, object?: any) => string,
) =>
  z.object({
    password: z.string().min(6, {
      message: t("onboarding.errors.password.minLength", { min: 6 }),
    }),
    name: z
      .string()
      .min(1, {
        message: t("onboarding.errors.name.minLength", { min: 1 }),
      })
      .max(50, {
        message: t("onboarding.errors.name.maxLength", { max: 50 }),
      }),
  });

export const ResetPasswordFormSchema = (
  t: (key: string, object?: any) => string,
) =>
  z.object({
    password: z.string().min(6, {
      message: t("resetPassword.errors.password.minLength", { min: 6 }),
    }),
  });

export const ForgotPasswordFormSchema = (
  t: (key: string, object?: any) => string,
) =>
  z.object({
    email: z.string().email({
      message: t("forgotPassword.errors.email.invalid"),
    }),
  });
