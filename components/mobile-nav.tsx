"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { Menu } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTranslations } from "next-intl";
import { navItemsType } from "./header";
import Image from "next/image";
import UserButton from "./user-button";
import { useIsMobile } from "@/hooks/use-mobile";

export function MobileNav() {
  const t = useTranslations();
  const [open, setOpen] = useState<boolean>(false);

  const isMobile = useIsMobile();

  const navItems: navItemsType = [
    {
      label: t("Home.deployNow"),
      href: "https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app",
    },
    {
      label: t("Home.readDocs"),
      href: "https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app",
    },
  ];

  return (
    <Sheet open={isMobile && open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="max-h-screen w-[250px] overflow-y-scroll px-4 sm:w-[300px]"
      >
        <div className="flex h-full flex-col gap-6 pt-16 pb-6">
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  buttonVariants({
                    variant:
                      item.label === t("Home.deployNow")
                        ? "default"
                        : "outline",
                  }),
                )}
                onClick={() => setOpen(false)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <>
                  {item.label === t("Home.deployNow") && (
                    <Image
                      className="dark:invert"
                      src="/vercel.svg"
                      alt="Vercel logomark"
                      width={20}
                      height={20}
                    />
                  )}
                  {item.label}
                </>
              </Link>
            ))}
          </div>
          <div className="mt-auto">
            <UserButton className="h-auto" variant="ghost" size="default" />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
