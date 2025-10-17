/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";

import { auth } from "@/auth";
import { routing } from "./i18n/routing";
import { generatedRoutes } from "./lib/generated-routes";
import { DEFAULT_LOGIN_REDIRECT } from "./lib/config";

const intlMiddleware = createIntlMiddleware(routing);

const middleware = auth((req) => {
  const { nextUrl } = req;
  const session = !!req.auth;

  const isAuthRoute = testPathnameRegex(
    [...generatedRoutes.auth],
    nextUrl.pathname,
  );

  const isProtectedRoute = testPathnameRegex(
    generatedRoutes.protected,
    nextUrl.pathname,
  );

  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }

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

  return intlMiddleware(req);
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};

export default middleware;

function testPathnameRegex(
  pages: readonly string[],
  pathName: string,
): boolean {
  const routePatterns = pages.map((page) => {
    if (page.includes(":locale")) {
      const base = page.replace(":locale", "").replace("//", "/");
      return `${base}`;
    }
    return page;
  });

  return RegExp(
    `^(/(${routing.locales.join("|")}))?(${routePatterns.flatMap((p) => (p === "/" ? ["", "/"] : p)).join("|")})/?$`,
    "i",
  ).test(pathName);
}
