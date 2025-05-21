export const DEFAULT_LOGIN_REDIRECT = "/dashboard";
export const DEFAULT_ONBOARDING_REDIRECT = "/get-started";

export const publicRoutes = ["/", "/auth/verify-email", "/auth/reset-password"];

export const authRoutes = [
  "/auth/login",
  "/auth/signup",
  "/auth/forgot-password",
];

export const apiAuthPrefix = "/api/auth";
export const protectedRoutes = ["/settings", "/dashboard"];
