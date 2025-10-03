"use client";

import { Button } from "@/components/ui/button";

export default function QRCodeDisplay({
  dataUrl,
  secret,
}: {
  dataUrl: string;
  secret: string;
}) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="rounded-md border bg-white p-4 shadow">
        <img
          src={dataUrl}
          alt="QR Code TOTP"
          className="h-64 w-64 object-contain"
        />
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => {
            const a = document.createElement("a");
            a.href = dataUrl;
            a.download = "totp-qr.png";
            a.click();
          }}
          size="sm"
        >
          Télécharger
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            navigator.clipboard.writeText(secret);
            // small UX hint: alert
            alert("Clé secrète copiée");
          }}
        >
          Copier la clé
        </Button>
      </div>
    </div>
  );
}
