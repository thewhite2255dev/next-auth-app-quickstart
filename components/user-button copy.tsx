"use client";

import {
  Check,
  ChevronsUpDown,
  LogIn,
  LogOut,
  Monitor,
  Moon,
  Settings,
  Sun,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "./auth/logout-button";
import Link from "next/link";
import useCurrentUser from "@/hooks/use-current-user";
import { useLocale, useTranslations } from "next-intl";
import { LoginButton } from "./auth/login-button";
import { generateAvatarFallback } from "@/lib/utils/user";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils/utils";

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
  const user = useCurrentUser();
  const t = useTranslations("UserButton");
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const changeLanguage = (newLocale: string) => {
    router.push(pathname, { locale: newLocale });
  };

  const locale = useLocale();

  const avatarFallback = generateAvatarFallback(user?.name as string);

  return user ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={cn(
            "data-[state=open]:bg-accent rounded-full font-normal",
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
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
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
          <Link href="/settings">
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>{t("items.settings")}</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-muted-foreground text-sm font-normal">
            <span>{t("items.preferences.title")}</span>
          </DropdownMenuLabel>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <span>{t("items.preferences.theme.label")}</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-40">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <div className="mr-auto flex items-center space-x-2">
                  <Sun className="h-4 w-4" />
                  <span>{t("items.preferences.theme.lightMode")}</span>
                </div>
                {theme === "light" && <Check />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <div className="mr-auto flex items-center space-x-2">
                  <Moon className="h-4 w-4" />
                  <span>{t("items.preferences.theme.darkMode")}</span>
                </div>
                {theme === "dark" && <Check />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <div className="mr-auto flex items-center space-x-2">
                  <Monitor className="h-4 w-4" />
                  <span>{t("items.preferences.theme.systemMode")}</span>
                </div>
                {theme === "system" && <Check />}
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <span>{t("items.preferences.language.label")}</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-40">
              <DropdownMenuItem onClick={() => changeLanguage("fr")}>
                <span className="mr-auto">
                  {t("items.preferences.language.fr.label")}
                </span>
                {locale === "fr" && <Check />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage("en")}>
                <span className="mr-auto">
                  {t("items.preferences.language.en.label")}
                </span>
                {locale === "en" && <Check />}
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <LogoutButton>
          <DropdownMenuItem>
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
