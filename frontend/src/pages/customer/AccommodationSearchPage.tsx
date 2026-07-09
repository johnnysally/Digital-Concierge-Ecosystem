import React from "react";
import SectionHeader from "../../components/customer/ui/SectionHeader";

type AccommodationSearchPageProps = {
  variant?: "all" | "hotels" | "bnbs";
};

const AccommodationSearchPage = ({ variant = "all" }: AccommodationSearchPageProps) => {
  const config = {
    all: {
      title: "Search accommodation",
      subtitle: "Find hotels, lodges, apartments and villas across Africa.",
      placeholder: "Search hotels, beaches, cities...",
      helper: "Browse every available stay in one place.",
    },
    hotels: {
      title: "Browse hotels",
      subtitle: "Discover premium stays, resorts, and city hotels curated for comfort.",
      placeholder: "Search hotels by city or amenity...",
      helper: "Showcasing luxury hotels and business-friendly stays.",
    },
    bnbs: {
      title: "Browse BnBs",
      subtitle: "Explore cozy private homes, villas, and boutique stays for relaxed travel.",
      placeholder: "Search BnBs by destination or style...",
      helper: "Perfect for longer stays and intimate getaways.",
    },
  }[variant];

  return (
    <div className="space-y-8">
      <SectionHeader title={config.title} subtitle={config.subtitle} />
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
        <label className="block text-sm text-slate-400">Search destinations</label>
        <input
          type="search"
          placeholder={config.placeholder}
          className="mt-3 w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-4 text-sm text-white outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
        />
      </div>
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 text-slate-400">
        <p className="text-white">{config.helper}</p>
        <p className="mt-2">Results will appear here once accommodation data is loaded from the backend.</p>
      </div>
    </div>
  );
};

export default AccommodationSearchPage;
