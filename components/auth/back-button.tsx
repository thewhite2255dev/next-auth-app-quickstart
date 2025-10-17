"use client";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils/utils";
import { ChevronLeft } from "lucide-react";

interface BackButtonProps extends React.ComponentProps<"button"> {
  href?: string;
  label?: string;
  showIcon?: boolean;
  variant?: "link";
}

export function BackButton({
  href,
  label = "Back",
  showIcon = true,
  variant = "link",
  className,
  ...props
}: BackButtonProps) {
  if (href) {
    return (
      <Button
        asChild
        variant={variant}
        className={cn("text-muted-foreground text-sm", className)}
        {...props}
      >
        <Link href={href}>
          {showIcon && <ChevronLeft className="mr-1 h-4 w-4" />}
          {label}
        </Link>
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    >
      {showIcon && <ChevronLeft className="mr-1 h-4 w-4" />}
      {label}
    </Button>
  );
}
