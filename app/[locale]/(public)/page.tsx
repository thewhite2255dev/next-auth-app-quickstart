"use client";

import { WelcomeCard } from "@/components/welcome-card";

export default function Home() {
  return (
    <section className="container py-12 sm:py-20">
      <div className="flex flex-col items-center justify-center">
        <WelcomeCard />
      </div>
    </section>
  );
}
