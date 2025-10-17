/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserRole } from "@prisma/client";
import * as z from "zod";

export const ProfileFormSchema = (t: (key: string, object?: any) => string) =>
  z.object({
    name: z
      .string()
      .min(2, {
        message: t("Form.settings.profile.errors.name.minLength", { min: 2 }),
      })
      .max(50, {
        message: t("Form.settings.profile.errors.name.maxLength", { max: 50 }),
      })
      .optional(),
    bio: z
      .string()
      .max(200, t("Form.settings.profile.errors.bio.maxLength", { max: 200 }))
      .optional(),
    location: z
      .string()
      .max(
        100,
        t("Form.settings.profile.errors.location.maxLength", { max: 100 }),
      )
      .optional(),
  });

export const AccountFormSchema = (t: (key: string, object?: any) => string) =>
  z.object({
    username: z
      .string()
      .min(3, {
        message: t("Form.settings.account.errors.username.minLength", {
          min: 3,
        }),
      })
      .max(30, {
        message: t("Form.settings.account.errors.username.maxLength", {
          max: 30,
        }),
      })
      .regex(
        /^[a-zA-Z0-9](?:[a-zA-Z0-9_-]*[a-zA-Z0-9])?$/,
        t("Form.settings.account.errors.username.invalidPattern"),
      ),
    role: z.enum([UserRole.ADMIN, UserRole.USER]).superRefine((val, ctx) => {
      if (!val) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("Form.settings.account.errors.role.invalid"),
        });
      }
    }),
  });

export const DeleteAccountSchema = (t: (key: string, object?: any) => string) =>
  z
    .object({
      email: z.string().email({
        message: t("Form.settings.deleteAccount.errors.email.invalid"),
      }),
      confirmation: z.string().min(1, {
        message: t("Form.settings.deleteAccount.errors.confirmation.required"),
      }),
      password: z.string().min(1, {
        message: t("Form.settings.deleteAccount.errors.password.required"),
      }),
    })
    .refine(
      (data) => {
        if (
          data.confirmation !== "delete my account" &&
          data.confirmation !== "supprimer mon compte"
        ) {
          return false;
        }
        return true;
      },
      {
        message: t("Form.settings.deleteAccount.errors.confirmation.invalid"),
        path: ["confirmation"],
      },
    );

export const PasswordFormSchema = (t: (key: string, object?: any) => string) =>
  z
    .object({
      password: z.optional(
        z.string().min(1, {
          message: t("Form.settings.password.errors.current.required"),
        }),
      ),
      resetPassword: z.optional(
        z.string().min(6, {
          message: t("Form.settings.password.errors.new.minLength", { min: 6 }),
        }),
      ),
    })
    .refine(
      (data) => {
        if (data.password && !data.resetPassword) {
          return false;
        }
        return true;
      },
      {
        message: t("Form.settings.password.errors.new.required"),
        path: ["resetPassword"],
      },
    )
    .refine(
      (data) => {
        if (data.resetPassword && !data.password) {
          return false;
        }
        return true;
      },
      {
        message: t("Form.settings.password.errors.current.required"),
        path: ["password"],
      },
    );

export const AuthenticationFormSchema = (t: (key: string) => string) =>
  z.object({
    isTwoFactorEnabled: z.boolean().superRefine((val, ctx) => {
      if (typeof val !== "boolean") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("Form.settings.authentication.errors.twoFactor.invalid"),
        });
      }
    }),
  });
