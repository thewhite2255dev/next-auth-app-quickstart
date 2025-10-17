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
import { useRouter, useSearchParams } from "next/navigation";
import type { LoginFormValues } from "@/types/auth";
import { Loader2, EyeOff, Eye } from "lucide-react";
import { SocialButtons, SocialDivider } from "./social-buttons";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormSchema } from "@/schemas/auth";
import FormError from "../form-error";
import { useSession } from "next-auth/react";
import { login } from "@/actions/auth/login";
import { Link } from "@/i18n/navigation";
import { OtpInputField } from "./otp-input-field";
import { AuthCard } from "./auth-card";
import { BackButton } from "./back-button";
import { ResendButton } from "./resend-button";
import { resendTwoFactorCode } from "@/actions/auth/resend-two-factor-code";
import FormSuccess from "../form-success";
import { DEFAULT_LOGIN_REDIRECT } from "@/lib/config";
import { VerifyEmailCard } from "./verify-email-card";
import { AUTH_CONSTANTS } from "@/lib/auth-constants";
export function LoginForm() {
  const t = useTranslations();
  const { update } = useSession();

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callback_url") || undefined;
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? t("Form.errors.OAuthAccountNotLinked")
      : "";
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [isTwoFactorAuthPending] = useTransition();
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [step, setStep] = useState<
    "Credential" | "TwoFactor" | "Totp" | "VerifyEmail"
  >("Credential");
  const [countdown, setCountdown] = useState<number>(
    AUTH_CONSTANTS.TWO_FA_RESEND_DELAY,
  );

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginFormSchema(t)),
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  });

  async function handleSubmit(values: LoginFormValues) {
    setError("");
    setSuccess("");

    startTransition(async () => {
      const result = await login(values);

      if (result?.success) {
        await update();
        router.push(callbackUrl || DEFAULT_LOGIN_REDIRECT);
      }

      if (result?.error) {
        setError(result?.error);
      }

      if (result?.twoFactor) {
        setStep("TwoFactor");
      }

      if (result?.totp) {
        setStep("Totp");
      }

      if (result?.verifyEmail) {
        setStep("VerifyEmail");
      }
    });
  }

  const handleResendCode = () => {
    setError("");
    setSuccess("");
    setCountdown(AUTH_CONSTANTS.TWO_FA_RESEND_DELAY);

    startTransition(async () => {
      const result = await resendTwoFactorCode(form.getValues("email"));

      if (result?.error) {
        setError(result?.error);
      }

      if (result?.success && result?.message) {
        setSuccess(result?.message);
      }
    });
  };

  const handleTwoFactorAuth = async () => {
    setError("");
    setSuccess("");
    setCountdown(AUTH_CONSTANTS.TWO_FA_RESEND_DELAY);

    startTransition(async () => {
      const result = await resendTwoFactorCode(form.getValues("email"));
      if (result?.error) {
        setError(result.error);
      } else if (result?.success) {
        setStep("TwoFactor");
      }
    });
  };

  return (
    <AuthCard
      title={
        step === "TwoFactor" || step === "Totp"
          ? t("Form.twoFactor.title")
          : step === "Credential"
            ? t("Form.login.title")
            : t("Form.verifyEmail.pending.title")
      }
      description={
        step === "Totp"
          ? "Ouvrez votre application d'authentification et saisissez le code généré ci-dessous."
          : step === "TwoFactor"
            ? (t.rich("Form.twoFactor.description", {
                email: form.getValues("email"),
                strong: (chunks) => (
                  <span className="font-medium">{chunks}</span>
                ),
              }) as string)
            : step === "Credential"
              ? t("Form.login.description")
              : ""
      }
      footer={
        <>
          {step === "TwoFactor" && (
            <BackButton
              onClick={() => {
                setError("");
                setStep("Credential");
                form.reset();
              }}
              label={t("Form.auth.backToLogin")}
            />
          )}
          {step === "Totp" && (
            <BackButton
              onClick={() => {
                setError("");
                setStep("Credential");
                form.reset();
              }}
              label={t("Form.auth.backToLogin")}
            />
          )}
          {step === "Credential" && (
            <p className="text-muted-foreground text-sm">
              {t.rich("Form.login.createAccount", {
                link: (chunks) => (
                  <Link
                    href="/auth/signup"
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    {chunks}
                  </Link>
                ),
              })}
            </p>
          )}
          {step === "VerifyEmail" && (
            <BackButton
              onClick={() => {
                setCountdown(AUTH_CONSTANTS.TWO_FA_RESEND_DELAY);
                setStep("Credential");
              }}
              type="button"
              className="cursor-pointer"
              label={t("Form.auth.backToLogin")}
            />
          )}
        </>
      }
    >
      {step === "VerifyEmail" && (
        <VerifyEmailCard
          email={form.getValues("email")}
          description={
            t.rich("Form.verifyEmail.pending.description", {
              strong: (chunks) => <span className="font-medium">{chunks}</span>,
            }) as string
          }
        />
      )}
      {step === "Credential" && (
        <div className="space-y-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>{t("Form.login.fields.email")}</FormLabel>
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
                    <div className="flex items-center justify-between">
                      <FormLabel>{t("Form.login.fields.password")}</FormLabel>
                      <Link
                        href="/auth/forgot-password"
                        className="text-primary text-sm underline-offset-4 hover:underline"
                      >
                        {t("Form.login.forgotPassword")}
                      </Link>
                    </div>
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
              <FormError message={error || urlError} />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  t("Form.login.button")
                )}
              </Button>
            </form>
          </Form>

          <SocialDivider text={t("Form.auth.orSignInWith")} />
          <SocialButtons providers={["google", "github"]} />
        </div>
      )}
      {step === "Totp" && (
        <div className="space-y-2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <OtpInputField field={field} disabled={isPending} />
                )}
              />
              <FormError message={error} />
              <FormSuccess message={success} />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  t("Form.twoFactor.button")
                )}
              </Button>
            </form>
          </Form>
          <Button
            onClick={handleTwoFactorAuth}
            variant="outline"
            className="w-full"
            disabled={isTwoFactorAuthPending}
          >
            {isTwoFactorAuthPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Recevoir le code via email"
            )}
          </Button>
        </div>
      )}
      {step === "TwoFactor" && (
        <div className="space-y-2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <OtpInputField field={field} disabled={isPending} />
                )}
              />
              <FormError message={error} />
              <FormSuccess message={success} />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  t("Form.twoFactor.button")
                )}
              </Button>
            </form>
          </Form>
          <ResendButton
            variant="outline"
            label={t("Form.common.code")}
            handler={handleResendCode}
            initialCountdown={countdown}
            isLoading={isPending}
          />
        </div>
      )}
    </AuthCard>
  );
}
