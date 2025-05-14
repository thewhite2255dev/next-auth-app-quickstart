"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface LoginButtonProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export default function LoginButton({ children, className }: LoginButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push("/auth/login");
  };

  return (
    <span onClick={handleClick} className={cn("cursor-pointer", className)}>
      {children}
    </span>
  );
}
