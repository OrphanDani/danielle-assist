import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

const LOVABLE_AIG_RUN_ID_HEADER = "X-Lovable-AIG-Run-ID";

export function createLovableAiGatewayRunIdFetch(initialRunId?: string) {
  let runId = initialRunId?.trim() || undefined;

  return {
    fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
      const headers = new Headers(init?.headers);
      if (runId && !headers.has(LOVABLE_AIG_RUN_ID_HEADER)) {
        headers.set(LOVABLE_AIG_RUN_ID_HEADER, runId);
      }
      const response = await fetch(input, { ...init, headers });
      const next = response.headers.get(LOVABLE_AIG_RUN_ID_HEADER)?.trim();
      if (!runId && next) runId = next;
      return response;
    },
    getRunId: () => runId,
  };
}

export function createLovableAiGatewayProvider(lovableApiKey: string, initialRunId?: string) {
  const runIdFetch = createLovableAiGatewayRunIdFetch(initialRunId);

  return createOpenAICompatible({
    name: "lovable",
    baseURL: "https://ai.gateway.lovable.dev/v1",
    supportsStructuredOutputs: false,
    headers: {
      "Lovable-API-Key": lovableApiKey,
      "X-Lovable-AIG-SDK": "vercel-ai-sdk",
    },
    fetch: runIdFetch.fetch,
  });
}

export const AI_MODEL = "google/gemini-3.7-flash";

/** Maps gateway/network failures to safe, user-facing messages. */
export function toFriendlyAiError(error: unknown): Error {
  const raw = error instanceof Error ? error.message : String(error);
  const status = /\b(400|401|402|403|429|5\d\d)\b/.exec(raw)?.[1];

  if (status === "402")
    return new Error("The AI workspace is out of credits. Please add credits to continue.");
  if (status === "403")
    return new Error("AI access is currently blocked for this workspace. Contact your admin.");
  if (status === "429")
    return new Error("Too many requests right now. Please wait a moment and try again.");
  if (status === "401")
    return new Error("The AI service is not configured correctly. Please contact support.");
  return new Error("We couldn't generate a response right now. Please try again.");
}
