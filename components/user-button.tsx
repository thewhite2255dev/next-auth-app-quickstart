"use client";

import { ChevronsUpDown, LogIn, LogOut, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { LogoutButton } from "./auth/logout-button";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { LoginButton } from "./auth/login-button";
import { generateAvatarFallback } from "@/lib/utils/user";
import { cn } from "@/lib/utils/utils";
import { useSession } from "next-auth/react";

interface UserButtonProps extends React.HTMLAttributes<HTMLElement> {
  size?: "default" | "sm" | "lg" | "icon" | null | undefined;
  variant?:
    | "default"
    | "link"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
}

export default function UserButton({
  size = "icon",
  variant = "ghost",
  className,
}: UserButtonProps) {
  const { data: session, status } = useSession();
  const user = session?.user;
  const t = useTranslations("UserButton");

  const avatarFallback = generateAvatarFallback(user?.name as string);

  if (status === "loading") {
    return (
      <div className={cn("lg:rounded-full", className)}>
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    );
  }

  return user ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={cn(
            "data-[state=open]:bg-accent font-normal lg:rounded-full",
            className,
          )}
        >
          <Avatar className="size-8 rounded-full">
            <AvatarImage
              src={user?.image}
              alt={user?.name}
              className="object-cover"
            />
            <AvatarFallback className="rounded-full">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center lg:hidden">
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{user?.name}</span>
              <span className="truncate">{user?.email}</span>
            </div>
            <ChevronsUpDown className="ml-auto h-4 w-4" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[250px]"
        side="bottom"
        align="end"
        sideOffset={8}
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center gap-2 py-1.5 text-left text-sm">
            <Avatar className="size-9 rounded-full">
              <AvatarImage
                src={user?.image}
                alt={user?.name}
                className="object-cover"
              />
              <AvatarFallback className="rounded-full">
                {avatarFallback}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{user?.name}</span>
              <span className="truncate">{user?.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="px-4.5" asChild>
            <Link href="/settings">
              <Settings className="mr-2 h-4 w-4" />
              <span>{t("items.settings")}</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <LogoutButton>
          <DropdownMenuItem className="px-4.5">
            <LogOut className="mr-2 h-4 w-4" />
            <span>{t("items.logOut")}</span>
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <LoginButton>
      <Button variant="outline" size="sm" className="w-full gap-2 px-2">
        <LogIn />
        <span>{t("items.logIn")}</span>
      </Button>
    </LoginButton>
  );
}
