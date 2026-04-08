import type { ErrorHandlerPayload } from "saas-maker/server";

/**
 * Global error handler
 */
export function onError(ctx: ErrorHandlerPayload) {
	// TODO: report to sentry
	const { errorCode, errorMessage } = ctx.error;

	if (errorCode) {
		console.error(
			`[routes.onError] got errorCode "${errorCode}":`,
			errorMessage,
		);
	}

	switch (errorCode) {
		case "BEARER_AUTH_REQUIRED": {
			// 401 with WWW-Authenticate triggers MCP OAuth discovery flow
			return new Response(null, {
				status: 401,
				headers: {
					"WWW-Authenticate": `Bearer realm="${process.env.NEXT_PUBLIC_APP_URL ?? "https://databorder.app"}"`,
				},
			});
		}
		case "AUTH_ERROR": {
			return Response.json(
				{ error: { code: "UNAUTHENTICATED", message: errorMessage } },
				{ status: 401 },
			);
		}
		case "PARSE_ERROR": {
			return Response.json(
				{ error: { code: "BAD_REQUEST", message: errorMessage } },
				{ status: 401 },
			);
		}
	}

	console.error(`[routes.onError] unhandled error: "${ctx.error.message}".`, {
		cause: getCauseInfoFromError(ctx.error),
		routeSteps: ctx.error.routeInfo?.steps,
	});

	if (process.env.NODE_ENV === "development") {
		console.error("[dev] ctx.error:", ctx.error);
	} else {
		// TODO: report to sentry
	}

	return Response.json(
		{
			error: {
				code: "INTERNAL_SERVER_ERROR",
				message: "Internal server error",
			},
		},
		{ status: 500 },
	);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getCauseInfoFromError(error: any): Record<string, unknown> {
	const cause = error.cause;
	if (!cause) return error;

	// Error from upstream API
	if ("rawResponse" in cause && "statusCode" in cause && "body" in cause) {
		return {
			errorType: "UPSTREAM_API_ERROR",
			url: cause.rawResponse.url,
			status: cause.statusCode,
			body: cause.body,
		};
	}

	// Return raw cause if we don't know the type
	return cause;
}
