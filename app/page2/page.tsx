// app/page2.tsx
"use client";

import { useState } from "react";
import { extractStoryText, storyToImagePrompt } from "@/lib/story";

export default function ImageFromStoryPage() {
  const [story, setStory] = useState("");
  const [prompt, setPrompt] = useState("");
  const [busy, setBusy] = useState(false);
  const [imgUrl, setImgUrl] = useState<string>("");
  const [error, setError] = useState<string>("");

  // 从故事快速生成 Prompt
  const makePrompt = () => {
    const cleaned = extractStoryText(story || "");
    setPrompt(storyToImagePrompt(cleaned));
  };

  const generate = async () => {
    setBusy(true);
    setError("");
    setImgUrl("");
    try {
      const r = await fetch("/api/images/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim(), // 直接用 prompt 出图
          width: 1024,
          height: 1024,
        }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || "Image generation failed");

      // 兼容 data URL / 外链 / base64
      const url =
        (typeof data.image === "string" && data.image.startsWith("data:image"))
          ? data.image
          : (data.imageUrl || data.url || (data.base64 ? `data:image/png;base64,${data.base64}` : null));

      if (!url) throw new Error("No image returned.");
      setImgUrl(url);
    } catch (e: any) {
      setError(e?.message || "Failed to generate image.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-white">Generate Image from Story</h1>

        {/* 1) 贴你的故事 */}
        <div className="bg-white rounded-2xl p-4 shadow">
          <label className="block font-medium mb-2">Paste your story here</label>
          <textarea
            className="w-full border rounded p-3 h-48"
            value={story}
            onChange={(e) => setStory(e.target.value)}
            placeholder="Paste the story text here…"
          />
          <div className="mt-3 flex gap-2">
            <button
              onClick={makePrompt}
              disabled={!story.trim()}
              className="rounded bg-gray-900 text-white px-4 py-2 disabled:opacity-50"
            >
              Create Prompt from Story
            </button>
          </div>
        </div>

        {/* 2) 可编辑的 Prompt（自动生成后可手动微调） */}
        <div className="bg-white rounded-2xl p-4 shadow">
          <label className="block font-medium mb-2">Prompt (editable)</label>
          <textarea
            className="w-full border rounded p-3 h-40"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the key visual scene you want…"
          />
          <div className="mt-3 flex gap-2">
            <button
              onClick={generate}
              disabled={busy || !prompt.trim()}
              className="rounded bg-black text-white px-4 py-2 disabled:opacity-50"
            >
              {busy ? "Generating…" : "Generate Image"}
            </button>
          </div>
          {error && <div className="mt-3 text-red-600 text-sm">{error}</div>}
        </div>

        {/* 3) 结果图 */}
        {imgUrl && (
          <div className="bg-white rounded-2xl p-4 shadow">
            <h2 className="font-semibold mb-2">Generated Image</h2>
            <img src={imgUrl} alt="Generated" className="rounded border max-w-full" />
          </div>
        )}
      </div>
    </div>
  );
}