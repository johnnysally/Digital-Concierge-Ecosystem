import SectionHeader from '../../../../shared/components/ui/SectionHeader';

export default function ChatbotPage() {
  return (
    <div className="space-y-8">
      <SectionHeader title="AI Concierge" description="Ask questions, get recommendations, and plan your trip in a conversational interface." />

      <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Customer</p>
                  <p className="mt-2 text-sm text-slate-600">Can you recommend hotels near the Eiffel Tower with breakfast included?</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">AI Concierge</p>
                  <p className="mt-2 text-sm text-slate-600">I found three top-rated hotels under $260 per night, all offering breakfast and quick metro access.</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Customer</p>
                  <p className="mt-2 text-sm text-slate-600">What are the best restaurants within 500 meters of my booked hotel?</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">AI Concierge</p>
                  <p className="mt-2 text-sm text-slate-600">I recommend Skyview Bistro, Bistro Lane, and Lunar Sushi for highly rated options with delivery and dine-in available.</p>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-6 rounded-[32px] bg-slate-950 p-8 text-white shadow-xl ring-1 ring-white/10">
            <h3 className="text-lg font-semibold">AI Concierge tips</h3>
            <ul className="mt-6 space-y-3 text-sm leading-6 text-slate-300">
              <li>Start with your destination and travel dates.</li>
              <li>Ask for room types, rates, or local experiences.</li>
              <li>Use the chat to book, modify or cancel trips.</li>
            </ul>
            <textarea className="mt-6 w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-4 text-sm text-white outline-none placeholder:text-slate-500" placeholder="Ask the AI Concierge anything about your trip..."></textarea>
            <button className="w-full rounded-3xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400">Send message</button>
          </aside>
        </div>
      </div>
    </div>
  );
}
