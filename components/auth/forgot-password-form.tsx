"use client";

import { ForgotPasswordFormSchema } from "@/schemas/auth";
import type { ForgotPasswordFormValues } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
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
import { AUTH_CONSTANTS } from "@/lib/auth-constants";

export function ForgotPasswordForm() {
  const t = useTranslations();

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(20);

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
    setCountdown(AUTH_CONSTANTS.TWO_FA_RESEND_DELAY);

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
      title={t("Form.forgotPassword.title")}
      description={!isSubmitted ? t("Form.forgotPassword.description") : ""}
      footer={
        !isSubmitted ? (
          <BackButton href="/auth/login" label={t("Form.auth.backToLogin")} />
        ) : (
          <p className="text-muted-foreground text-sm">
            {t.rich("Form.editAccount", {
              button: (chunks) => (
                <button
                  onClick={() => {
                    setCountdown(AUTH_CONSTANTS.TWO_FA_RESEND_DELAY);
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
                  <FormLabel>{t("Form.forgotPassword.fields.email")}</FormLabel>
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
                t("Form.forgotPassword.button")
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
            {t.rich("Form.forgotPassword.successCard.description", {
              email: form.getValues("email"),
              strong: (chunks) => <span className="font-medium">{chunks}</span>,
            })}
          </p>
          <FormError message={error} />
          <FormSuccess message={success} />
          <div className="py-2">
            <ResendButton
              variant="outline"
              label={t("Form.common.link")}
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
