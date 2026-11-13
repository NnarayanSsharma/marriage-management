import "server-only";

export class ApiError extends Error {
  constructor(public status: number, public code: string, message: string, public details?: Record<string, string>) {
    super(message);
  }
}

export function errorResponse(error: unknown) {
  if (error instanceof ApiError) {
    return Response.json({ error: { code: error.code, message: error.message, ...(error.details && { details: error.details }) } }, {
      status: error.status,
      headers: { "Cache-Control": "no-store", ...(error.status === 429 && { "Retry-After": "900" }) },
    });
  }
  // Never serialize database/provider errors, request bodies, or credentials.
  return Response.json({ error: { code: "SERVICE_UNAVAILABLE", message: "Account access is temporarily unavailable. Please try again later." } }, { status: 503, headers: { "Cache-Control": "no-store" } });
}
