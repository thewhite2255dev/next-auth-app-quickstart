import { Card, CardContent, CardHeader } from "@/components/ui/card";
import SocialButtons from "./social-buttons";

interface CardWrapperProps {
  children: React.ReactNode;
}

export default function CardWrapper({ children }: CardWrapperProps) {
  return (
    <Card>
      <CardHeader></CardHeader>
      <CardContent>{children}</CardContent>
      <SocialButtons />
    </Card>
  );
}
