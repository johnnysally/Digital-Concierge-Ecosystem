import React from "react";
import SectionHeader from "../../components/customer/ui/SectionHeader";

const PromotionsPage = () => {
  return (
    <div className="space-y-8">
      <SectionHeader title="Promotions" subtitle="Unlock offers, loyalty rewards and referral bonuses across DigitalSafaris." />
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 text-slate-400">
        <p className="text-white">Promotions will be displayed here once the backend sends current offers.</p>
      </div>
    </div>
  );
};

export default PromotionsPage;
