import { LucideIcon } from "lucide-react";

export interface SidebarMainItems {
  icon: LucideIcon;
  label: string;
  href: string;
  isCollapsed?: boolean;
  items?: {
    label: string;
    href: string;
  }[];
}
