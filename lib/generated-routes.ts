// ⚠️ Auto-generated file. Do not edit manually.
// Run "pnpm generate-routes" to update.

export const generatedRoutes = {
  public: [
  ":locale",
  ":locale/auth/forgot-password",
  ":locale/auth/login",
  ":locale/auth/signup",
  ":locale/reset-password",
  ":locale/verify-email"
],
  protected: [
  ":locale/dashboard",
  ":locale/settings/mfa"
],
  auth: [
  ":locale/auth/forgot-password",
  ":locale/auth/login",
  ":locale/auth/signup"
],
  admin: [],
  generatedAt: '2025-10-17T14:01:18.567Z'
} as const;

export type GeneratedRoutes = typeof generatedRoutes;
