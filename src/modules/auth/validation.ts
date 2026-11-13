import { z } from "zod";

export const emailSchema = z.string().trim().max(254).email("Enter a valid email address.");
export const loginSchema = z.object({ email: emailSchema, password: z.string().min(1, "Enter your password.").max(512) });
export const forgotSchema = z.object({ email: emailSchema });
export const signupSchema = (min: number) => z.object({
  name: z.string().trim().min(1, "Enter your full name.").max(100, "Use at most 100 characters."),
  email: emailSchema,
  password: passwordSchema(min),
});
export const passwordSchema = (min: number) => z.string().refine(value => Array.from(value).length >= min, `Use at least ${min} characters.`).refine(value => Array.from(value).length <= 128, "Use at most 128 characters.");
export const resetSchema = (min: number) => z.object({ token: z.string().regex(/^[A-Za-z0-9_-]{43}$/, "This reset link is invalid."), password: passwordSchema(min) });
