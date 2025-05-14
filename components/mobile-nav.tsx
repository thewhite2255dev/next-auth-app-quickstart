"use client";

import { useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { Menu } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTranslations } from "next-intl";
import { navItemsType } from "./header";
import Image from "next/image";

export function MobileNav() {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

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
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="max-h-screen w-[250px] overflow-y-scroll px-4 sm:w-[300px]"
      >
        <div className="flex flex-col gap-6 pt-16 pb-6">
          <nav className="flex flex-col gap-4">
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
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
