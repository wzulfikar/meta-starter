import { getCloudflareContext } from "@opennextjs/cloudflare"
import { IS_CF_RUNTIME } from "@/env.server"

export async function checkRateLimit(req: Request, params: { key?: string | ((ip: string) => string) }): Promise<boolean> {
  if (!IS_CF_RUNTIME) return true

  const ip = req.headers.get("CF-Connecting-IP") ?? req.headers.get("X-Forwarded-For") ?? "unknown"

  const { env } = await getCloudflareContext({ async: true })

  const key = typeof params.key === "function" ? params.key(ip) : typeof params.key === "string" ? params.key : ip
  const { success } = await env.INIT_RATE_LIMITER.limit({ key })

  return success
}
