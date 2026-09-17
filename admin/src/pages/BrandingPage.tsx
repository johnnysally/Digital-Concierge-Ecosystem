import { useEffect, useMemo, useState } from 'react';
import { getAllSettings, updateSetting } from '../api/settingsApi';
import SectionHeader from '../components/ui/SectionHeader';
import { getPlatformAssetUrl } from '../hooks/usePlatformConfig';

type Setting = { key: string; value: unknown; category: string; description?: string };
type DraftValue = string | number | boolean | unknown[] | Record<string, unknown>;

const isObjectValue = (value: unknown): value is Record<string, unknown> => Boolean(value) && typeof value === 'object' && !Array.isArray(value);
const isBrandingSetting = (setting: Setting) => setting.category === 'website' || /^(site_|brand_)/.test(setting.key) || ['primary_color', 'secondary_color'].includes(setting.key);
const getSettingLabel = (key: string) => key.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

const BrandingPage = () => {
    const [settings, setSettings] = useState<Setting[]>([]);
    const [drafts, setDrafts] = useState<Record<string, DraftValue>>({});
    const [pendingFiles, setPendingFiles] = useState<Record<string, File | null>>({});
    const [loading, setLoading] = useState(true);
    const [savingKey, setSavingKey] = useState<string | null>(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        getAllSettings()
            .then((response) => {
                const allSettings = Object.entries(response.settings || {}).flatMap(([category, categorySettings]) => (categorySettings as Setting[]).map((setting) => ({ ...setting, category })));
                const brandingSettings = allSettings.filter(isBrandingSetting);
                setSettings(brandingSettings);
                setDrafts(Object.fromEntries(brandingSettings.map((setting) => [setting.key, setting.value as DraftValue])));
            })
            .catch(() => setError('Unable to load branding settings.'))
            .finally(() => setLoading(false));
    }, []);

    const updateDraft = (key: string, value: DraftValue) => {
        setDrafts((current) => ({ ...current, [key]: value }));
        setMessage('');
        setError('');
    };

    const selectFile = (key: string, file: File | null) => {
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            setError('Select an image file for the logo or favicon.');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError('Logo and favicon images must be smaller than 5 MB.');
            return;
        }
        setPendingFiles((current) => ({ ...current, [key]: file }));
        setMessage('Image selected locally. It will be uploaded when the backend upload endpoint is connected.');
        setError('');
    };

    const removeFile = (key: string) => {
        setPendingFiles((current) => ({ ...current, [key]: null }));
        setMessage('');
    };

    const isSupportedUrl = (value: string) => {
        if (!value) return true;
        try { return ['http:', 'https:', 'data:'].includes(new URL(value).protocol); } catch { return false; }
    };

    const validateValue = (value: DraftValue) => {
        if (isObjectValue(value) && typeof value.url === 'string' && !isSupportedUrl(value.url)) return false;
        return true;
    };

    const saveSetting = async (setting: Setting) => {
        const value = drafts[setting.key];
        if (value === undefined || !validateValue(value)) {
            setError(`Enter a valid URL for ${getSettingLabel(setting.key)}.`);
            return;
        }
        setSavingKey(setting.key);
        setMessage('');
        setError('');
        try {
            await updateSetting(setting.key, value);
            setSettings((current) => current.map((item) => item.key === setting.key ? { ...item, value } : item));
            setMessage(`${getSettingLabel(setting.key)} saved.`);
        } catch {
            setError(`Unable to save ${getSettingLabel(setting.key)}.`);
        } finally { setSavingKey(null); }
    };

    const groupedSettings = useMemo(() => settings.reduce<Record<string, Setting[]>>((groups, setting) => {
        (groups[setting.category] ||= []).push(setting);
        return groups;
    }, {}), [settings]);

    if (loading) return <div className="flex min-h-[400px] items-center justify-center text-slate-400">Loading branding settings...</div>;

    return (
        <div className="space-y-6">
            <SectionHeader title="Portal Branding" subtitle="Manage branding values supplied by the platform settings" />
            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-sm text-slate-600 dark:text-slate-300">These controls are generated from the branding settings returned by the backend. New branding settings will appear here automatically.</p>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Image fields expect URLs because the current backend stores branding assets as setting values.</p>
            </div>
            {message ? <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-500">{message}</div> : null}
            {error ? <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-500">{error}</div> : null}
            {settings.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-700">No branding settings were returned by the backend.</div> : Object.entries(groupedSettings).map(([category, categorySettings]) => (
                <section key={category} className="space-y-4">
                    <h2 className="text-lg font-semibold capitalize text-slate-900 dark:text-white">{category.replace(/_/g, ' ')} branding</h2>
                    <div className="grid gap-5 lg:grid-cols-2">
                        {categorySettings.map((setting) => <BrandSettingCard key={setting.key} setting={setting} value={drafts[setting.key]} pendingFile={pendingFiles[setting.key] || null} saving={savingKey === setting.key} onChange={(value) => updateDraft(setting.key, value)} onSave={() => saveSetting(setting)} onFileSelect={(file) => selectFile(setting.key, file)} onRemoveFile={() => removeFile(setting.key)} />)}
                    </div>
                </section>
            ))}
        </div>
    );
};

