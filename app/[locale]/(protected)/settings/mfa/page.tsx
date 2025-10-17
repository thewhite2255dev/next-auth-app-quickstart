"use client";

import TOTPSetup from "@/components/totp/totp-setup";

export default function DashboardPage() {
  return (
    <section className="container py-12 sm:py-20">
      <div className="flex flex-col items-center justify-center">
        <TOTPSetup />
      </div>
    </section>
  );
}
