import React from "react";
import SectionHeader from "../../components/customer/ui/SectionHeader";
import { useAuth } from "../../context/customer/AuthContext";

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <SectionHeader title="Your profile" subtitle="Update preferences, travel details and contact information." />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="text-lg font-semibold text-white">Account details</h3>
          <div className="mt-5 space-y-3 text-sm text-slate-300">
            <p><span className="text-slate-500">Name:</span> {user?.firstName} {user?.lastName}</p>
            <p><span className="text-slate-500">Email:</span> {user?.email}</p>
            <p><span className="text-slate-500">Phone:</span> {user?.phone}</p>
            <p><span className="text-slate-500">Currency:</span> {user?.currency}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
