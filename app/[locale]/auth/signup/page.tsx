"use client";

import { AuthCard } from "@/components/auth/auth-card";
import SignupForm from "@/components/auth/signup-form";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function SignupPage() {
  const t = useTranslations("Form.signup");

  return (
    <AuthCard
      title={t("title")}
      description={t("description")}
      footer={
        <p className="text-muted-foreground text-sm">
          {t.rich("haveAccount", {
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
      }
    >
      <SignupForm />
    </AuthCard>
  );
}
