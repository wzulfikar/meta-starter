// Indicate CF runtime. Make sure to add this in CF dashboard.
export const IS_CF_RUNTIME = !!process.env.IS_CF_RUNTIME;

export const env = {
  AUTUMN_SECRET_KEY: process.env.AUTUMN_SECRET_KEY!,
  SOCIALDATA_API_KEY: process.env.SOCIALDATA_API_KEY!,
  TOKEN_SECRET: process.env.TOKEN_SECRET!,
  LINEAR_API_KEY: process.env.LINEAR_API_KEY!,
};

if (IS_CF_RUNTIME) {
  for (const key in env) {
    if (!env[key as keyof typeof env]) {
      throw new Error(`Missing environment variable: ${key}`);
    }
  }
}
