import { createServerFn } from "@tanstack/react-start";
import { streamText, Output } from "ai";
import { z } from "zod";

import {
  AI_MODEL,
  createLovableAiGatewayProvider,
  toFriendlyAiError,
} from "./ai-gateway.server";
import {
  emailSystemPrompt,
  emailUserPrompt,
  meetingSystemPrompt,
  meetingUserPrompt,
  plannerSystemPrompt,
  plannerUserPrompt,
} from "./prompts.server";

const MAX_TEXT = 20000;

const nonEmpty = (max = MAX_TEXT) => z.string().trim().min(1).max(max);

async function runStructured<T>(
  system: string,
  prompt: string,
  schema: z.ZodType<T>,
): Promise<T> {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("The AI service is not configured. Please contact support.");

  try {
    const gateway = createLovableAiGatewayProvider(key);
    const result = streamText({
      model: gateway(AI_MODEL),
      system,
      prompt,
      output: Output.object({ schema: schema as never }),
    });
    return (await result.output) as T;
  } catch (error) {
    console.error("[SmartWork AI] generation failed", error);
    throw toFriendlyAiError(error);
  }
}

/* ---------------------------------- Email --------------------------------- */

export const EmailResultSchema = z.object({
  subject: z.string(),
  greeting: z.string(),
  body: z.string(),
  callToAction: z.string(),
  closing: z.string(),
  assumptions: z.array(z.string()),
});
export type EmailResult = z.infer<typeof EmailResultSchema>;

const EmailInput = z.object({
  purpose: nonEmpty(4000),
  keyInfo: z.string().max(8000).optional(),
  audience: z.string().max(60),
  tone: z.string().max(60),
  length: z.string().max(60),
  cta: z.string().max(2000).optional(),
  senderName: z.string().max(120).optional(),
  refinement: z.string().max(500).optional(),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => EmailInput.parse(input))
  .handler(async ({ data }) =>
    runStructured(emailSystemPrompt, emailUserPrompt(data), EmailResultSchema),
  );

/* -------------------------------- Meetings -------------------------------- */

export const MeetingResultSchema = z.object({
  summary: z.string(),
  keyPoints: z.array(z.string()),
  decisions: z.array(z.string()),
  actionItems: z.array(
    z.object({
      task: z.string(),
      responsible: z.string(),
      deadline: z.string(),
      status: z.string(),
    }),
  ),
  openQuestions: z.array(z.string()),
  missingInformation: z.array(z.string()),
});
export type MeetingResult = z.infer<typeof MeetingResultSchema>;

const MeetingInput = z.object({
  notes: nonEmpty(),
  title: z.string().max(200).optional(),
  context: z.string().max(2000).optional(),
});

export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => MeetingInput.parse(input))
  .handler(async ({ data }) =>
    runStructured(meetingSystemPrompt, meetingUserPrompt(data), MeetingResultSchema),
  );

/* --------------------------------- Planner -------------------------------- */

export const PlanResultSchema = z.object({
  overview: z.string(),
  prioritised: z.array(
    z.object({
      task: z.string(),
      quadrant: z.string(),
      urgency: z.string(),
      importance: z.string(),
      deadline: z.string(),
      estimatedMinutes: z.number(),
      reasoning: z.string(),
    }),
  ),
  schedule: z.array(
    z.object({
      start: z.string(),
      end: z.string(),
      activity: z.string(),
      type: z.string(),
    }),
  ),
  conflicts: z.array(z.string()),
  recommendations: z.array(z.string()),
});
export type PlanResult = z.infer<typeof PlanResultSchema>;

const PlanInput = z.object({
  tasks: nonEmpty(),
  workingHours: z.string().max(120),
  commitments: z.string().max(4000).optional(),
  energyPreference: z.string().max(200).optional(),
  planDate: z.string().max(60).optional(),
});

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => PlanInput.parse(input))
  .handler(async ({ data }) =>
    runStructured(plannerSystemPrompt, plannerUserPrompt(data), PlanResultSchema),
  );
