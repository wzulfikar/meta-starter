/**
 * Authenticate request
 */
export async function parseAuth(
  req: Request,
): Promise<{ [key: string]: string } | { error: string }> {
  // TODO: implement auth logic. Return userId, sessionId, or other auth-related info
  return {  };
}
