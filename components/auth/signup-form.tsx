"use client";

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
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import type { SignupFormValues } from "@/types/auth";
import { Loader2, EyeOff, Eye } from "lucide-react";
import { SocialButtons, SocialDivider } from "./social-buttons";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupFormSchema } from "@/schemas/auth";
import FormError from "../form-error";
import { useSession } from "next-auth/react";
import { signup } from "@/actions/auth/signup";
import { Link } from "@/i18n/navigation";
import { AuthCard } from "./auth-card";
import { VerifyEmailCard } from "./verify-email-card";
import { BackButton } from "./back-button";

export function SignupForm() {
  const t = useTranslations();

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [step, setStep] = useState<"Credential" | "VerifyEmail">("Credential");

  const { update } = useSession();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(SignupFormSchema(t)),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  async function onSubmit(values: SignupFormValues) {
    setError("");

    startTransition(async () => {
      const result = await signup(values);
      if (result?.success) {
        await update();
        setStep("VerifyEmail");
      }

      if (result?.error) {
        setError(result?.error);
      }
    });
  }

  return (
    <AuthCard
      title={
        step === "Credential"
          ? t("Form.signup.title")
          : t("Form.verifyEmail.pending.title")
      }
      description={step === "Credential" ? t("Form.signup.description") : ""}
      footer={
        step === "Credential" ? (
          <p className="text-muted-foreground text-sm">
            {t.rich("Form.signup.haveAccount", {
              link: (chunks) => (
                <Link
                  href="/auth/login"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  {chunks}
                </Link>
              ),
            })}
          </p>
        ) : (
          <BackButton href="/auth/login" label={t("Form.auth.backToLogin")} />
        )
      }
    >
      {step === "VerifyEmail" && (
        <VerifyEmailCard
          email={form.getValues("email")}
          description={
            t.rich("Form.verifyEmail.pending.description", {
              email: form.getValues("email"),
              strong: (chunks) => <span className="font-medium">{chunks}</span>,
            }) as string
          }
        />
      )}
      {step === "Credential" && (
        <div className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>{t("Form.signup.fields.name")}</FormLabel>
                      <FormControl>
                        <Input disabled={isPending} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>{t("Form.signup.fields.email")}</FormLabel>
                      <FormControl>
                        <Input disabled={isPending} type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>{t("Form.signup.fields.password")}</FormLabel>
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
              </div>
              <FormError message={error} />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  t("Form.signup.button")
                )}
              </Button>
            </form>
          </Form>

          <SocialDivider text={t("Form.auth.orSignInWith")} />
          <SocialButtons providers={["google", "github"]} />
        </div>
      )}
    </AuthCard>
  );
}
