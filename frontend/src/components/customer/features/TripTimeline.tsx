import React from "react";

const TripTimeline = () => {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
      <h3 className="text-xl font-semibold text-white">Travel plan</h3>
      <div className="mt-5 space-y-4">
        {[
          { date: "Aug 18", title: "Check-in at Savannah Suites" },
          { date: "Aug 19", title: "City tour and dinner reservation" },
          { date: "Aug 20", title: "Airport transfer to Mombasa" },
        ].map((item) => (
          <div key={item.date} className="grid gap-2 rounded-3xl border border-slate-800 bg-slate-950 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{item.date}</p>
            <p className="font-medium text-white">{item.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TripTimeline;
