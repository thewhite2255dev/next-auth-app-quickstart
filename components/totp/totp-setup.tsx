"use client";

import { useState, useTransition } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import QRCodeDisplay from "./qr-code-display";
import { generateTOTP } from "@/actions/totp/generate";
import { verifyTOTP } from "@/actions/totp/verify";
import FormError from "../form-error";
import FormSuccess from "../form-success";
import { SiteConfig } from "@/lib/site-config";
import { useSession } from "next-auth/react";

export default function TOTPSetup() {
  const { update, data: session } = useSession();
  const user = session?.user;

  const [isGeneratePending, startGenerateTransition] = useTransition();
  const [isVerifyPending, startVerifyTransition] = useTransition();
  const [secret, setSecret] = useState<string | null>(null);
  const [uri, setUri] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const username = user?.email;
  const serviceName = `${SiteConfig.title} MFA`;

  const handleGenerate = () => {
    setMessage(null);

    startGenerateTransition(async () => {
      const result = await generateTOTP(serviceName);
      const data = result.data;

      if (result?.error) {
        setMessage({
          type: "error",
          text: "Impossible de générer la clé ou le QR code.",
        });
      }

      if (result?.success) {
        await update();
        setSecret(data.secret);
        setUri(data.uri);
        setQrDataUrl(data.qr);
        setMessage({
          type: "success",
          text: "Clé secrète générée. Scannez le QR code dans votre application d'authentification.",
        });
      }
    });
  };

  const handleVerify = () => {
    setMessage(null);

    if (!secret) {
      return setMessage({
        type: "error",
        text: "Aucune clé secrète. Générez-la d'abord.",
      });
    }

    startVerifyTransition(async () => {
      const result = await verifyTOTP(verificationCode, secret);

      if (result?.error) {
        setMessage({ type: "error", text: "Impossible de vérifier le code." });
      }

      if (result?.totp) {
        setMessage({
          type: "success",
          text: "Code valide — authentification configurée.",
        });
      } else
        setMessage({
          type: "error",
          text: "Code invalide. Essayez de nouveau.",
        });
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-white p-6">
      <div className="w-full max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Générer une clé</CardTitle>
            <CardDescription>
              Ajoutez une clé TOTP à votre application d'authentification
              (Google Authenticator, Authy, ...).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  Pour commencer, générez une clé secrète et scannez le QR code
                  avec votre application d'authentification.
                </p>

                <div className="flex gap-2">
                  <Button onClick={handleGenerate} disabled={isGeneratePending}>
                    {isGeneratePending
                      ? "Génération…"
                      : "Configurer l'authentification à deux facteurs"}
                  </Button>
                </div>

                {secret && (
                  <div className="space-y-2">
                    <Label>Clé secrète (sauvegardez-la)</Label>
                    <div className="flex items-center gap-2">
                      <code className="bg-muted rounded-md px-3 py-2 text-sm break-all">
                        {secret}
                      </code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(secret);
                          setMessage({
                            type: "success",
                            text: "Clé copiée dans le presse-papier.",
                          });
                        }}
                      >
                        Copier
                      </Button>
                    </div>
                    <div className="pt-2">
                      <Label>URI TOTP</Label>
                      <div className="text-muted-foreground text-xs break-all">
                        {uri}
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-4">
                  <Label>Code TOTP de test</Label>
                  <div className="mt-2 flex gap-2">
                    <Input
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="Entrez le code à 6 chiffres"
                    />
                    <Button
                      onClick={handleVerify}
                      disabled={isVerifyPending}
                      variant="secondary"
                    >
                      Vérifier
                    </Button>
                  </div>
                </div>

                {message &&
                  (message.type === "success" ? (
                    <FormSuccess message={message.text} />
                  ) : (
                    <FormError message={message.text} />
                  ))}
              </div>

              <div className="flex flex-col items-center justify-center">
                {qrDataUrl ? (
                  <QRCodeDisplay dataUrl={qrDataUrl} secret={secret!} />
                ) : (
                  <div className="text-muted-foreground text-center text-sm">
                    Aucun QR code généré — générez une clé pour afficher le QR
                    code.
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex w-full items-center justify-between">
              <div className="text-muted-foreground text-sm">
                Service : {serviceName}
              </div>
              <div className="text-muted-foreground text-sm">
                Utilisateur : {username}
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
