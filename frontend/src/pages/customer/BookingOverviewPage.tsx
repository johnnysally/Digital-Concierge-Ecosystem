import React, { useEffect, useState } from "react";
import SectionHeader from "../../components/customer/ui/SectionHeader";
import BookingCard from "../../components/customer/ui/BookingCard";
import SkeletonLoader from "../../components/customer/ui/SkeletonLoader";
import { useBookingContext } from "../../context/customer/BookingContext";

const BookingOverviewPage = () => {
  const { bookings } = useBookingContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 500);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-8">
      <SectionHeader title="Your bookings" subtitle="Manage your stays across the DigitalSafaris network." />
      {loading ? (
        <div className="grid gap-6">
          <SkeletonLoader className="h-28 w-full" />
          <SkeletonLoader className="h-28 w-full" />
        </div>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingOverviewPage;
