// app/api/ask/route.ts
import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "edge";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

type StepDef = { key: string; label: string; required?: boolean; placeholder?: string };

export async function POST(req: NextRequest) {
  try {
    const { steps, collected, lastAnswer } = await req.json() as {
      steps: StepDef[];
      collected: Record<string, string>;
      lastAnswer: string;
    };

    if (!Array.isArray(steps)) {
      return Response.json({ error: "INVALID_STEPS" }, { status: 400 });
    }

    const allowedKeys = steps.map(s => s.key);

    // 1) 如果没有用户输入，就直接问第一个缺的 required
    if (!lastAnswer?.trim()) {
      const remaining = steps.filter(
        s => s.required && !(collected[s.key] || "").trim()
      );
      if (remaining.length === 0) {
        return Response.json({ done: true, updatedCollected: collected });
      }
      const next = remaining[0];
      return Response.json({
        done: false,
        nextKey: next.key,
        question: `Please provide: ${next.label}`,
        updatedCollected: collected
      });
    }

    // 2) 抽取用户输入到 JSON
    const extractPrompt = [
      "You extract structured story elements from a single user sentence.",
      "Return JSON only. No extra text.",
      "Rules:",
      `Allowed keys: ${allowedKeys.join(", ")}`,
      `collected:\n${JSON.stringify(collected)}`,
      `user_answer:\n${lastAnswer}`
    ].join("\n");

    const extractRes = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: extractPrompt }] }],
      generationConfig: { responseMimeType: "application/json" }
    });

    let extracted: Record<string, string> = {};
    try {
      extracted = JSON.parse(extractRes.response.text() || "{}");
    } catch {
      extracted = {};
    }

    // 3) 合并数据
    const updated: Record<string, string> = { ...(collected || {}) };
    for (const k of Object.keys(extracted)) {
      if (!allowedKeys.includes(k)) continue;
      const newVal = (extracted[k] ?? "").toString().trim();
      if (!newVal) continue;
      const oldVal = (updated[k] ?? "").toString().trim();
      if (!oldVal || newVal.length > oldVal.length) {
        updated[k] = newVal;
      }
    }

    // 4) 找缺的 required
    const remaining = steps.filter(
      s => s.required && !(updated[s.key] || "").trim()
    );

    if (remaining.length === 0) {
      return Response.json({
        done: true,
        nextKey: null,
        question: null,
        updatedCollected: updated
      });
    }

    // 5) 生成下一问
    const next = remaining[0];
    return Response.json({
      done: false,
      nextKey: next.key,
      question: `Please provide: ${next.label}`,
      updatedCollected: updated
    });

  } catch (err: any) {
    console.error("[/api/ask] error:", err);
    return new Response(JSON.stringify({ error: "ASK_FAILED", message: err?.message || "Unknown error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}