"use client";

import { AuthCard } from "@/components/auth/auth-card";
// import VerifyForm from "@/components/auth/verify-form";
import { useTranslations } from "next-intl";
import { BackButton } from "@/components/auth/back-button";

export default function VerifyEmailPage() {
  const t = useTranslations("Form.verifyEmail");

  const handleResendCode = () => {
    alert("A new verification code has been sent to your email");
  };

  return (
    <AuthCard
      title={t("title")}
      description={t("description")}
      footer={
        <div className="flex w-full flex-col items-center space-y-2">
          <p className="text-muted-foreground text-center text-sm">
            {t.rich("resendCode", {
              button: (chunks) => (
                <button
                  onClick={handleResendCode}
                  className="text-primary underline-offset-4 hover:underline"
                  type="button"
                >
                  {chunks}
                </button>
              ),
            })}
          </p>
          <BackButton href="/auth/login" label={t("backToLogin")} />
        </div>
      }
    >
      <div>Verify Email</div>
      {/* <VerifyForm /> */}
    </AuthCard>
  );
}