const BrandSettingCard = ({ setting, value, pendingFile, saving, onChange, onSave, onFileSelect, onRemoveFile }: { setting: Setting; value: DraftValue | undefined; pendingFile: File | null; saving: boolean; onChange: (value: DraftValue) => void; onSave: () => void; onFileSelect: (file: File | null) => void; onRemoveFile: () => void }) => {
    const assetUrl = setting.key.includes('logo') || setting.key.includes('favicon') ? getPlatformAssetUrl(value) : '';
    const isImageAsset = setting.key.includes('logo') || setting.key.includes('favicon');
    const [localPreview, setLocalPreview] = useState('');

    useEffect(() => {
        if (!pendingFile) {
            setLocalPreview('');
            return undefined;
        }
        const objectUrl = URL.createObjectURL(pendingFile);
        setLocalPreview(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [pendingFile]);

    const previewUrl = localPreview || assetUrl;
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">{getSettingLabel(setting.key)}</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{setting.description || 'Managed by the platform configuration.'}</p>
            {previewUrl ? <img src={previewUrl} alt={`${getSettingLabel(setting.key)} preview`} className="mt-4 h-20 w-20 rounded-xl object-contain" /> : null}
            {isImageAsset ? (
                <div className="mt-4 rounded-xl border border-dashed border-slate-300 p-4 dark:border-slate-700">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Choose image file
                        <input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" onChange={(event) => onFileSelect(event.target.files?.[0] || null)} className="mt-2 block w-full text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-primary-500 file:px-3 file:py-2 file:font-semibold file:text-white" />
                    </label>
                    {pendingFile ? (
                        <div className="mt-3 flex items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
                            <span className="truncate">Pending: {pendingFile.name}</span>
                            <button type="button" onClick={onRemoveFile} className="shrink-0 font-semibold text-rose-500 hover:text-rose-600">Remove</button>
                        </div>
                    ) : null}
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Local preview only until the backend upload endpoint is connected.</p>
                </div>
            ) : null}
            <SettingEditor setting={setting} value={value} onChange={onChange} />
            <button type="button" onClick={onSave} disabled={saving} className="mt-4 rounded-xl bg-primary-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60">{saving ? 'Saving...' : 'Save'}</button>
        </section>
    );
};

const SettingEditor = ({ setting, value, onChange }: { setting: Setting; value: DraftValue | undefined; onChange: (value: DraftValue) => void }) => {
    const inputClass = 'mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 outline-none focus:border-primary-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white';
    if (isObjectValue(value) && ('url' in value || 'enabled' in value)) return <div className="mt-4 space-y-3"><input type="url" value={typeof value.url === 'string' ? value.url : ''} onChange={(event) => onChange({ ...value, url: event.target.value })} placeholder="https://cdn.example.com/image.png" className={inputClass} /><label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"><input type="checkbox" checked={value.enabled !== false} onChange={(event) => onChange({ ...value, enabled: event.target.checked })} /> Enabled</label></div>;
    if (typeof value === 'boolean') return <label className="mt-4 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"><input type="checkbox" checked={value} onChange={(event) => onChange(event.target.checked)} /> Enabled</label>;
    if (Array.isArray(value)) return <input value={value.map(String).join(', ')} onChange={(event) => onChange(event.target.value.split(',').map((item) => item.trim()).filter(Boolean))} className={inputClass} />;
    if (typeof value === 'number') return <input type="number" value={value} onChange={(event) => onChange(Number(event.target.value))} className={inputClass} />;
    return <input type={setting.key.includes('color') ? 'color' : setting.key.includes('logo') || setting.key.includes('favicon') ? 'url' : 'text'} value={typeof value === 'string' ? value : ''} onChange={(event) => onChange(event.target.value)} className={inputClass} />;
};

export default BrandingPage;
