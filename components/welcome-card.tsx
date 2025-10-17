"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { generateAvatarFallback } from "@/lib/utils/user";
import { useTranslations } from "next-intl";
import { LoginButton } from "./auth/login-button";

export function WelcomeCard() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const t = useTranslations("WelcomeCard");

  if (status === "loading") {
    return (
      <Card className="w-full max-w-sm">
        <CardHeader>
          <Skeleton className="h-6 w-1/2" />
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-54" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{t("guestTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-start gap-4">
          <p className="text-muted-foreground text-sm">{t("guestSubtitle")}</p>
          <LoginButton>
            <Button>{t("signInButton")}</Button>
          </LoginButton>
        </CardContent>
      </Card>
    );
  }

  const avatarFallback = generateAvatarFallback(user.name ?? "");

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={user.image ?? ""} alt={user.name ?? "User"} />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
        <div className="space-y-0.5">
          <p className="font-medium">{user.name}</p>
          <p className="text-muted-foreground text-sm">{user.email}</p>
        </div>
      </CardContent>
    </Card>
  );
}
