// app/api/collect/route.ts
import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "edge";

type StepDef = { key: string; label: string; required?: boolean; placeholder?: string };
type Msg = { role: "system" | "user" | "assistant"; content: string };
type Collected = Record<string, string>;

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

function missingRequired(steps: StepDef[], data: Collected) {
  return steps.filter(s => s.required && !((data[s.key] ?? "").trim()));
}

export async function POST(req: NextRequest) {
  try {
    const { steps, messages } = (await req.json()) as {
      steps: StepDef[];
      messages: Msg[];
    };

    if (!Array.isArray(steps) || !Array.isArray(messages)) {
      return Response.json({ error: "INVALID_INPUT" }, { status: 400 });
    }

    const allowedKeys = steps.map(s => s.key);
    const transcript = messages
      .filter(m => m.role !== "system")
      .map(m => `${m.role === "assistant" ? "AI" : "User"}: ${m.content}`)
      .join("\n");

    const prompt = [
      "You extract structured story elements from the ENTIRE chat transcript below.",
      "Return JSON ONLY (no extra text).",
      "Rules:",
      "- Use ONLY these keys: " + allowedKeys.join(", "),
      "- Values should be concise but complete.",
      "- If some keys are not present in transcript, omit them (do not hallucinate).",
      "",
      "Transcript:",
      transcript
    ].join("\n");

    const res = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" }
    });

    let storyData: Collected = {};
    try {
      storyData = JSON.parse(res.response.text() || "{}");
    } catch {
      storyData = {};
    }

    // 校验必填
    const missing = missingRequired(steps, storyData);
    const ok = missing.length === 0;

    return Response.json({
      ok,
      storyData,
      missing: missing.map(m => ({ key: m.key, label: m.label }))
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || "COLLECT_FAILED" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}