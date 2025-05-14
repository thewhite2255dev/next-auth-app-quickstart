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
import { useSearchParams } from "next/navigation";
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

export default function LoginForm() {
  const t = useTranslations("Form");

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { update } = useSession();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callback_url") || undefined;
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? t("errors.OAuthAccountNotLinked")
      : "";

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginFormSchema(t)),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setError("");

    startTransition(async () => {
      const result = await login(values, callbackUrl);
      if (result?.success) {
        await update();
        form.reset();
      }

      if (result?.error) {
        setError(result?.error);
      }
    });
  }

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col gap-4">
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
          </div>
          <FormError message={error || urlError} />
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              t("login.button")
            )}
          </Button>
        </form>
      </Form>

      <SocialDivider text={t("auth.orSignInWith")} />
      <SocialButtons providers={["google", "github"]} />
    </div>
  );
}
