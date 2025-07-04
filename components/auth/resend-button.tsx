"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/utils";

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
  initialCountdown = 20,
  variant = "default",
  ...props
}: ResendButtonProps) {
  const t = useTranslations("Form");

  const [countdown, setCountdown] = useState(initialCountdown);

  const handleResend = () => {
    if (countdown > 0) return;
    setCountdown(initialCountdown);
    handler();
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
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
        ? t("auth.resendCountdown", { name: label, countdown })
        : t("auth.resendLabel", { name: label })}
    </Button>
  );
}
