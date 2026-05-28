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
        "You are an executive assistant. Summarize meeting notes into clear sections using markdown headings: '## Key Points', '## Action Items', '## Deadlines', '## Responsibilities'. Under each, use concise bullet points. If a section has no content, write '- None identified'.",
      prompt: data.notes,
    });
    return { text };
  });

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator(z.object({ tasks: z.string().min(1).max(10000) }))
  .handler(async ({ data }) => {
    const { text } = await generateText({
      model: getModel(),
      system:
        "You are a productivity coach. Given a list of tasks, produce a prioritized daily schedule. Use markdown. Start with '## Prioritized Schedule' followed by a table or bullet list with time blocks (e.g. 9:00 - 10:00), the task, and priority (High/Medium/Low). End with '## Notes' giving 2-3 short tips about focus, breaks, or batching. Assume a typical 9am-6pm workday unless context suggests otherwise.",
      prompt: `Tasks:\n${data.tasks}`,
    });
    return { text };
  });
