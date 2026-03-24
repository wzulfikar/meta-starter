import { z } from "zod"

const envSchema = z.object({
  EXPO_PUBLIC_RC_API_KEY_IOS: z
    .string()
    .refine((val) => val.startsWith("appl_") || val.startsWith("test_"), {
      message: "Invalid API key format",
    }),
  EXPO_PUBLIC_RC_API_KEY_ANDROID: z
    .string()
    .refine((val) => val.startsWith("appl_") || val.startsWith("test_"), {
      message: "Invalid API key format",
    })
    .optional(), // TODO: remove optional once we're ready to ship for Android
})

type Env = z.infer<typeof envSchema>

export const env: Env = envSchema.parse(process.env)
