function NotificationSettingsPage() {
  return (
    <section className="space-y-6">
      <div className="rounded-[32px] bg-slate-50 p-8 shadow-sm ring-1 ring-slate-200/80">
        <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Notification management</p>
        <h1 className="mt-4 text-3xl font-semibold text-slate-900">Notification Settings</h1>
        <p className="mt-2 text-slate-500">Configure alert channels, escalation workflows, and event triggers for operations staff.</p>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">Alert channels</h2>
            <p className="mt-2 text-sm text-slate-600">Email, SMS, push, and in-app channels for operational notifications.</p>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">Escalation policies</h2>
            <p className="mt-2 text-sm text-slate-600">Define escalation steps for incidents, SLA breaches, and high-priority events.</p>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">Notification templates</h2>
            <p className="mt-2 text-sm text-slate-600">Customize message text, subject lines, and recipient grouping rules.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6">
            <h3 className="text-base font-semibold text-slate-900">Incident alerts</h3>
            <p className="mt-2 text-sm text-slate-600">Choose which operational events generate immediate alerts.</p>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-white p-6">
            <h3 className="text-base font-semibold text-slate-900">Staff notifications</h3>
            <p className="mt-2 text-sm text-slate-600">Manage notification preferences for dispatchers, managers, and riders.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default NotificationSettingsPage;
