// app/api/chat/route.ts
import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "edge";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// 将前端 messages -> Gemini contents（Gemini 只接受 role: "user" | "model"）
function toGeminiContents(messages: { role: "system"|"user"|"assistant"; content: string }[]) {
  const sys = messages.filter(m => m.role === "system").map(m => m.content).join("\n");
  const rest = messages.filter(m => m.role !== "system");

  const contents: any[] = [];
  if (sys) contents.push({ role: "user", parts: [{ text: sys }] });

  for (const m of rest) {
    contents.push({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    });
  }
  return contents;
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = (await req.json()) as {
      messages: { role: "system"|"user"|"assistant"; content: string }[];
    };

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "EMPTY_MESSAGES" }), { status: 400 });
    }

    const contents = toGeminiContents(messages);
    const r = await model.generateContent({ contents });
    const text = r.response.text().trim();

    return Response.json({ message: { role: "assistant", content: text } });
  } catch (err: any) {
    console.error("[/api/chat] error:", err);
    return new Response(JSON.stringify({
      error: "CHAT_FAILED",
      message: err?.message || "Unknown error",
    }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}