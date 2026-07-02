import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchRiderProfile, updateRiderProfile } from '../../profile/services/profileService';

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    vehicleType: '',
    vehicleLicensePlate: '',
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['transport-profile'],
    queryFn: () => fetchRiderProfile('rider-1'), // Replace with actual rider ID
    onSuccess: (profileData) => {
      setFormData({
        name: profileData.name || '',
        phoneNumber: profileData.phoneNumber || '',
        email: profileData.email || '',
        vehicleType: profileData.vehicleType || '',
        vehicleLicensePlate: profileData.vehicleLicensePlate || '',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (updatedData: any) => updateRiderProfile('rider-1', updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transport-profile'] });
      setIsEditing(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateMutation.mutateAsync(formData);
    } catch (error) {
      console.error('Failed to update profile', error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
        <h2 className="text-2xl font-semibold text-slate-900">Rider Profile</h2>
        <p className="mt-2 text-sm text-slate-500">Manage your profile information and settings.</p>
      </div>

      {isError ? (
        <div className="rounded-[32px] border border-red-200 bg-red-50 p-8 text-sm text-red-700">
          Unable to load profile. Please refresh the page.
        </div>
      ) : isLoading ? (
        <div className="text-sm text-slate-500">Loading profile...</div>
      ) : (
        <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
          {!isEditing ? (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h3 className="text-sm text-slate-500">Full Name</h3>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{data?.name}</p>
                </div>
                <div>
                  <h3 className="text-sm text-slate-500">Phone Number</h3>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{data?.phoneNumber}</p>
                </div>
                <div>
                  <h3 className="text-sm text-slate-500">Email</h3>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{data?.email}</p>
                </div>
                <div>
                  <h3 className="text-sm text-slate-500">Vehicle Type</h3>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{data?.vehicleType}</p>
                </div>
                <div>
                  <h3 className="text-sm text-slate-500">Vehicle License Plate</h3>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{data?.vehicleLicensePlate}</p>
                </div>
                <div>
                  <h3 className="text-sm text-slate-500">Verification Status</h3>
                  <p className="mt-2 text-lg font-semibold text-emerald-600">{data?.verified ? 'Verified' : 'Pending'}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Edit Profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Full Name"
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
                />
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  placeholder="Phone Number"
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
                />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Email"
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
                />
                <input
                  type="text"
                  value={formData.vehicleType}
                  onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                  placeholder="Vehicle Type"
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
                />
              </div>
              <input
                type="text"
                value={formData.vehicleLicensePlate}
                onChange={(e) => setFormData({ ...formData, vehicleLicensePlate: e.target.value })}
                placeholder="Vehicle License Plate"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
              />
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={updateMutation.isLoading}
                  className="rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50"
                >
                  {updateMutation.isLoading ? 'Saving…' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-3xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
              {updateMutation.isError && (
                <div className="text-sm text-red-500">Failed to update profile. Please try again.</div>
              )}
              {updateMutation.isSuccess && (
                <div className="text-sm text-emerald-600">Profile updated successfully.</div>
              )}
            </form>
          )}
        </div>
      )}
    </div>
  );
}
