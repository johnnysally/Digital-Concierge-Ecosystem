import React, { useMemo, useState } from "react";
import { useTheme } from "../../../context/customer/ThemeContext";

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}
function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

const CalendarPlanner: React.FC = () => {
  const [current, setCurrent] = useState<Date>(new Date());
  const [selected, setSelected] = useState<Date | null>(new Date());
  const { isDark } = useTheme();

  const monthMatrix = useMemo(() => {
    const start = startOfMonth(current);
    const end = endOfMonth(current);
    const startWeek = start.getDay();
    const daysInMonth = end.getDate();

    const matrix: Array<Array<{ d: Date | null }>> = [];
    let row: Array<{ d: Date | null }> = [];
    // leading blanks
    for (let i = 0; i < startWeek; i++) row.push({ d: null });
    for (let day = 1; day <= daysInMonth; day++) {
      row.push({ d: new Date(current.getFullYear(), current.getMonth(), day) });
      if (row.length === 7) {
        matrix.push(row);
        row = [];
      }
    }
    // trailing blanks
    if (row.length > 0) {
      while (row.length < 7) row.push({ d: null });
      matrix.push(row);
    }
    return matrix;
  }, [current]);

  function prevMonth() {
    setCurrent((c) => new Date(c.getFullYear(), c.getMonth() - 1, 1));
  }
  function nextMonth() {
    setCurrent((c) => new Date(c.getFullYear(), c.getMonth() + 1, 1));
  }

  const today = new Date();

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="col-span-2">
        <div className="flex items-center justify-between">
          <div>
            <h4 className={`text-lg font-semibold ${isDark ? "text-slate-100" : "text-slate-900"}`}>Trip Planner</h4>
            <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>Plan trips, view schedules and add reminders.</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={prevMonth} className={`rounded-lg border px-3 py-1 text-sm ${isDark ? "border-slate-700 bg-slate-800 text-slate-100" : "border-slate-200 bg-white"} hover:shadow`}>‹</button>
            <div className={`px-3 text-sm font-medium ${isDark ? "text-slate-200" : "text-slate-700"}`}>{current.toLocaleString(undefined, { month: "long", year: "numeric" })}</div>
            <button onClick={nextMonth} className={`rounded-lg border px-3 py-1 text-sm ${isDark ? "border-slate-700 bg-slate-800 text-slate-100" : "border-slate-200 bg-white"} hover:shadow`}>›</button>
          </div>
        </div>

        <div className={`mt-4 rounded-lg border p-4 ${isDark ? "border-slate-800 bg-slate-900/80" : "border-slate-200/70 bg-white/90"}`}>
          <div className={`grid grid-cols-7 gap-2 text-center text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            {weekdays.map((w) => (
              <div key={w} className="font-medium">
                {w}
              </div>
            ))}
          </div>

          <div className="mt-2 grid grid-cols-7 gap-2">
            {monthMatrix.map((week, i) => (
              <React.Fragment key={i}>
                {week.map((cell, idx) => {
                  const d = cell.d;
                  const isToday = d && d.toDateString() === today.toDateString();
                  const isSelected = d && selected && d.toDateString() === selected.toDateString();
                  const isCurrentMonth = d !== null;
                  return (
                    <button
                      key={idx}
                      onClick={() => d && setSelected(d)}
                      className={`h-10 w-full rounded-md p-1 text-sm transition-all ${
                        !isCurrentMonth
                          ? "opacity-40"
                          : isSelected
                          ? "bg-amber-500/15 ring-2 ring-amber-400 text-amber-300"
                          : isToday
                          ? `${isDark ? "bg-slate-800 text-slate-100 font-semibold" : "bg-slate-100 text-slate-900 font-semibold"}`
                          : isDark
                          ? "text-slate-200 hover:bg-slate-800"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      {d ? d.getDate() : ""}
                    </button>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className={`mt-4 rounded-lg border p-4 ${isDark ? "border-slate-800 bg-slate-900/80" : "border-slate-200/70 bg-white/90"}`}>
          <h5 className={`font-medium ${isDark ? "text-slate-100" : "text-slate-900"}`}>Add note</h5>
          <p className={`mt-2 text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>Select a date to add a quick note or schedule.</p>
        </div>
      </div>

      <aside className="col-span-1 space-y-4">
        <div className={`rounded-lg border p-4 ${isDark ? "border-slate-800 bg-slate-900/80" : "border-slate-200/70 bg-white/90"}`}>
          <h5 className={`text-sm font-semibold ${isDark ? "text-slate-100" : "text-slate-900"}`}>Today's Schedule</h5>
          <div className={`mt-3 text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>
            <p className="mb-2">No items for today. Use the planner to add trips and reminders.</p>
          </div>
        </div>

        <div className={`rounded-lg border p-4 ${isDark ? "border-slate-800 bg-slate-900/80" : "border-slate-200/70 bg-white/90"}`}>
          <h5 className={`text-sm font-semibold ${isDark ? "text-slate-100" : "text-slate-900"}`}>Upcoming Trips</h5>
          <ul className={`mt-3 space-y-2 text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>
            <li className={`rounded-md p-2 ${isDark ? "bg-slate-800/80" : "bg-gray-50"}`}>No upcoming trips</li>
          </ul>
        </div>

        <div className={`rounded-lg border p-4 ${isDark ? "border-slate-800 bg-slate-900/80" : "border-slate-200/70 bg-white/90"}`}>
          <h5 className={`text-sm font-semibold ${isDark ? "text-slate-100" : "text-slate-900"}`}>Quick Actions</h5>
          <div className="mt-2 flex flex-col gap-2">
            <button className="rounded-lg bg-amber-500/15 px-3 py-2 text-sm font-semibold text-amber-300">Create trip</button>
            <button className={`rounded-lg border px-3 py-2 text-sm ${isDark ? "border-slate-700 text-slate-200" : "border-slate-200 text-slate-700"}`}>Import itinerary</button>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default CalendarPlanner;
