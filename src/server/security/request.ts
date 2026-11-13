import "server-only";
import { ApiError } from "@/server/http/errors";
import { getAppOrigin } from "@/server/config/env";

export function assertSameOrigin(request: Request) {
  if (request.headers.get("origin") !== getAppOrigin() || request.headers.get("sec-fetch-site") === "cross-site") {
    throw new ApiError(403, "FORBIDDEN", "This request must come from this application.");
  }
}

export async function readJson(request: Request): Promise<unknown> {
  if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/json") {
    throw new ApiError(415, "VALIDATION_ERROR", "Send an application/json request.");
  }
  const reader = request.body?.getReader();
  if (!reader) throw new ApiError(400, "VALIDATION_ERROR", "A JSON body is required.");
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 8192) {
        await reader.cancel();
        throw new ApiError(413, "VALIDATION_ERROR", "Request body is too large.");
      }
      chunks.push(value);
    }
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(400, "VALIDATION_ERROR", "Send a valid JSON body.");
  } finally {
    reader.releaseLock();
  }
}
