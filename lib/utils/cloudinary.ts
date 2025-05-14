export function getCloudinaryPublicId(url: string): string | null {
  if (!url.startsWith("https://res.cloudinary.com/")) {
    return null;
  }

  return (
    url
      .split("/")
      .pop()
      ?.replace(/\.[^/.]+$/, "") || null
  );
}
