import SectionHeader from '../../../../shared/components/ui/SectionHeader';
import Badge from '../../../../shared/components/ui/Badge';

export default function NotificationsPage() {
  return (
    <div className="space-y-8">
      <SectionHeader title="Notifications" description="Live updates for booking confirmations, ride arrivals, order status, and wallet alerts." />

      <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
        <div className="grid gap-6 md:grid-cols-2">
          {[
            { title: 'Booking confirmed', details: 'Your hotel stay at Hilton Grand Suite is confirmed.', tag: 'Success' },
            { title: 'Ride arriving', details: 'Your airport transfer will arrive in 8 minutes.', tag: 'Live' },
            { title: 'Food delivery', details: 'Street Sushi is preparing your order.', tag: 'Pending' },
            { title: 'Wallet updated', details: 'A $120 refund has been credited to your balance.', tag: 'Info' },
          ].map((notification) => (
            <div key={notification.title} className="rounded-3xl border border-slate-200 p-6 transition hover:shadow-lg">
              <div className="flex items-center justify-between gap-4">
                <h4 className="text-lg font-semibold text-slate-900">{notification.title}</h4>
                <Badge variant={notification.tag === 'Success' ? 'success' : notification.tag === 'Live' ? 'primary' : 'secondary'}>{notification.tag}</Badge>
              </div>
              <p className="mt-3 text-sm text-slate-500">{notification.details}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
