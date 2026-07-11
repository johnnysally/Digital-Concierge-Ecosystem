import React from 'react';
import { Link } from 'react-router-dom';
import SectionHeader from '../../components/customer/ui/SectionHeader';
import BookingCard from '../../components/customer/ui/BookingCard';
import { useBookingContext } from '../../context/customer/BookingContext';
import { cancelBooking } from '../../api/customer/bookingApi';

const BookingOverviewPage = () => {
    const { bookings } = useBookingContext();

    const handleCancel = async (id: string) => {
        if (confirm('Cancel this booking? Refunds are processed within 5-7 business days.')) {
            await cancelBooking(id);
            window.location.reload();
        }
    };

    return (
        <div className="space-y-8">
            <SectionHeader title="Your bookings" subtitle="Manage your stays across the DigitalSafaris network." />

            {bookings.length === 0 ? (
                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-10 text-center">
                    <div className="text-6xl mb-4">📅</div>
                    <h3 className="text-xl font-semibold text-white">No bookings yet</h3>
                    <p className="mt-2 text-sm text-slate-400 max-w-md mx-auto">
                        Start planning your next trip. Browse accommodations, find the perfect stay, and book in minutes.
                    </p>
                    <Link to="/search"
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-500 transition-colors">
                        🔍 Find Accommodation
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6">
                    {bookings.map((booking: any) => (
                        <div key={booking.id || booking._id}>
                            <BookingCard booking={booking} />
                            {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                                <button
                                    onClick={() => handleCancel(booking.id || booking._id)}
                                    className="mt-2 text-xs text-rose-400 hover:text-rose-300 transition-colors"
                                >
                                    Cancel Booking
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BookingOverviewPage;