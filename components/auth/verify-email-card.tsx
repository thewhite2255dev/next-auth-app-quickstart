"use client";

import { Check } from "lucide-react";
import { ResendButton } from "./resend-button";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { resendVerifyEmailLink } from "@/actions/auth/resend-verify-email-link";
import FormSuccess from "../form-success";
import FormError from "../form-error";

interface VerifyEmailCardProps {
  description: string;
  email: string;
}

export function VerifyEmailCard({ email, description }: VerifyEmailCardProps) {
  const t = useTranslations("Form");

  const [countdown, setCountdown] = useState(20);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleResendLink = () => {
    setError("");
    setSuccess("");
    setCountdown(20);
    startTransition(async () => {
      const result = await resendVerifyEmailLink(email);
      if (result?.error) {
        setError(result?.error);
      }
      if (result?.success && result?.message) {
        setSuccess(result?.message);
      }
    });
  };

  return (
    <div className="space-y-4 text-center">
      <div className="mb-4 flex justify-center">
        <div className="rounded-full bg-emerald-100 p-3">
          <Check className="h-6 w-6 text-emerald-600" />
        </div>
      </div>
      <p className="text-muted-foreground">{description}</p>
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
  );
}
