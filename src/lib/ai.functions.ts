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
    const { text } = await generateText({
      model: getModel(),
      system:
        "You are a professional workplace email writer. Write a complete, ready-to-send email. Include a subject line on the first line as 'Subject: ...', then a blank line, then the email body with greeting, body paragraphs, and sign-off. Do not include any commentary or markdown.",
      prompt: `Write a ${data.tone} email about the following topic:\n\n${data.topic}`,
    });
    return { text };
  });

export const summarizeNotes = createServerFn({ method: "POST" })
  .inputValidator(z.object({ notes: z.string().min(1).max(20000) }))
  .handler(async ({ data }) => {
    const { text } = await generateText({
      model: getModel(),
      system:
        "You are an executive assistant. Summarize meeting notes into clear sections using markdown headings: '## Key Points', '## Decisions', '## Action Items', '## Deadlines', '## Responsibilities'. Under each, use concise bullet points. For Action Items include the owner where possible. If a section has no content, write '- None identified'.",
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
      system:
        "You are a productivity coach. Given a list of tasks and meetings, produce a prioritized schedule. Use markdown. Start with '## Prioritized Schedule' followed by a table or bullet list with time blocks (e.g. 9:00 - 10:00), the task/meeting, and priority (High/Medium/Low). Treat meetings as fixed where times are given. Then add '## Time Optimization Tips' with 3-5 specific suggestions about batching, focus blocks, buffer time, and reducing context switching. Assume a typical 9am-6pm workday unless context suggests otherwise.",
      prompt: `Horizon: ${data.horizon}\n\nTasks and meetings:\n${data.tasks}`,
    });
    return { text };
  });
