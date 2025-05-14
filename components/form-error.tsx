import { cn } from "@/lib/utils/utils";
import { TriangleAlert } from "lucide-react";

interface FormErrorProps extends React.HTMLAttributes<HTMLElement> {
  message?: string;
}

export default function FormError({
  message,
  className,
  ...props
}: FormErrorProps) {
  if (!message) return null;

  return (
    <div
      className={cn(
        "flex min-h-9 items-center space-x-2 rounded-md bg-red-50 px-3 py-1 text-sm text-red-500",
        className,
      )}
      {...props}
    >
      <TriangleAlert className="h-4 w-4" />
      <span>{message}</span>
    </div>
  );
}
