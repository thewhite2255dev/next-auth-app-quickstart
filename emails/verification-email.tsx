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

export interface VerificationEmailProps {
  token: string;
  email?: string;
}

export default function VerificationEmail({
  token,
  email = "utilisateur@example.com",
}: VerificationEmailProps) {
  const year = new Date().getFullYear();
  const baseUrl = process.env.AUTH_URL;
  const verificationLink = `${baseUrl}/verify-email?token=${token}`;

  return (
    <Html>
      <Head />
      <Preview>Vérifiez votre adresse e-mail pour continuer</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto max-w-[600px] px-4 py-5">
            <Text className="mb-6 text-center text-2xl font-bold text-gray-800">
              {SiteConfig.title}
            </Text>

            <Heading className="mb-6 text-center text-xl font-semibold text-gray-700">
              Vérifiez votre adresse e-mail
            </Heading>

            <Text className="text-base leading-7 text-gray-700">Bonjour,</Text>
            <Text className="text-base leading-7 text-gray-700">
              Merci de vous être inscrit sur {SiteConfig.title}. Pour activer
              votre compte, veuillez vérifier votre adresse e-mail en cliquant
              sur le bouton ci-dessous :
            </Text>

            <Section className="my-6 text-center">
              <Link
                href={verificationLink}
                className="inline-block rounded bg-blue-600 px-6 py-3 text-white no-underline"
              >
                Vérifier mon adresse
              </Link>
            </Section>

            <Text className="text-base leading-7 text-gray-700">
              Si vous n&apos;êtes pas à l&apos;origine de cette inscription,
              vous pouvez ignorer cet email.
            </Text>

            <Hr className="my-6 border-gray-200" />

            <Text className="text-center text-xs text-gray-400">
              Cet email a été envoyé à {email} suite à une inscription sur{" "}
              {SiteConfig.title}.
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
