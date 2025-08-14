"use client";
import { useEffect, useState, Dispatch, SetStateAction } from "react";

export type Msg = { role: "system" | "user" | "assistant"; content: string };

type Props = {
    //
    onMessagesChange?: Dispatch<SetStateAction<Msg[]>>;
  };
  

const SYSTEM_PROMPT = `
You are a friendly writing partner for life stories.
- Chat conversationally; reply in short paragraphs.
- Keep ALL prior turns in mind.
- If user provides enough details for a memory story, offer to generate it.
- If required fields (title, narrator, timeframe, place, people, event) are missing, ask ONE follow-up at a time.
`;

export default function ChatWindow({ onMessagesChange }: Props) {
    const [messages, setMessages] = useState<Msg[]>([]);
    const [input, setInput] = useState("");
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        localStorage.removeItem("story_chat_history"); // ← 清空持久化
        setMessages([{ role: "system", content: SYSTEM_PROMPT }]);
      }, []);

  useEffect(() => {
    if (messages.length) {
      localStorage.setItem("story_chat_history", JSON.stringify(messages));
      onMessagesChange?.(messages);
    }
  }, [messages, onMessagesChange]);

  const send = async () => {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    const next = [...messages, { role: "user", content: text } as Msg];
    setMessages(next);
    setBusy(true);
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await r.json();
      if (data?.message) {
        setMessages(m => [...m, data.message]);
      } else {
        setMessages(m => [...m, { role: "assistant", content: "Sorry, something went wrong." }]);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-2xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Write Your Story (Chat)</h1>

      <div className="h-96 overflow-y-auto rounded border p-3 mb-3 bg-white">
        {messages
          .filter(m => m.role !== "system")
          .map((m, i) => (
            <div key={i} className={`mb-3 ${m.role === "assistant" ? "text-gray-900" : "text-blue-700"}`}>
              <b>{m.role === "assistant" ? "AI" : "You"}:</b>{" "}
              <span className="whitespace-pre-wrap">{m.content}</span>
            </div>
          ))}
        {busy && <div className="text-gray-500 text-sm">AI is typing…</div>}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 rounded border px-3 py-2"
          placeholder={busy ? "Waiting for AI..." : "Type a message and press Enter"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          disabled={busy}
        />
        <button className="rounded bg-black px-4 py-2 text-white disabled:opacity-50" onClick={send} disabled={busy}>
          Send
        </button>
      </div>
    </div>
  );
}