import React from "react";

const RecommendedStays = () => {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Recommended stays</h3>
        <span className="text-sm text-slate-500">Based on your preferences</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { title: "Serene Safari Lodge", location: "Nakuru", price: "KES 19,800" },
          { title: "City Loft Suites", location: "Nairobi", price: "KES 14,200" },
        ].map((stay) => (
          <div key={stay.title} className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
            <h4 className="font-semibold text-white">{stay.title}</h4>
            <p className="mt-2 text-sm text-slate-400">{stay.location}</p>
            <p className="mt-3 text-sm text-slate-200">{stay.price}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecommendedStays;
