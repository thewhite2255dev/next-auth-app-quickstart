"use client";
import Image from "next/image";

export default function QRCodeDisplay({
  dataUrl,
}: {
  dataUrl: string;
  secret?: string;
}) {
  return (
    <div className="rounded-md border bg-white p-4 shadow">
      <Image
        src={dataUrl}
        alt="QR Code TOTP"
        width={192}
        height={192}
        className="h-48 w-48 object-contain"
        unoptimized
      />
    </div>
  );
}
