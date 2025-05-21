"use client";

import { ResetPasswordFormSchema } from "@/schemas/auth";
import { ResetPasswordFormValues } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState, useTransition } from "react";
import { resetPassword } from "@/actions/auth/reset-password";
import FormError from "../form-error";
import { Check, Eye, EyeOff, Loader2 } from "lucide-react";
import { AuthCard } from "./auth-card";
import { BackButton } from "./back-button";
import { useSearchParams } from "next/navigation";

export function ResetPasswordForm() {
  const t = useTranslations("Form");

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(ResetPasswordFormSchema(t)),
    defaultValues: {
      password: "",
    },
  });

  async function onSubmit(values: ResetPasswordFormValues) {
    setError("");

    startTransition(async () => {
      const result = await resetPassword(values, token);
      if (result?.success) {
        setIsSubmitted(true);
        form.reset();
      }

      if (result?.error) {
        setError(result?.error);
      }
    });
  }

  return (
    <AuthCard
      title={t("resetPassword.title")}
      description={
        !isSubmitted ? t("resetPassword.description.enterEmail") : ""
      }
      footer={<BackButton href="/auth/login" label={t("auth.backToLogin")} />}
    >
      {!isSubmitted ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>{t("login.fields.password")}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        disabled={isPending}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormError message={error} />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                t("resetPassword.button")
              )}
            </Button>
          </form>
        </Form>
      ) : (
        <div className="space-y-4 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-emerald-100 p-3">
              <Check className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
          <p className="text-muted-foreground">
            {t("resetPassword.success.description")}
          </p>
        </div>
      )}
    </AuthCard>
  );
}
