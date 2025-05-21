// app/(auth)/login/actions.ts
"use server";

import { getTranslations } from "next-intl/server";
import * as z from "zod";

export const LoginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type LoginFormSchemaValues = z.infer<typeof LoginFormSchema>;

export async function loginAction(values: LoginFormSchemaValues) {
  const t = await getTranslations("Form");

  try {
    const validatedFields = LoginFormSchema.safeParse(values, {
      errorMap(issue, ctx) {
        const path = issue.path.join(".");
        const message = {
          email: t("login.errors.email"),
          password: t("login.errors.password"),
        }[path];

        return { message: message || ctx.defaultError };
      },
    });

    if (!validatedFields.success) {
      return { error: t("errors.fields.invalid") };
    }

    // return { success: false, errors: result.error.flatten().fieldErrors };

    // Ici tu peux appeler ta logique loginUser ou autre
    // await loginUser(result.data);

    return { success: true };
  } catch (error) {
    return {
      error: t("errors.generic"),
    };
  }
}
