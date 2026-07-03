import { NavLink, Outlet } from 'react-router-dom';

const settingsNav = [
  { label: 'General', to: 'general-settings' },
  { label: 'Regional', to: 'regional-settings' },
  { label: 'Operational', to: 'operational-settings' },
  { label: 'Dispatch', to: 'dispatch-settings' },
  { label: 'Notifications', to: 'notification-settings' },
  { label: 'Map', to: 'map-settings' },
  { label: 'Integrations', to: 'integration-settings' },
];

function SettingsPage() {
  return (
    <section className="space-y-6">
      <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
        <p className="text-sm uppercase tracking-[0.24em] text-slate-500">System Settings</p>
        <h1 className="mt-4 text-3xl font-semibold text-slate-900">Operations System Configuration</h1>
        <p className="mt-2 text-slate-500">Manage the key operational settings that keep the portal running smoothly across regions, dispatch, notifications, maps, and integrations.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
        <aside className="rounded-[32px] border border-slate-200 bg-slate-50 p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Settings Sections</p>
          <nav className="mt-6 space-y-2">
            {settingsNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `block rounded-3xl px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-700 hover:bg-white hover:text-slate-900'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <div className="space-y-6 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Global system controls</p>
              <p className="mt-2 text-sm text-slate-500">System timezone, language, currency and global operational defaults.</p>
            </div>
            <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Dispatch and routing</p>
              <p className="mt-2 text-sm text-slate-500">Configure assignment rules, auto-dispatch thresholds, and route priorities.</p>
            </div>
            <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Map and tracking</p>
              <p className="mt-2 text-sm text-slate-500">Manage map provider settings, traffic overlays, and geofence behavior.</p>
            </div>
            <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Notifications</p>
              <p className="mt-2 text-sm text-slate-500">Set alert channels, escalation rules, and notification templates.</p>
            </div>
            <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Integrations</p>
              <p className="mt-2 text-sm text-slate-500">Connect payment gateways, CRM, analytics, and partner APIs.</p>
            </div>
            <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Regional operations</p>
              <p className="mt-2 text-sm text-slate-500">Control market-level configurations, service zones, and availability regions.</p>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Current section</p>
            <div className="mt-4 text-sm text-slate-600">
              <p>Select a settings category to edit its details. The current section will appear below with live controls and management workflows.</p>
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <Outlet />
          </div>
        </div>
      </div>
    </section>
  );
}

export default SettingsPage;
