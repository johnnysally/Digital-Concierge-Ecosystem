import SectionHeader from '../../../../shared/components/ui/SectionHeader';
import Badge from '../../../../shared/components/ui/Badge';

export default function ReviewsPage() {
  return (
    <div className="space-y-8">
      <SectionHeader title="Reviews" description="Review hotels, restaurants, drivers, and your overall travel experience." />

      <div className="space-y-6">
        {[
          { subject: 'Hilton Grand Suite', rating: '5.0', summary: 'Exceptional stay and service.' },
          { subject: 'Street Sushi', rating: '4.8', summary: 'Fresh delivery and great ambiance.' },
          { subject: 'Airport transfer', rating: '4.9', summary: 'Driver was punctual and professional.' },
        ].map((item) => (
          <div key={item.subject} className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">{item.subject}</h3>
                <p className="mt-2 text-sm text-slate-500">{item.summary}</p>
              </div>
              <Badge variant="success">{item.rating}</Badge>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <button className="rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">Edit review</button>
              <button className="rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-300">View responses</button>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-[32px] bg-slate-950 p-8 text-white shadow-xl ring-1 ring-white/10">
        <h3 className="text-lg font-semibold">Review guidance</h3>
        <p className="mt-3 text-sm leading-6 text-slate-300">Your feedback helps improve the experience for every traveler and partner in the Digital Concierge Ecosystem.</p>
      </div>
    </div>
  );
}
