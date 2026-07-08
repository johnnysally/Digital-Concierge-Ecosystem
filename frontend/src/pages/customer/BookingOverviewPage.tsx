import React from "react";
import SectionHeader from "../../components/customer/ui/SectionHeader";
import BookingCard from "../../components/customer/ui/BookingCard";
import { useBookingContext } from "../../context/customer/BookingContext";

const BookingOverviewPage = () => {
  const { bookings } = useBookingContext();

  return (
    <div className="space-y-8">
      <SectionHeader title="Your bookings" subtitle="Manage your stays across the DigitalSafaris network." />
      <div className="grid gap-6">
        {bookings.map((booking) => (
          <BookingCard key={booking.id} booking={booking} />
        ))}
      </div>
    </div>
  );
};

export default BookingOverviewPage;
