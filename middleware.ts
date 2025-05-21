/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";

import { auth } from "@/auth";
import { routing } from "./i18n/routing";
import {
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  DEFAULT_ONBOARDING_REDIRECT,
  protectedRoutes,
  publicRoutes,
} from "./routes";

const intlMiddleware = createIntlMiddleware(routing);

const authMiddleware = auth((req) => {
  const { nextUrl } = req;
  const user = req.auth?.user;
  const session = !!req.auth;

  const isAuthPage = testPathnameRegex(authRoutes, nextUrl.pathname);
  const isProtectedRoute = testPathnameRegex(protectedRoutes, nextUrl.pathname);
  const isOnboardingRoute = testPathnameRegex(
    [DEFAULT_ONBOARDING_REDIRECT],
    nextUrl.pathname,
  );

  if (!session && isProtectedRoute) {
    const callbackUrl = `${nextUrl.pathname}${nextUrl.search || ""}`;
    const safeCallback = callbackUrl.startsWith("http") ? "/" : callbackUrl;
    return NextResponse.redirect(
      new URL(
        `/auth/login?callback_url=${encodeURIComponent(safeCallback)}`,
        nextUrl,
      ),
    );
  }

  // 🔁 Prevent logged-in user from accessing login/signup
  if (session && isAuthPage) {
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }

  return intlMiddleware(req);
});

const middleware = (req: NextRequest) => {
  const { nextUrl } = req;

  const isPublicPage = testPathnameRegex(publicRoutes, nextUrl.pathname);
  const isAuthPage = testPathnameRegex(authRoutes, nextUrl.pathname);

  if (isAuthPage) {
    return (authMiddleware as any)(req);
  }

  if (isPublicPage) {
    return intlMiddleware(req);
  } else {
    return (authMiddleware as any)(req);
  }
};

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};

export default middleware;

function testPathnameRegex(pages: string[], pathName: string): boolean {
  return RegExp(
    `^(/(${routing.locales.join("|")}))?(${pages.flatMap((p) => (p === "/" ? ["", "/"] : p)).join("|")})/?$`,
    "i",
  ).test(pathName);
}
