"use client";

import { AuthCard } from "@/components/auth/auth-card";
import { useTranslations } from "next-intl";
import { BackButton } from "@/components/auth/back-button";
import { useState } from "react";
import ForgotPasswordForm from "@/components/auth/forgot-password-form";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button"; // Ajout du composant Button

export default function ForgotPasswordPage() {
  const t = useTranslations("Form");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleResendResetLink = () => {
    alert("Lien renvoyé avec succès");
  };

  return (
    <AuthCard
      title={t("forgotPassword.title")}
      description={
        !isSubmitted
          ? t("forgotPassword.description.enterEmail")
          : t("forgotPassword.description.checkEmail")
      }
      footer={
        !isSubmitted ? (
          <BackButton href="/auth/login" label={t("auth.backToLogin")} />
        ) : (
          <p className="text-muted-foreground text-sm">
            {t.rich("editAccount", {
              button: (chunks) => (
                <button
                  onClick={() => {
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
        <ForgotPasswordForm setIsSubmitted={setIsSubmitted} />
      ) : (
        <div className="space-y-4 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-green-100 p-3">
              <Check className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <p className="text-muted-foreground">
            {t.rich("forgotPassword.success.description", {
              strong: (chunks) => (
                <span className="font-medium">xyz@gmail.com</span>
              ),
            })}
          </p>
          <div className="pt-2">
            <Button
              className="w-full"
              onClick={() => {
                handleResendResetLink;
              }}
            >
              Renvoyer le lien dans 20 s
            </Button>
          </div>
        </div>
      )}
    </AuthCard>
  );
}
