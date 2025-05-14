"use client";

import { AuthCard } from "@/components/auth/auth-card";
import LoginForm from "@/components/auth/login-form";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const t = useTranslations("Form.login");

  return (
    <AuthCard
      title={t("title")}
      description={t("description")}
      footer={
        <p className="text-muted-foreground text-sm">
          {t.rich("createAccount", {
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
      }
    >
      <LoginForm />
    </AuthCard>
  );
}
