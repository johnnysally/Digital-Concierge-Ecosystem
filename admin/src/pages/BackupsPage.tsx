import { useEffect, useState, useRef } from 'react';
import { listBackups, createBackup, downloadBackup, restoreBackup, deleteBackup, sendBackupEmail, uploadBackup, getBackupSettings, updateBackupSettings } from '../api/backupApi';
import SectionHeader from '../components/ui/SectionHeader';

const BackupsPage = () => {
    const [backups, setBackups] = useState<any[]>([]);
    const [settings, setSettings] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [creating, setCreating] = useState(false);
    const [emailTo, setEmailTo] = useState('');
    const [showEmailInput, setShowEmailInput] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchBackups = async () => {
        try {
            const [b, s] = await Promise.all([listBackups(), getBackupSettings()]);
            setBackups(b.backups || []);
            setSettings(s.settings || {});
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBackups(); }, []);

    const handleCreate = async () => {
        setCreating(true);
        try {
            await createBackup();
            setMessage('Backup created successfully.');
            fetchBackups();
        } catch { setMessage('Failed to create backup.'); }
        finally { setCreating(false); }
    };

    const handleDownload = async (filename: string) => {
        const res = await downloadBackup(filename);
        const url = window.URL.createObjectURL(new Blob([res]));
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
    };

   const handleRestore = async (filename: string) => {
    if (!confirm(`Restore backup "${filename}"? This will overwrite ALL current data and log you out.`)) return;
    try {
        await restoreBackup(filename);
        localStorage.removeItem('digitalsafaris_admin');
        alert('Database restored successfully. You will be redirected to login.');
        window.location.href = '/login';
    } catch { setMessage('Failed to restore backup.'); }
};

    const handleDelete = async (filename: string) => {
        if (!confirm(`Delete backup "${filename}"?`)) return;
        try {
            await deleteBackup(filename);
            setMessage('Backup deleted.');
            fetchBackups();
        } catch { setMessage('Failed to delete backup.'); }
    };

    const handleSendEmail = async (filename: string) => {
        try {
            await sendBackupEmail(filename, emailTo);
            setMessage(`Backup sent to ${emailTo}`);
            setShowEmailInput(null);
            setEmailTo('');
        } catch { setMessage('Failed to send backup.'); }
    };

const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
        await uploadBackup(file);
        localStorage.removeItem('digitalsafaris_admin');
        alert('Backup uploaded and database restored. You will be redirected to login.');
        window.location.href = '/login';
    } catch { setMessage('Failed to upload backup.'); }
};

    const handleSettingsUpdate = async (key: string, value: any) => {
        try {
            await updateBackupSettings({ [key]: value });
            setSettings((prev: any) => ({ ...prev, [key]: value }));
        } catch {}
    };

    if (loading) return <div className="p-8 text-center text-slate-400">Loading backups...</div>;

    return (
        <div className="space-y-6">
            <SectionHeader title="Backups" subtitle="Manage database backups, restore points and email delivery" />
            {message && (
                <div className={`rounded-xl p-3 text-sm ${message.includes('Failed') ? 'bg-red-500/10 border border-red-500/30 text-red-400' : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'}`}>
                    {message}
                </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Auto Backup</p>
                    <select value={settings.backup_auto_enabled ? 'true' : 'false'}
                        onChange={(e) => handleSettingsUpdate('backup_auto_enabled', e.target.value === 'true')}
                        className="mt-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm w-full">
                        <option value="true">Enabled</option>
                        <option value="false">Disabled</option>
                    </select>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Frequency</p>
                    <select value={settings.backup_frequency || 'daily'}
                        onChange={(e) => handleSettingsUpdate('backup_frequency', e.target.value)}
                        className="mt-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm w-full">
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                    </select>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Email Backup</p>
                    <select value={settings.backup_email_enabled ? 'true' : 'false'}
                        onChange={(e) => handleSettingsUpdate('backup_email_enabled', e.target.value === 'true')}
                        className="mt-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm w-full">
                        <option value="true">Enabled</option>
                        <option value="false">Disabled</option>
                    </select>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Retention</p>
                    <input type="number" value={settings.backup_retention_days || 30}
                        onChange={(e) => handleSettingsUpdate('backup_retention_days', +e.target.value)}
                        className="mt-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm w-full" />
                    <p className="text-xs text-slate-400 mt-1">days</p>
                </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
                <button onClick={handleCreate} disabled={creating}
                    className="rounded-xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white hover:bg-primary-500 disabled:opacity-50">
                    {creating ? 'Creating...' : '🔄 Create Backup Now'}
                </button>
                <button onClick={() => fileInputRef.current?.click()}
                    className="rounded-xl bg-slate-100 dark:bg-slate-800 px-5 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700">
                    📤 Upload & Restore
                </button>
                <input ref={fileInputRef} type="file" accept=".json" onChange={handleUpload} className="hidden" />
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h2 className="text-lg font-semibold mb-4">Backup History ({backups.length})</h2>
                {backups.length === 0 ? (
                    <p className="text-slate-400 text-sm py-8 text-center">No backups yet. Create your first backup.</p>
                ) : (
                    <div className="space-y-2">
                        {backups.map((b) => (
                            <div key={b.filename} className="flex flex-col gap-3 rounded-3xl bg-slate-50 p-4 dark:bg-slate-800/50 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="font-medium text-sm font-mono">{b.filename}</p>
                                    <p className="text-xs text-slate-500 mt-1">{b.size} &middot; {new Date(b.createdAt).toLocaleString()}</p>
                                </div>
                                <div className="flex flex-wrap items-center gap-1">
                                    <button onClick={() => handleDownload(b.filename)}
                                        className="rounded-lg px-3 py-2 text-xs font-medium text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20">Download</button>
                                    <button onClick={() => { setShowEmailInput(b.filename); setEmailTo(settings.backup_email_address || ''); }}
                                        className="rounded-lg px-3 py-2 text-xs font-medium text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20">Email</button>
                                    <button onClick={() => handleRestore(b.filename)}
                                        className="rounded-lg px-3 py-2 text-xs font-medium text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20">Restore</button>
                                    <button onClick={() => handleDelete(b.filename)}
                                        className="rounded-lg px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showEmailInput && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowEmailInput(null)}>
                    <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-semibold mb-4">Send Backup via Email</h3>
                        <input type="email" value={emailTo} onChange={(e) => setEmailTo(e.target.value)}
                            placeholder="Enter email address"
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm mb-4" />
                        <div className="flex gap-2 justify-end">
                            <button onClick={() => setShowEmailInput(null)}
                                className="rounded-xl bg-slate-200 dark:bg-slate-700 px-4 py-2 text-sm font-semibold">Cancel</button>
                            <button onClick={() => handleSendEmail(showEmailInput)}
                                className="rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white">Send</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BackupsPage;