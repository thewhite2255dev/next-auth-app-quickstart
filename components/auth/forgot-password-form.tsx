"use client";

import { ForgotPasswordFormSchema } from "@/schemas/auth";
import { ForgotPasswordFormValues } from "@/types/auth";
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
import { forgotPassword } from "@/actions/auth/forgot-password";
import FormError from "../form-error";
import { Check, Loader2 } from "lucide-react";
import { AuthCard } from "./auth-card";
import { BackButton } from "./back-button";
import { ResendButton } from "./resend-button";
import FormSuccess from "../form-success";
import { resendForgotPasswordLink } from "@/actions/auth/resend-forgot-password-link";

export function ForgotPasswordForm() {
  const t = useTranslations("Form");

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [countdown, setCountdown] = useState(20);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(ForgotPasswordFormSchema(t)),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: ForgotPasswordFormValues) {
    setError("");

    startTransition(async () => {
      const result = await forgotPassword(values);
      if (result?.success) {
        setIsSubmitted(true);
      }

      if (result?.error) {
        setError(result?.error);
      }
    });
  }

  const handleResendLink = () => {
    setError("");
    setSuccess("");
    setCountdown(20);

    startTransition(async () => {
      const result = await resendForgotPasswordLink(form.getValues("email"));

      if (result?.error) {
        setError(result?.error);
      }

      if (result?.success && result?.message) {
        setSuccess(result?.message);
      }
    });
  };

  return (
    <AuthCard
      title={t("forgotPassword.title")}
      description={!isSubmitted ? t("forgotPassword.description") : ""}
      footer={
        !isSubmitted ? (
          <BackButton href="/auth/login" label={t("auth.backToLogin")} />
        ) : (
          <p className="text-muted-foreground text-sm">
            {t.rich("editAccount", {
              button: (chunks) => (
                <button
                  onClick={() => {
                    setCountdown(20);
                    setIsSubmitted(false);
                  }}
                  className="text-primary underline-offset-4 hover:underline"
                >
                  {chunks}
                </button>
              ),
            })}
          </p>
        )
      }
    >
      {!isSubmitted ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>{t("forgotPassword.fields.email")}</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} type="email" {...field} />
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
                t("forgotPassword.button")
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
            {t.rich("forgotPassword.successCard.description", {
              strong: (chunks) => (
                <span className="font-medium">{form.getValues("email")}</span>
              ),
            })}
          </p>
          <FormError message={error} />
          <FormSuccess message={success} />
          <div className="py-2">
            <ResendButton
              variant="outline"
              label={t("common.link")}
              handler={handleResendLink}
              initialCountdown={countdown}
              isLoading={isPending}
            />
          </div>
        </div>
      )}
    </AuthCard>
  );
}
