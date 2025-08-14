// app/api/story/route.ts
import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "edge";
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function POST(req: NextRequest) {
  try {
    const { storyData } = await req.json();
    const title = storyData?.title || storyData?.opening || "Untitled Memory";
    const author = storyData?.signature || storyData?.narrator || "Anonymous";

    const sys = [
      "You are an English narrative writing assistant.",
      "Transform the structured fields into a 400–800 word narrative.",
      "Requirements:",
      "- Strong opening hook",
      "- Concrete details for time/place/people",
      "- Subtle emotion; avoid purple prose",
      "- Smooth flow and clear arc",
      "- Resonant closing line",
      "- Markdown output; level-1 heading (#) equals the title",
      `- Put author's signature at the end exactly as: — ${author}`
    ].join("\n");

    const user = `Story elements JSON:\n${JSON.stringify(storyData ?? {}, null, 2)}\nGenerate the final story now.`;

    const r = await model.generateContent(`${sys}\n\n${user}`);
    const story = r.response.text();

    return Response.json({ story: story?.trim() || `# ${title}\n\n(Story content missing)\n\n— ${author}` });
  } catch (err: any) {
    console.error("[/api/story] error:", err);
    return new Response(JSON.stringify({ error: "STORY_FAILED", message: err?.message || "Unknown error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}