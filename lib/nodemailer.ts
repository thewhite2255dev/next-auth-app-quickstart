import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import type { ReactElement } from "react";
import { SiteConfig } from "./site-config";

const SMTP_HOST = process.env.SMTP_HOST as string;
const SMTP_USER = process.env.SMTP_USER as string;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD as string;
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587");
const SMTP_SECURE = process.env.SMTP_SECURE === "true";
const EMAIL_FROM = process.env.EMAIL_FROM as string;

export const transporter = nodemailer.createTransport({
  service: "gmail",
  host: SMTP_HOST || "smtp.gmail.com",
  port: SMTP_PORT,
  secure: SMTP_SECURE,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
});

export async function sendEmail({
  from,
  to,
  subject,
  react,
  replyTo,
}: {
  from: string;
  to: string | string[];
  subject: string;
  react: ReactElement;
  replyTo?: string;
}) {
  try {
    const html = await render(react, {
      pretty: true,
    });

    const info = await transporter.sendMail({
      from: from || `"${SiteConfig.title}" ${EMAIL_FROM}`,
      to: Array.isArray(to) ? to.join(", ") : to,
      subject,
      html,
      replyTo,
    });

    console.log("Email envoyé:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    throw error;
  }
}
