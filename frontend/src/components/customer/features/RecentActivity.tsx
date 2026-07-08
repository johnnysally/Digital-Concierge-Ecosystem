import React from "react";

const RecentActivity = () => {
  const activity = [
    { title: "Booked a villa in Mombasa", time: "2 hours ago" },
    { title: "Ordered dinner from Urban Grill", time: "Yesterday" },
    { title: "Requested airport transfer", time: "2 days ago" },
  ];

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
      <h3 className="text-xl font-semibold text-white">Recent activity</h3>
      <div className="mt-5 space-y-3">
        {activity.map((item) => (
          <div key={item.title} className="rounded-3xl border border-slate-800 bg-slate-950 p-4 text-slate-300">
            <p className="font-medium text-white">{item.title}</p>
            <p className="text-sm text-slate-500">{item.time}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecentActivity;
