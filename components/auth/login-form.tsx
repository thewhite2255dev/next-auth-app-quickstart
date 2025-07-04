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
import {
  InputOTP,
  InputOTPSeparator,
  InputOTPSlot,
  InputOTPGroup,
} from "@/components/ui/input-otp";
import { AuthCard } from "./auth-card";
import { BackButton } from "./back-button";
import { ResendButton } from "./resend-button";
import { resendTwoFactorCode } from "@/actions/auth/resend-two-factor-code";
import FormSuccess from "../form-success";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { VerifyEmailCard } from "./verify-email-card";

export function LoginForm() {
  const t = useTranslations("Form");
  const { update } = useSession();

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callback_url") || undefined;
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? t("errors.OAuthAccountNotLinked")
      : "";
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<"Credential" | "TwoFactor" | "VerifyEmail">(
    "Credential",
  );
  const [countdown, setCountdown] = useState(20);

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

      if (result?.verifyEmail) {
        setStep("VerifyEmail");
      }
    });
  }

  const handleResendCode = () => {
    setError("");
    setSuccess("");
    setCountdown(20);

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

  return (
    <AuthCard
      title={
        step === "TwoFactor"
          ? t("twoFactor.title")
          : step === "Credential"
            ? t("login.title")
            : t("verifyEmail.pending.title")
      }
      description={
        step === "TwoFactor"
          ? (t.rich("twoFactor.description", {
              strong: (chunks) => (
                <span className="font-medium">{form.getValues("email")}</span>
              ),
            }) as string)
          : step === "Credential"
            ? t("login.description")
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
              label={t("auth.backToLogin")}
            />
          )}
          {step === "Credential" && (
            <p className="text-muted-foreground text-sm">
              {t.rich("login.createAccount", {
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
                setCountdown(20);
                setStep("Credential");
              }}
              type="button"
              className="cursor-pointer"
              label={t("auth.backToLogin")}
            />
          )}
        </>
      }
    >
      {step === "VerifyEmail" && (
        <VerifyEmailCard
          email={form.getValues("email")}
          description={
            t.rich("verifyEmail.pending.description", {
              strong: (chunks) => (
                <span className="font-medium">{form.getValues("email")}</span>
              ),
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
                    <FormLabel>{t("login.fields.email")}</FormLabel>
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
                      <FormLabel>{t("login.fields.password")}</FormLabel>
                      <Link
                        href="/auth/forgot-password"
                        className="text-primary text-sm underline-offset-4 hover:underline"
                      >
                        {t("login.forgotPassword")}
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
                  t("login.button")
                )}
              </Button>
            </form>
          </Form>

          <SocialDivider text={t("auth.orSignInWith")} />
          <SocialButtons providers={["google", "github"]} />
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
                  <FormItem className="w-full">
                    <div className="flex items-center justify-center">
                      <FormControl>
                        <InputOTP
                          {...field}
                          disabled={isPending}
                          required
                          inputMode="numeric"
                          maxLength={6}
                          onInput={(e) => {
                            const input = e.currentTarget;
                            input.value = input.value.replace(/\D/g, "");
                          }}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                          </InputOTPGroup>
                          <InputOTPSeparator />
                          <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormError message={error} />
              <FormSuccess message={success} />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  t("twoFactor.button")
                )}
              </Button>
            </form>
          </Form>
          <ResendButton
            variant="outline"
            label={t("common.code")}
            handler={handleResendCode}
            initialCountdown={countdown}
            isLoading={isPending}
          />
        </div>
      )}
    </AuthCard>
  );
}
