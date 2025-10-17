"use client";

import { useEffect, useState, useTransition } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import QRCodeDisplay from "./qr-code-display";
import { generateTOTP } from "@/actions/totp/generate";
import { verifyTOTP } from "@/actions/totp/verify";
import { SiteConfig } from "@/lib/site-config";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  InputOTP,
  InputOTPSlot,
  InputOTPGroup,
} from "@/components/ui/input-otp";
import { Loader2 } from "lucide-react";

export default function TOTPSetup() {
  const t = useTranslations("TotpSetup");
  const { update } = useSession();

  const [isGeneratePending, startGenerateTransition] = useTransition();
  const [isVerifyPending, startVerifyTransition] = useTransition();
  const [secret, setSecret] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const serviceName = `${SiteConfig.title} MFA`;

  useEffect(() => {
    if (!message) return;

    if (message.type === "success") {
      toast.success(message.text);
    } else if (message.type === "error") {
      toast.error(message.text);
    } else {
      toast(message.text);
    }
  }, [message]);

  const handleGenerate = () => {
    setMessage(null);

    startGenerateTransition(async () => {
      const result = await generateTOTP(serviceName);
      const data = result.data;

      if (result?.error) {
        setMessage({
          type: "error",
          text: t("messages.generateError"),
        });
      }

      if (result?.success) {
        await update();
        setSecret(data.secret);
        setQrDataUrl(data.qr);
        setMessage({
          type: "success",
          text: t("messages.generateSuccess"),
        });
      }
    });
  };

  const handleVerify = () => {
    setMessage(null);

    if (!secret) {
      return setMessage({
        type: "error",
        text: t("messages.noSecret"),
      });
    }

    startVerifyTransition(async () => {
      const result = await verifyTOTP(verificationCode, secret);

      if (result?.error) {
        setMessage({ type: "error", text: t("messages.verifyFailed") });
      }

      setMessage({
        type: result?.totp ? "success" : "error",
        text: result?.totp
          ? t("messages.verifySuccess")
          : t("messages.verifyError"),
      });
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>{t("title")}</CardTitle>
            <CardDescription>{t("description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  {t("instructions")}
                </p>

                <div className="flex gap-2">
                  <Button onClick={handleGenerate} disabled={isGeneratePending}>
                    {isGeneratePending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />{" "}
                        {t("generateButton.default")}
                      </>
                    ) : (
                      t("generateButton.default")
                    )}
                  </Button>
                </div>

                {secret && (
                  <div className="space-y-2">
                    <Label>{t("secretSection.label")}</Label>
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
                            text: t("secretSection.copiedMessage"),
                          });
                        }}
                      >
                        {t("secretSection.copyButton")}
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col items-center justify-center">
                {qrDataUrl ? (
                  <QRCodeDisplay dataUrl={qrDataUrl} secret={secret!} />
                ) : (
                  <div className="text-muted-foreground text-center text-sm">
                    {t("qrCode.empty")}
                  </div>
                )}
              </div>

              {secret && (
                <div className="pt-4">
                  <Label>{t("verification.label")}</Label>
                  <div className="mt-2 flex gap-2">
                    <InputOTP
                      value={verificationCode}
                      onChange={setVerificationCode}
                      required
                      inputMode="numeric"
                      maxLength={6}
                      onInput={(e) => {
                        const input = e.currentTarget;
                        input.value = input.value.replace(/\D/g, "");
                      }}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                    <Button
                      onClick={handleVerify}
                      disabled={isVerifyPending}
                      variant="secondary"
                    >
                      {t("verification.verifyButton")}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
