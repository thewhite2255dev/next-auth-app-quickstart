"use client";

import { AuthCard } from "@/components/auth/auth-card";
// import ResetForm from "@/components/auth/reset-form";
import { useTranslations } from "next-intl";
import { BackButton } from "@/components/auth/back-button";
import { useState } from "react";

export default function ResetPasswordPage() {
  const t = useTranslations("Form");

  const [isSubmitted, setIsSubmitted] = useState(false);
  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   // This is just a simulation - in a real app, you'd connect to your backend
  //   setTimeout(() => {
  //     setIsSubmitted(true);
  //   }, 1500);
  // };

  return (
    <AuthCard
      title={t("resetPassword.title")}
      description={
        !isSubmitted
          ? t("resetPassword.description.enterEmail")
          : t("resetPassword.description.checkEmail")
      }
      footer={
        !isSubmitted && (
          <BackButton href="/auth/login" label={t("auth.backToLogin")} />
        )
      }
    >
      <div>Reset password</div>
      {/* <ResetForm /> */}
    </AuthCard>
  );
}
