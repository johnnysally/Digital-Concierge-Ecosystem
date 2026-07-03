import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchRiderProfile, updateRiderProfile, fetchDocuments, uploadDocument } from '../../profile/services/profileService';
import TransportCard from '../../../../shared/components/TransportCard';

const accentOptions = [
  { label: 'Sky Blue', value: 'sky', className: 'bg-sky-500' },
  { label: 'Emerald', value: 'emerald', className: 'bg-emerald-500' },
  { label: 'Violet', value: 'violet', className: 'bg-violet-500' },
];

const initialProfileForm = {
  name: '',
  phone: '',
  email: '',
  city: '',
  country: '',
  currency: '',
  timezone: '',
};

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState({
    notifications: true,
    compactMode: false,
    accentColor: 'sky',
    sidebarDensity: 'spacious',
  });
  const [profileForm, setProfileForm] = useState(initialProfileForm);
  const [profileSaveStatus, setProfileSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [selectedDocument, setSelectedDocument] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState('');
  const [documentType, setDocumentType] = useState<'Driving License' | 'Passport' | 'Other'>('Driving License');
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

  const {
    data: profileData,
    isLoading: profileLoading,
    isError: profileError,
  } = useQuery({
    queryKey: ['transport-profile'],
    queryFn: () => fetchRiderProfile('rider-1'),
    onSuccess: (profile) => {
      setProfileForm({
        name: profile.name || '',
        phone: profile.phone || profile.phoneNumber || '',
        email: profile.email || '',
        city: profile.city || '',
        country: profile.country || '',
        currency: profile.currency || '',
        timezone: profile.timezone || '',
      });
    },
  });

  const profileMutation = useMutation({
    mutationFn: (updatedData: typeof profileForm) => updateRiderProfile('rider-1', updatedData),
    onMutate: () => setProfileSaveStatus('saving'),
    onSuccess: () => {
      setProfileSaveStatus('success');
      queryClient.invalidateQueries({ queryKey: ['transport-profile'] });
    },
    onError: () => setProfileSaveStatus('error'),
  });

  const {
    data: documents,
    isLoading: documentsLoading,
    isError: documentsError,
  } = useQuery({
    queryKey: ['transport-documents'],
    queryFn: () => fetchDocuments(),
  });

  const documentUploadMutation = useMutation({
    mutationFn: (formData: FormData) => uploadDocument(formData),
    onMutate: () => setUploadStatus('uploading'),
    onSuccess: () => {
      setUploadStatus('success');
      queryClient.invalidateQueries({ queryKey: ['transport-documents'] });
      setSelectedDocument(null);
      setDocumentName('');
      setDocumentType('Driving License');
    },
    onError: () => setUploadStatus('error'),
  });

  const renderFieldValue = (value: string | undefined, fallback = '—') =>
    profileLoading ? <span className="inline-block h-5 w-24 rounded-full bg-slate-200 animate-pulse" /> : value || fallback;

  const handleProfileSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await profileMutation.mutateAsync(profileForm);
  };

  const handleDocumentFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedDocument(file);
    if (file && !documentName) setDocumentName(file.name);
  };

  const handleDocumentUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedDocument) return;

    const formData = new FormData();
    formData.append('file', selectedDocument);
    formData.append('name', documentName || selectedDocument.name);
    formData.append('type', documentType);
    formData.append('metadata', JSON.stringify({ purpose: documentType }));

    await documentUploadMutation.mutateAsync(formData);
  };

  useEffect(() => {
    const saved = localStorage.getItem('transportPageSettings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('transportPageSettings', JSON.stringify(settings));
    window.dispatchEvent(
      new CustomEvent('transportSettingsUpdate', {
        detail: {
          accentColor: settings.accentColor,
          compactMode: settings.compactMode,
          sidebarDensity: settings.sidebarDensity,
        },
      }),
    );
  }, [settings]);

  return (
    <div className="space-y-8">
      <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Page Settings</h2>
            <p className="mt-2 text-sm text-slate-500">Configure your dashboard behavior and notification preferences.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
          <h3 className="text-lg font-semibold text-slate-900">Display Preferences</h3>
          <div className="mt-6 space-y-5">
            <label className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">Compact view</p>
                <p className="text-sm text-slate-500">Show more items in tighter cards.</p>
              </div>
              <button
                type="button"
                onClick={() => setSettings((prev) => ({ ...prev, compactMode: !prev.compactMode }))}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  settings.compactMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 shadow-sm'
                }`}
              >
                {settings.compactMode ? 'Enabled' : 'Disabled'}
              </button>
            </label>

            <label className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">Notifications</p>
                <p className="text-sm text-slate-500">Receive alerts for new orders and updates.</p>
              </div>
              <button
                type="button"
                onClick={() => setSettings((prev) => ({ ...prev, notifications: !prev.notifications }))}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  settings.notifications ? 'bg-emerald-600 text-white' : 'bg-white text-slate-700 shadow-sm'
                }`}
              >
                {settings.notifications ? 'On' : 'Off'}
              </button>
            </label>

            <label className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">Sidebar density</p>
                <p className="text-sm text-slate-500">Choose how compact the sidebar controls appear.</p>
              </div>
              <select
                value={settings.sidebarDensity}
                onChange={(event) => setSettings((prev) => ({ ...prev, sidebarDensity: event.target.value }))}
                className="rounded-3xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none"
              >
                <option value="spacious">Spacious</option>
                <option value="compact">Compact</option>
              </select>
            </label>
          </div>
        </div>

        <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
          <h3 className="text-lg font-semibold text-slate-900">Accent theme</h3>
          <p className="mt-2 text-sm text-slate-500">Pick your favorite highlight color for the dashboard.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            {accentOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setSettings((prev) => ({ ...prev, accentColor: option.value }))}
                className={`flex h-14 min-w-[9rem] items-center justify-between rounded-3xl border px-4 py-3 text-sm font-semibold transition ${
                  settings.accentColor === option.value
                    ? 'border-slate-900 bg-slate-950 text-white'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>{option.label}</span>
                <span className={`h-3.5 w-3.5 rounded-full ${option.className}`} />
              </button>
            ))}
          </div>
          <div className="mt-8 rounded-3xl bg-slate-50 p-5 text-sm text-slate-600">
            <p className="font-semibold text-slate-900">Preview</p>
            <p className="mt-2">Your dashboard will use the selected accent color to highlight key actions and status badges.</p>
          </div>
        </div>
      </div>

      <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
        <h3 className="text-lg font-semibold text-slate-900">Saved settings</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Notifications</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{settings.notifications ? 'Enabled' : 'Disabled'}</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-5">
            <p className="text-sm text-slate-500">View mode</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{settings.compactMode ? 'Compact' : 'Standard'}</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Sidebar layout</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{settings.sidebarDensity}</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Accent color</p>
            <p className="mt-2 inline-flex items-center gap-2 text-lg font-semibold text-slate-900">
              <span>{accentOptions.find((option) => option.value === settings.accentColor)?.label}</span>
              <span className={`inline-block h-3.5 w-3.5 rounded-full ${accentOptions.find((option) => option.value === settings.accentColor)?.className}`} />
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <TransportCard title="Profile summary">
          <div className="space-y-5">
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Name</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{renderFieldValue(profileData?.name, 'No name')}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Email</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{renderFieldValue(profileData?.email, 'No email')}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Phone</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{renderFieldValue(profileData?.phone || profileData?.phoneNumber, 'No phone')}</p>
            </div>
          </div>
        </TransportCard>

        <TransportCard title="Location & billing">
          <div className="space-y-5">
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">City</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{renderFieldValue(profileData?.city, 'No city')}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Country</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{renderFieldValue(profileData?.country, 'No country')}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Currency</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{renderFieldValue(profileData?.currency, 'No currency')}</p>
            </div>
          </div>
        </TransportCard>

        <TransportCard title="Settings status">
          <div className="space-y-5">
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Timezone</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{renderFieldValue(profileData?.timezone, 'No timezone')}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Data status</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{profileLoading ? 'Loading' : profileError ? 'Error' : 'Loaded'}</p>
            </div>
          </div>
        </TransportCard>
      </div>

      <TransportCard title="Edit profile details">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-500">Update fields loaded from backend and save changes.</p>
          </div>
          <div className="rounded-3xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
            Status: <span className={profileSaveStatus === 'success' ? 'text-emerald-600' : profileSaveStatus === 'error' ? 'text-red-600' : 'text-slate-600'}>{profileSaveStatus}</span>
          </div>
        </div>

        {profileLoading ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="h-24 rounded-3xl bg-slate-200 animate-pulse" />
            ))}
          </div>
        ) : profileError ? (
          <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            Unable to load your profile. Please refresh the page.
          </div>
        ) : (
          <form onSubmit={handleProfileSave} className="mt-6 space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-600">
                <span>Name</span>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(event) => setProfileForm((prev) => ({ ...prev, name: event.target.value }))}
                  placeholder="Name"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-600">
                <span>Email</span>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(event) => setProfileForm((prev) => ({ ...prev, email: event.target.value }))}
                  placeholder="Email"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-600">
                <span>Phone</span>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={(event) => setProfileForm((prev) => ({ ...prev, phone: event.target.value }))}
                  placeholder="Phone number"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-600">
                <span>City</span>
                <input
                  type="text"
                  value={profileForm.city}
                  onChange={(event) => setProfileForm((prev) => ({ ...prev, city: event.target.value }))}
                  placeholder="City"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-600">
                <span>Country</span>
                <input
                  type="text"
                  value={profileForm.country}
                  onChange={(event) => setProfileForm((prev) => ({ ...prev, country: event.target.value }))}
                  placeholder="Country"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-600">
                <span>Currency</span>
                <input
                  type="text"
                  value={profileForm.currency}
                  onChange={(event) => setProfileForm((prev) => ({ ...prev, currency: event.target.value }))}
                  placeholder="Currency"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-600 sm:col-span-2">
                <span>Timezone</span>
                <input
                  type="text"
                  value={profileForm.timezone}
                  onChange={(event) => setProfileForm((prev) => ({ ...prev, timezone: event.target.value }))}
                  placeholder="Timezone"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
                />
              </label>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={profileMutation.isLoading}
                className="rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50"
              >
                {profileMutation.isLoading ? 'Saving…' : 'Save profile'}
              </button>
              <button
                type="button"
                onClick={() => setProfileForm({
                  name: profileData?.name || '',
                  email: profileData?.email || '',
                  phone: profileData?.phone || '',
                  city: profileData?.city || '',
                  country: profileData?.country || '',
                  currency: profileData?.currency || '',
                  timezone: profileData?.timezone || '',
                })}
                className="rounded-3xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Reset
              </button>
            </div>

            {profileMutation.isError && (
              <div className="text-sm text-red-500">Failed to save profile. Please try again.</div>
            )}
            {profileMutation.isSuccess && (
              <div className="text-sm text-emerald-600">Profile updated successfully.</div>
            )}
          </form>
        )}
      </TransportCard>

      <TransportCard title="Documents & license uploads">
        <div className="space-y-6">
          <p className="text-sm text-slate-500">Upload your driving license and any supporting documents for verification.</p>

          <form onSubmit={handleDocumentUpload} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-600">
                <span>Document type</span>
                <select
                  value={documentType}
                  onChange={(event) => setDocumentType(event.target.value as 'Driving License' | 'Passport' | 'Other')}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
                >
                  <option>Driving License</option>
                  <option>Passport</option>
                  <option>Other</option>
                </select>
              </label>

              <label className="space-y-2 text-sm text-slate-600">
                <span>Document name</span>
                <input
                  type="text"
                  value={documentName}
                  onChange={(event) => setDocumentName(event.target.value)}
                  placeholder="Driving License front"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
                />
              </label>
            </div>

            <label className="space-y-2 text-sm text-slate-600">
              <span>Choose file</span>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleDocumentFileChange}
                className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
              />
            </label>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="submit"
                disabled={!selectedDocument || documentUploadMutation.isLoading}
                className="rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50"
              >
                {documentUploadMutation.isLoading ? 'Uploading…' : 'Upload document'}
              </button>
              {selectedDocument && (
                <p className="text-sm text-slate-500">
                  Selected file: <span className="font-medium text-slate-900">{selectedDocument.name}</span>
                </p>
              )}
            </div>

            {uploadStatus === 'success' && (
              <div className="text-sm text-emerald-600">Document uploaded successfully.</div>
            )}
            {uploadStatus === 'error' && (
              <div className="text-sm text-red-500">Upload failed. Please try again.</div>
            )}
          </form>

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4 rounded-3xl bg-slate-50 px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">Uploaded documents</p>
                <p className="text-sm text-slate-500">Your uploaded license images and supporting files.</p>
              </div>
              <span className="text-sm text-slate-500">
                {documentsLoading ? 'Loading…' : `${documents?.length ?? 0} documents`}
              </span>
            </div>

            {documentsError ? (
              <div className="rounded-3xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
                Unable to load uploaded documents.
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {documentsLoading ? (
                  [...Array(2)].map((_, index) => (
                    <div key={index} className="h-28 rounded-3xl bg-slate-200 animate-pulse" />
                  ))
                ) : documents?.length ? (
                  documents.map((document: any) => (
                    <div key={document.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{document.name}</p>
                          <p className="text-sm text-slate-500">{document.type}</p>
                        </div>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                          {document.type === 'Driving License' ? 'License' : 'File'}
                        </span>
                      </div>
                      <div className="mt-4 grid gap-2 text-sm text-slate-500">
                        <p>{document.size}</p>
                        <p>{new Date(document.uploadedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
                    No documents uploaded yet. Use the form above to upload your driving license or other files.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </TransportCard>
    </div>
  );
}
