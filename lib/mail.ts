"use server";

import { sendEmail } from "./nodemailer";

const SMTP_USER = process.env.SMTP_USER as string;

// export const sendContactEmail = async (data: ContactFormValues) => {
//   await sendEmail({
//     from: `"${SiteConfig.title}" <${SMTP_USER}>`,
//     to: SMTP_USER,
//     subject: `[Formulaire de Contact] ${data.subject}`,
//     react: ContactEmail({
//       data,
//     }),
//     replyTo: data.email,
//   });
// };

export const sendTwoFactorTokenEmail = async (
  email: string,
  token: string,
) => {};

export const sendPasswordResetEmail = async (
  email: string,
  token: string,
) => {};

export const sendVerificationEmail = async (email: string, token: string) => {};
