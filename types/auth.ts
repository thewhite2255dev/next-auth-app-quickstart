import * as z from "zod";
import {
  ForgotPasswordFormSchema,
  OnboardingFormSchema,
  LoginFormSchema,
  ResetPasswordFormSchema,
  SignupFormSchema,
} from "@/schemas/auth";

export type LoginFormValues = z.infer<ReturnType<typeof LoginFormSchema>>;
export type SignupFormValues = z.infer<ReturnType<typeof SignupFormSchema>>;
export type ForgotPasswordFormValues = z.infer<
  ReturnType<typeof ForgotPasswordFormSchema>
>;
export type ResetPasswordFormValues = z.infer<
  ReturnType<typeof ResetPasswordFormSchema>
>;
export type OnboardingFormValues = z.infer<
  ReturnType<typeof OnboardingFormSchema>
>;
