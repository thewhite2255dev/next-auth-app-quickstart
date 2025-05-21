"use server";

import PasswordResetEmail from "@/emails/password-reset-email";
import { sendEmail } from "./nodemailer";
import { SiteConfig } from "./site-config";
import VerificationEmail from "@/emails/verification-email";
import TwoFactorEmail from "@/emails/two-factor-email";

const SMTP_USER = process.env.SMTP_USER as string;

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  await sendEmail({
    from: `"${SiteConfig.title}" <${SMTP_USER}>`,
    to: email,
    subject: "Votre code de vérification 2FA",
    react: TwoFactorEmail({ token, email }),
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  await sendEmail({
    from: `"${SiteConfig.title}" <${SMTP_USER}>`,
    to: email,
    subject: "Réinitialisez votre mot de passe",
    react: PasswordResetEmail({ token, email }),
  });
};

export const sendVerificationEmail = async (email: string, token: string) => {
  await sendEmail({
    from: `"${SiteConfig.title}" <${SMTP_USER}>`,
    to: email,
    subject: "Vérifiez votre adresse e-mail",
    react: VerificationEmail({ token, email }),
  });
};
