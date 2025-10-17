import "dotenv/config";

import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";
import { SiteConfig } from "@/lib/site-config";

export interface PasswordResetEmailProps {
  token: string;
  email?: string;
}

export default function PasswordResetEmail({
  token,
  email = "utilisateur@example.com",
}: PasswordResetEmailProps) {
  const year = new Date().getFullYear();
  const baseUrl = process.env.AUTH_URL;
  const resetLink = `${baseUrl}/reset-password?token=${token}`;

  return (
    <Html>
      <Head />
      <Preview>Réinitialisez votre mot de passe</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto max-w-[600px] px-4 py-5">
            <Text className="mb-6 text-center text-2xl font-bold text-gray-800">
              {SiteConfig.title}
            </Text>

            <Heading className="mb-6 text-center text-xl font-semibold text-gray-700">
              Réinitialisation de mot de passe
            </Heading>

            <Text className="text-base leading-7 text-gray-700">Bonjour,</Text>
            <Text className="text-base leading-7 text-gray-700">
              Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur
              le bouton ci-dessous pour définir un nouveau mot de passe :
            </Text>

            <Section className="my-6 text-center">
              <Link
                href={resetLink}
                className="inline-block rounded bg-blue-600 px-6 py-3 text-white no-underline"
              >
                Réinitialiser le mot de passe
              </Link>
            </Section>

            <Text className="text-base leading-7 text-gray-700">
              Si vous n&apos;avez pas demandé cette action, vous pouvez ignorer
              cet email.
            </Text>

            <Hr className="my-6 border-gray-200" />

            <Text className="text-center text-xs text-gray-400">
              Vous recevez cet email car une demande de réinitialisation a été
              effectuée pour l&apos;adresse {email}.
            </Text>
            <Text className="mt-4 text-center text-xs text-gray-400">
              © {year} {SiteConfig.title}. Tous droits réservés.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
