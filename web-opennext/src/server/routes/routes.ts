import { throwOnError } from "saas-maker";
import { createRoute } from "saas-maker/server";
import { verifyAgentToken } from "@/server/lib/generateAgentToken";
import { onError } from "./onError";
import { parseAuth } from "./parseAuth";

const baseRoute = createRoute({
	name: "baseRoute",
	onError,
});

export const appRoute = baseRoute.extend({ name: "appRoute" }).parse({
	auth: async (ctx) => {
		const parsedAuth = await parseAuth(ctx.request);
		throwOnError(parsedAuth);
		return { deviceId: parsedAuth.deviceId };
	},
});

export const agentRoute = baseRoute.extend({ name: "agentRoute" }).parse({
	auth: async (ctx) => {
		// Bearer token auth (MCP OAuth flow via Supabase)
		const authHeader = ctx.request.headers.get("Authorization");
		if (authHeader?.startsWith("Bearer ")) {
			const bearerToken = authHeader.slice(7);
			const { createClient } = await import("@supabase/supabase-js");
			const supabase = createClient(
				process.env.NEXT_PUBLIC_SUPABASE_URL!,
				process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
			);
			const {
				data: { user },
			} = await supabase.auth.getUser(bearerToken);
			if (user) return { token: bearerToken, userId: user.id };
			throwOnError({ error: "Invalid bearer token", errorCode: "AUTH_ERROR" });
		}

		// Legacy query param token (backward compat)
		const token = new URL(ctx.request.url).searchParams.get("token");
		if (token && verifyAgentToken(token)) return { token };

		// No auth provided — return 401 so MCP clients can discover OAuth
		throwOnError({ error: "Unauthorized", errorCode: "BEARER_AUTH_REQUIRED" });
		return { token: "" }; // unreachable, satisfies TS
	},
});
