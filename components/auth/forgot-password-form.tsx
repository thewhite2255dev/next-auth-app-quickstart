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
import { Loader2 } from "lucide-react";

interface ForgotPasswordFormProps {
  setIsSubmitted: (value: boolean) => void;
}

export default function ForgotPasswordForm({
  setIsSubmitted,
}: ForgotPasswordFormProps) {
  const t = useTranslations("Form");

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

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
        form.reset();
        setIsSubmitted(true);
      }

      if (result?.error) {
        setError(result?.error);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col gap-4">
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
        </div>
        <FormError message={error} />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            t("forgotPassword.button")
          )}
        </Button>
      </form>
    </Form>
  );
}
