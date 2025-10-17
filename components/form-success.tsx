"use client";

import { cn } from "@/lib/utils/utils";
import { CircleCheck } from "lucide-react";

interface FormSuccessProps extends React.HTMLAttributes<HTMLElement> {
  message?: string;
}

export default function FormSuccess({
  message,
  className,
  ...props
}: FormSuccessProps) {
  if (!message) return null;

  return (
    <div
      className={cn(
        "flex min-h-9 items-center space-x-2 rounded-md bg-emerald-50 px-3 py-1 text-sm text-emerald-500 [&_svg]:size-4 [&_svg]:shrink-0",
        className,
      )}
      {...props}
    >
      <CircleCheck />
      <span>{message}</span>
    </div>
  );
}
