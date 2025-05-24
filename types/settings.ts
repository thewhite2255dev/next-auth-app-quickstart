import * as z from "zod";
import {
  AccountFormSchema,
  AuthenticationFormSchema,
  DeleteAccountSchema,
  PasswordFormSchema,
  ProfileFormSchema,
} from "@/schemas/settings";

export type ProfileFormValues = z.infer<ReturnType<typeof ProfileFormSchema>>;
export type AccountFormValues = z.infer<ReturnType<typeof AccountFormSchema>>;
export type DeleteAccountFormValues = z.infer<
  ReturnType<typeof DeleteAccountSchema>
>;
export type PasswordFormValues = z.infer<ReturnType<typeof PasswordFormSchema>>;
export type AuthenticationFormValues = z.infer<
  ReturnType<typeof AuthenticationFormSchema>
>;
