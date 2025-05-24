"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { MobileNav } from "@/components/mobile-nav";
import { cn } from "@/lib/utils/utils";
import { ThemeSwitcher } from "./theme-switcher";
import { LanguageSwitcher } from "./language-switcher";
import { SiteConfig } from "@/lib/site-config";
import UserButton from "./user-button";

export type navItemsType = {
  label: string;
  href: string;
}[];

export function Header() {
  const pathname = usePathname();

  const navItems: navItemsType = [];

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/">
          <span className="text-foreground text-lg font-semibold">
            {SiteConfig.title}
          </span>
        </Link>
        <nav className="hidden gap-6 font-medium lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-foreground/70 hover:text-foreground transition-colors",
                pathname === item.href && "text-foreground font-semibold",
              )}
              data-prevent-nprogress={true}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 sm:flex">
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>

          <div className="max-lg:hidden">
            <UserButton />
          </div>

          <div className="block lg:hidden">
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
