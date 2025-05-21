import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";
import { SiteConfig } from "@/lib/site-config";

export interface TwoFactorEmailProps {
  token: string;
  email?: string;
}

export default function TwoFactorEmail({
  token = "123456",
  email = "utilisateur@example.com",
}: TwoFactorEmailProps) {
  const year = new Date().getFullYear();

  return (
    <Html>
      <Head />
      <Preview>Votre code de vérification 2FA</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto max-w-[600px] px-4 py-5">
            {/* Logo textuel */}
            <Text className="mb-6 text-center text-2xl font-bold text-gray-800">
              {SiteConfig.title}
            </Text>

            {/* Titre principal */}
            <Heading className="mb-6 text-center text-xl font-semibold text-gray-700">
              Code de vérification en deux étapes
            </Heading>

            {/* Message principal */}
            <Text className="text-base leading-7 text-gray-700">Bonjour,</Text>
            <Text className="text-base leading-7 text-gray-700">
              Voici votre code de vérification pour accéder à votre compte :
            </Text>

            {/* Token de vérification */}
            <Section className="my-6 rounded-md border border-gray-200 bg-gray-50 px-6 py-4 text-center">
              <Text className="text-3xl font-bold tracking-widest text-blue-600">
                {token}
              </Text>
            </Section>

            <Text className="text-base leading-7 text-gray-700">
              Ce code est valable pendant 5 minutes. Si vous n&apos;êtes pas à
              l&apos;origine de cette demande, veuillez ignorer ce message ou
              changer votre mot de passe immédiatement.
            </Text>

            <Hr className="my-6 border-gray-200" />

            {/* Footer */}
            <Text className="text-center text-xs text-gray-400">
              Vous recevez cet email car une tentative de connexion a été
              effectuée avec l&apos;adresse {email}.
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
