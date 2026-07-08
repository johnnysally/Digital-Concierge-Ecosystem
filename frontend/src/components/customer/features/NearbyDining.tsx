import React from "react";
import Badge from "../ui/Badge";

const NearbyDining = () => {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-white">Nearby dining</h3>
          <p className="text-sm text-slate-400">Curated restaurants and dining experiences near your stay.</p>
        </div>
        <Badge label="Live" variant="success" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { name: "Maji Grill", description: "Coastal seafood and local favorites", rating: "4.9" },
          { name: "Rooftop Bistro", description: "Sunset dining with city views", rating: "4.8" },
        ].map((restaurant) => (
          <div key={restaurant.name} className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
            <h4 className="font-semibold text-white">{restaurant.name}</h4>
            <p className="mt-2 text-sm text-slate-400">{restaurant.description}</p>
            <p className="mt-3 text-sm text-slate-300">Rating: {restaurant.rating} ?</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NearbyDining;
