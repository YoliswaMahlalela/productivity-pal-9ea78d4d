import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const MODEL = "google/gemini-3-flash-preview";

function getModel() {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("LOVABLE_API_KEY is not configured");
  return createLovableAiGatewayProvider(key)(MODEL);
}

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      topic: z.string().min(1).max(2000),
      tone: z.enum(["formal", "informal", "persuasive"]),
    }),
  )
  .handler(async ({ data }) => {
    const toneGuide: Record<string, string> = {
      formal:
        "Use a polished, respectful, business-professional register. Prefer complete sentences, courteous phrasing, and neutral vocabulary. Avoid slang, contractions where unnatural, and emojis.",
      informal:
        "Use a warm, collegial register suitable for trusted coworkers. Natural contractions and a friendly opener are fine, but stay workplace-appropriate — no slang, no emojis, no overly casual phrasing.",
      persuasive:
        "Lead with a clear value proposition, anchor on concrete outcomes and evidence, and close with a specific, low-friction call to action. Stay confident but never pushy or manipulative.",
    };
    const { text } = await generateText({
      model: getModel(),
      system: [
        "You are a senior executive communications writer drafting workplace email on behalf of a busy professional.",
        "Output requirements:",
        "- Line 1: 'Subject: <concise, specific subject under 70 characters>'.",
        "- Line 2: blank.",
        "- Then the email body: a greeting addressed to the recipient (use a sensible placeholder like '[Recipient Name]' or '[Team]' if not specified), 2-4 tight paragraphs, and a professional sign-off ending with '[Your Name]'.",
        "Writing standards: clear purpose in the first sentence, specific asks with owners and dates where applicable, active voice, no filler, no marketing fluff, no exclamation marks unless the topic clearly warrants one, no emojis, and no markdown formatting.",
        "Use bracketed placeholders (e.g. [Date], [Project Name]) only when essential information is missing from the prompt.",
        `Tone guidance: ${toneGuide[data.tone]}`,
        "Do not include any commentary, preface, or explanation before or after the email.",
      ].join("\n"),
      prompt: `Draft a ${data.tone} workplace email about:\n\n${data.topic}`,
    });
    return { text };
  });

export const summarizeNotes = createServerFn({ method: "POST" })
  .inputValidator(z.object({ notes: z.string().min(1).max(20000) }))
  .handler(async ({ data }) => {
    const { text } = await generateText({
      model: getModel(),
      system: [
        "You are a senior chief-of-staff distilling raw meeting notes into a precise executive briefing.",
        "Return clean markdown with EXACTLY these sections in this order:",
        "## Key Points",
        "## Decisions",
        "## Action Items",
        "## Deadlines",
        "## Responsibilities",
        "## Risks & Open Questions",
        "Rules:",
        "- Use concise bullet points (one idea per bullet, no run-on sentences).",
        "- Action Items must follow the format: '- [Owner] Action — due [Date if known]'.",
        "- Deadlines must list date + the deliverable it gates.",
        "- Responsibilities must map each named person to the areas they own.",
        "- Never invent names, numbers, dates, or commitments not present in the notes. If unclear, mark as 'TBD' or call it out under Risks & Open Questions.",
        "- If a section has nothing, write '- None identified'.",
        "- Be neutral and factual; do not add opinion or advice.",
      ].join("\n"),
      prompt: data.notes,
    });
    return { text };
  });

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      tasks: z.string().min(1).max(10000),
      horizon: z.enum(["daily", "weekly"]).default("daily"),
    }),
  )
  .handler(async ({ data }) => {
    const { text } = await generateText({
      model: getModel(),
      system: [
        "You are an executive productivity coach building a realistic, prioritized schedule for a working professional.",
        "Return clean markdown with EXACTLY these sections in this order:",
        "## Prioritized Schedule",
        "## Focus Strategy",
        "## Time Optimization Tips",
        "Schedule rules:",
        "- For a daily horizon, plan a single 9:00 AM – 6:00 PM workday with explicit time blocks (e.g. '9:00 – 9:30').",
        "- For a weekly horizon, group by weekday (Mon–Fri) with 2–4 blocks per day.",
        "- Treat any user-provided meeting times as fixed; build deep-work blocks around them.",
        "- Include a 30–45 minute lunch break and at least one short buffer/recovery block.",
        "- Label each block with the task/meeting and a priority tag: (High) / (Medium) / (Low).",
        "- Front-load the highest-cognitive-load work into the user's likely peak hours (mornings by default).",
        "Focus Strategy: 2–4 bullets explaining the reasoning — what got prioritized, what got deferred, and why.",
        "Time Optimization Tips: 3–5 specific, actionable suggestions on batching, focus blocks, meeting hygiene, buffers, and reducing context switching. No generic platitudes.",
        "Do not invent tasks that were not provided. If information is missing, make conservative, clearly reasonable assumptions.",
      ].join("\n"),
      prompt: `Horizon: ${data.horizon}\n\nTasks and meetings:\n${data.tasks}`,
    });
    return { text };
  });
