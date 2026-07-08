import React, { useState } from "react";
import SectionHeader from "../../components/customer/ui/SectionHeader";
import { useChatContext } from "../../context/customer/ChatContext";

const ChatbotPage = () => {
  const [message, setMessage] = useState("");
  const { messages, sendMessage } = useChatContext();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!message.trim()) return;
    sendMessage(message.trim());
    setMessage("");
  };

  return (
    <div className="space-y-8">
      <SectionHeader title="AI Concierge" subtitle="Ask DigitalSafaris to help with your trip planning and recommendations." />
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`rounded-3xl p-4 ${msg.sender === "customer" ? "bg-slate-800 text-white" : "bg-slate-950 text-slate-200"}`}>
              <p className="text-sm">{msg.body}</p>
              <p className="mt-2 text-xs text-slate-500">{msg.sender === "customer" ? "You" : "Concierge"}</p>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="mt-6 flex gap-3">
          <input
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Ask a question or request a recommendation"
            className="flex-1 rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
          />
          <button type="submit" className="rounded-3xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatbotPage;
