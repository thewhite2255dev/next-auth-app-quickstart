"use client";

export default function QRCodeDisplay({
  dataUrl,
}: {
  dataUrl: string;
  secret?: string;
}) {
  return (
    <div className="rounded-md border bg-white p-4 shadow">
      <img
        src={dataUrl}
        alt="QR Code TOTP"
        className="h-48 w-48 object-contain"
      />
    </div>
  );
}
