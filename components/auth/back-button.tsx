import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

interface BackButtonProps extends React.ComponentProps<"button"> {
  href: string;
  label?: string;
  showIcon?: boolean;
  variant?: "link";
}

export function BackButton({
  href,
  label = "Back",
  showIcon = true,
  variant = "link",
  className = "text-sm text-muted-foreground",
  ...props
}: BackButtonProps) {
  return (
    <Button variant={variant} className={className} asChild {...props}>
      <Link href={href}>
        {showIcon && <ChevronLeft className="mr-1 h-4 w-4" />}
        {label}
      </Link>
    </Button>
  );
}
