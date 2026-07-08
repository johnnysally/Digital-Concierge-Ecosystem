import React from "react";
import SectionHeader from "../../components/customer/ui/SectionHeader";

const AccommodationSearchPage = () => {
  return (
    <div className="space-y-8">
      <SectionHeader title="Search accommodation" subtitle="Find hotels, lodges, apartments and villas across Africa." />
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
        <label className="block text-sm text-slate-400">Search destinations</label>
        <input
          type="search"
          placeholder="Search hotels, beaches, cities..."
          className="mt-3 w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-4 text-sm text-white outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
        />
      </div>
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 text-slate-400">
        <p className="text-white">Results will appear here once accommodation data is loaded from the backend.</p>
      </div>
    </div>
  );
};

export default AccommodationSearchPage;
