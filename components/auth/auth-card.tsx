"use client";

import type { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeSwitcher } from "../theme-switcher";

interface AuthCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function AuthCard({
  title,
  description,
  children,
  footer,
  className = "",
}: AuthCardProps) {
  return (
    <div className="bg-muted/50 flex min-h-screen items-center justify-center p-4">
      <Card className={`mt-12 w-full max-w-md sm:mt-0 ${className}`}>
        <div className="absolute top-4 right-4">
          <div className="space-x-2">
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
        </div>
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>{children}</CardContent>
        {footer && (
          <CardFooter className="flex justify-center">{footer}</CardFooter>
        )}
      </Card>
    </div>
  );
}
