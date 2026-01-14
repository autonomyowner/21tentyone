import { validateEnv } from './env.validation';

export default () => {
  const env = validateEnv();

  return {
    port: env.PORT,
    nodeEnv: env.NODE_ENV,
    clientUrl: env.CLIENT_URL,

    database: {
      url: env.DATABASE_URL,
    },

    stripe: {
      secretKey: env.STRIPE_SECRET_KEY,
      webhookSecret: env.STRIPE_WEBHOOK_SECRET,
    },

    email: {
      resendApiKey: env.RESEND_API_KEY,
      from: env.EMAIL_FROM,
    },
  };
};
