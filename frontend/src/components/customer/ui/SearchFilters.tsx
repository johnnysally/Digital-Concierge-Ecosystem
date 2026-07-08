import React from "react";

const filters = ["Price", "Stars", "Location", "Amenities", "Instant book"];

const SearchFilters = () => {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button key={filter} className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-200 transition hover:border-sky-500 hover:text-white">
          {filter}
        </button>
      ))}
    </div>
  );
};

export default SearchFilters;
