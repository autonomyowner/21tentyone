import { z } from 'zod';

export const envSchema = z.object({
  // App
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.string().default('4000').transform(Number),
  CLIENT_URL: z.string().url().default('http://localhost:3000'),

  // Database
  DATABASE_URL: z.string().url().optional(),

  // Stripe Payments (optional - payments disabled if not set)
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),

  // Resend Email (optional - emails logged only if not set)
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().email().optional(),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function validateEnv() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('Environment validation failed:');
    console.error(result.error.format());
    throw new Error('Invalid environment variables');
  }

  return result.data;
}
