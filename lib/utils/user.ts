import { prisma } from "../prisma";

export function maskEmail(email: string | undefined | null): string {
  if (!email) return "";

  const [localPart, domain] = email.split("@");

  if (!localPart || !domain) return email;

  let maskedLocalPart = localPart;
  if (localPart.length > 4) {
    maskedLocalPart =
      localPart.slice(0, 3) +
      "*".repeat(localPart.length - 4) +
      localPart.slice(-1);
  } else {
    maskedLocalPart =
      localPart[0] +
      "*".repeat(localPart.length - 2) +
      localPart[localPart.length - 1];
  }

  return `${maskedLocalPart}@${domain}`;
}

export function generateAvatarFallback(name: string) {
  if (!name) return "";

  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export async function generateUniqueUsername(
  base: string,
  maxLength: number = 15,
): Promise<string> {
  const cleanedBase = base
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase();

  const timestamp = Date.now().toString(36).slice(-4);
  const randomPart = Math.random().toString(36).slice(-4);
  let username = `${cleanedBase}${timestamp}${randomPart}`;

  if (username.length > maxLength) {
    const excessLength = username.length - maxLength;
    username = `${cleanedBase.slice(0, cleanedBase.length - excessLength)}${timestamp}${randomPart}`;
  }

  let isUnique = false;
  let attempt = 0;

  while (!isUnique) {
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });
    if (!existingUser) {
      isUnique = true;
    } else {
      attempt++;
      username = `${cleanedBase.slice(0, cleanedBase.length - 1)}${attempt}`;
    }
  }

  return username;
}
