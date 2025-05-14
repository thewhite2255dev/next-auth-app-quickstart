"use client";

import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

interface LogoutButtonProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function LogoutButton({
  children,
  className,
  redirectTo = "/",
}: LogoutButtonProps) {
  const handleClick = () => {
    signOut({
      redirectTo,
    });
  };

  return (
    <span onClick={handleClick} className={cn("cursor-pointer", className)}>
      {children}
    </span>
  );
}
