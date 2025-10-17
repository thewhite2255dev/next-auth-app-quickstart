"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/utils";
import { AUTH_CONSTANTS } from "@/lib/auth-constants";

interface ResendButtonProps extends React.ComponentProps<"button"> {
  handler: () => void;
  label: string;
  initialCountdown: number;
  isLoading: boolean;
  variant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
}

export function ResendButton({
  isLoading,
  handler,
  label,
  initialCountdown = AUTH_CONSTANTS.TWO_FA_RESEND_DELAY,
  variant = "default",
  ...props
}: ResendButtonProps) {
  const t = useTranslations();

  const [countdown, setCountdown] = useState<number>(initialCountdown);

  const handleResend = () => {
    if (countdown > 0) return;
    setCountdown(initialCountdown);
    handler();
  };

  useEffect(() => {
    let interval: number | undefined;

    if (countdown > 0) {
      interval = window.setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (interval !== undefined) window.clearInterval(interval);
    };
  }, [countdown]);

  return (
    <Button
      type="button"
      variant={countdown > 0 ? null : variant}
      className={cn(
        "w-full transition-colors",
        countdown > 0 ? "bg-muted/50 text-muted-foreground" : "",
      )}
      disabled={countdown > 0 || isLoading}
      onClick={handleResend}
      {...props}
    >
      {countdown > 0
        ? t("Form.auth.resendCountdown", { name: label, countdown })
        : t("Form.auth.resendLabel", { name: label })}
    </Button>
  );
}
