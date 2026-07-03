import { FormEvent, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchRiderProfile, updateRiderProfile } from '../../profile/services/profileService';
import TransportCard from '../../../../shared/components/TransportCard';

const deliveryOptions = ['Motorcycle', 'Bicycle', 'Car'];

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    vehicleType: '',
    vehicleLicensePlate: '',
    avatarUrl: '',
    preferredDeliveryType: 'Motorcycle',
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['transport-profile'],
    queryFn: () => fetchRiderProfile('rider-1'), // Replace with actual rider ID
    onSuccess: (profileData) => {
      setFormData({
        name: profileData.name || '',
        phoneNumber: profileData.phone || profileData.phoneNumber || '',
        email: profileData.email || '',
        vehicleType: profileData.vehicleType || '',
        vehicleLicensePlate: profileData.vehicleLicensePlate || '',
        avatarUrl: profileData.avatarUrl || '',
        preferredDeliveryType: profileData.preferredDeliveryType || 'Motorcycle',
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await updateMutation.mutateAsync(formData);
    } catch (error) {
      console.error('Failed to update profile', error);
    }
  };

  const profileStats = [
    { label: 'Completed deliveries', value: data?.completedDeliveries ?? 0, accent: 'text-sky-600' },
    { label: 'Monthly earnings', value: `KES ${data?.monthlyEarnings?.toFixed(2) ?? '0.00'}`, accent: 'text-emerald-600' },
    { label: 'Avg. rating', value: `${data?.averageRating?.toFixed(1) ?? '0.0'} ★`, accent: 'text-violet-600' },
    { label: 'Status', value: data?.verified ? 'Verified' : 'Pending', accent: data?.verified ? 'text-emerald-600' : 'text-orange-600' },
  ];

  const renderField = (value: any, fallback: string, width = 'w-32') =>
    isLoading ? <div className={`h-6 ${width} rounded-full bg-slate-200/70 animate-pulse`} /> : <span>{value ?? fallback}</span>;

  return (
    <div className="space-y-8">
      <TransportCard title="Rider Profile Overview">
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="flex flex-col gap-6 rounded-[32px] border border-slate-200 bg-slate-50 p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="relative h-28 w-28 overflow-hidden rounded-3xl bg-slate-200 shadow-sm">
                  {isLoading ? (
                    <div className="h-full w-full animate-pulse bg-slate-200" />
                  ) : (
                    <img
                      src={data?.avatarUrl || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=200&q=80'}
                      alt="Rider avatar"
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="space-y-2">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Transport partner</p>
                  <h3 className="text-3xl font-semibold text-slate-900">
                    {renderField(data?.name, 'Rider name', 'w-48')}
                  </h3>
                  <p className="text-sm text-slate-500">
                    Keep your profile updated to optimize route assignments and rider matching.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/80">
                  <p className="text-sm text-slate-500">Vehicle</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    {renderField(data?.vehicleType, 'Not set')}
                  </p>
                </div>
                <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/80">
                  <p className="text-sm text-slate-500">Preferred delivery</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    {renderField(data?.preferredDeliveryType, 'Motorcycle')}
                  </p>
                </div>
                <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/80">
                  <p className="text-sm text-slate-500">Phone</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    {renderField(data?.phone || data?.phoneNumber, 'N/A')}
                  </p>
                </div>
                <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/80">
                  <p className="text-sm text-slate-500">Email</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    {renderField(data?.email, 'N/A')}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {profileStats.map((item) => (
                <div key={item.label} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80">
                  <p className="text-sm text-slate-500">{item.label}</p>
                  <p className={`mt-3 text-2xl font-semibold ${item.accent}`}>
                    {isLoading ? <span className="inline-block h-8 w-24 rounded-full bg-slate-200 animate-pulse" /> : item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <TransportCard title="Profile details">
              <div className="grid gap-4">
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Full name</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    {renderField(data?.name, 'N/A')}
                  </p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">License</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    {renderField(data?.vehicleLicensePlate, 'N/A')}
                  </p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Verification</p>
                  <p className={`mt-2 text-lg font-semibold ${data?.verified ? 'text-emerald-600' : 'text-orange-600'}`}>
                    {isLoading ? <span className="inline-block h-6 w-28 rounded-full bg-slate-200 animate-pulse" /> : data?.verified ? 'Verified' : 'Pending'}
                  </p>
                </div>
              </div>
            </TransportCard>

            <TransportCard title="Delivery profile">
              <div className="grid gap-4">
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Preferred rider status</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    {renderField(data?.availability, 'Available')}
                  </p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Working region</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    {renderField(data?.region, 'Nairobi')}
                  </p>
                </div>
              </div>
            </TransportCard>
          </div>
        </div>
      </TransportCard>

      {isError ? (
        <div className="rounded-[32px] border border-red-200 bg-red-50 p-8 text-sm text-red-700">
          Unable to load profile. Please refresh the page.
        </div>
      ) : (
        <TransportCard title={isEditing ? 'Edit rider profile' : 'Manage profile settings'}>
          {isLoading ? (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="rounded-3xl bg-slate-100 p-6 animate-pulse" />
                ))}
              </div>
              <div className="rounded-3xl bg-slate-100 p-6 animate-pulse h-52" />
            </div>
          ) : isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-600">
                  <span>Name</span>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Full Name"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
                  />
                </label>
                <label className="space-y-2 text-sm text-slate-600">
                  <span>Phone Number</span>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    placeholder="Phone Number"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
                  />
                </label>
                <label className="space-y-2 text-sm text-slate-600">
                  <span>Email</span>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Email"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
                  />
                </label>
                <label className="space-y-2 text-sm text-slate-600">
                  <span>Vehicle Type</span>
                  <input
                    type="text"
                    value={formData.vehicleType}
                    onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                    placeholder="Vehicle Type"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
                  />
                </label>
              </div>

              <label className="space-y-2 text-sm text-slate-600">
                <span>Vehicle License Plate</span>
                <input
                  type="text"
                  value={formData.vehicleLicensePlate}
                  onChange={(e) => setFormData({ ...formData, vehicleLicensePlate: e.target.value })}
                  placeholder="License Plate"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
                />
              </label>

              <label className="space-y-2 text-sm text-slate-600">
                <span>Profile Photo URL</span>
                <input
                  type="url"
                  value={formData.avatarUrl}
                  onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                  placeholder="https://"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
                />
              </label>

              <label className="space-y-2 text-sm text-slate-600">
                <span>Preferred Delivery Type</span>
                <select
                  value={formData.preferredDeliveryType}
                  onChange={(e) => setFormData({ ...formData, preferredDeliveryType: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
                >
                  {deliveryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <div className="flex flex-col gap-3 sm:flex-row">
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
          ) : (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Delivery preferences</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{data?.preferredDeliveryType || 'Motorcycle'}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Profile loaded</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{data?.name ? 'Ready' : 'Waiting'}</p>
                </div>
              </div>

              <div className="rounded-3xl bg-slate-50 p-6">
                <h3 className="text-base font-semibold text-slate-900">Profile summary</h3>
                <div className="mt-4 space-y-3 text-sm text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>Name</span>
                    <span className="font-semibold text-slate-900">{data?.name || '—'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Email</span>
                    <span className="font-semibold text-slate-900">{data?.email || '—'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Phone</span>
                    <span className="font-semibold text-slate-900">{data?.phone || data?.phoneNumber || '—'}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Edit profile details
              </button>
            </div>
          )}
        </TransportCard>
      )}
    </div>
  );
}
