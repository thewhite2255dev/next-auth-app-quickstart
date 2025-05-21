"use client";

import { useSession } from "next-auth/react";

export default function useCurrentRole() {
  const { data: session } = useSession();

  return session?.user?.role;
}
