// app/api/images/generate/route.ts
import { NextResponse } from "next/server";
import { GoogleGenAI, Modality } from "@google/genai";

export const runtime = "nodejs"; // 本地/服务端跑图建议用 nodejs 运行时

export async function POST(req: Request) {
  try {
    const { prompt, width = 1024, height = 1024 } = await req.json();

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return NextResponse.json({ error: "prompt is required" }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GOOGLE_API_KEY missing" }, { status: 500 });
    }

    const client = new GoogleGenAI({ apiKey });

    // 说明：
    // - "gemini-2.0-flash-preview-image-generation" 为官方图生图模型（有地区/配额限制）
    // - 若你的账号该模型不可用，可换 "gemini-2.0-flash-exp"（通常返回文本，不一定返图）
    const model = "gemini-2.0-flash-preview-image-generation";

    const resp = await client.models.generateContent({
      model,
      contents: [{ role: "user", parts: [{ text: prompt.trim() }] }],
      // 要求返回图像；部分地区可能忽略 width/height
      config: {
        responseModalities: ["IMAGE", "TEXT"], // 让它尽量返图，文本用于报错提示
        // @ts-ignore 新字段有时处于灰度；忽略 ts 报错即可
        imageGenerationConfig: { numberOfImages: 1, width, height },
      },
    });

    // 解析返回的 base64 图像
    const parts = resp?.candidates?.[0]?.content?.parts ?? [];
    const imagePart: any = parts.find((p: any) => p?.inlineData?.data);
    const textPart: any = parts.find((p: any) => typeof p?.text === "string");

    if (!imagePart?.inlineData?.data) {
      // 模型没返图时，把文本返回出来方便你在前端 alert
      const msg = textPart?.text || "No image returned by the model.";
      return NextResponse.json({ error: msg }, { status: 502 });
    }

    const base64 = imagePart.inlineData.data as string;
    const dataUrl = `data:image/png;base64,${base64}`;

    return NextResponse.json({ image: dataUrl, prompt: prompt.trim() });
  } catch (err: any) {
    // 返回更可读的错误
    const message =
      err?.message ||
      (typeof err === "string" ? err : "Image generation failed");
    return NextResponse.json({ error: message }, { status: 500 });
  }
}