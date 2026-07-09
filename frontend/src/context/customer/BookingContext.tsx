import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Booking } from '../../types/customer';
import { getMyBookings } from '../../api/customer/bookingApi';

interface BookingContextState {
    bookings: Booking[];
    addBooking: (booking: Booking) => void;
    cancelBooking: (bookingId: string) => void;
}

const BookingContext = createContext<BookingContextState | undefined>(undefined);

export const BookingProvider = ({ children }: { children: ReactNode }) => {
    const [bookings, setBookings] = useState<Booking[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem('digitalsafaris_customer');
        if (!stored) return;
        getMyBookings()
            .then((res) => setBookings(res.bookings || []))
            .catch(() => setBookings([]));
    }, []);

    const addBooking = (booking: Booking) => {
        setBookings((current) => [booking, ...current]);
    };

    const cancelBooking = (bookingId: string) => {
        setBookings((current) =>
            current.map((booking) =>
                booking.id === bookingId ? { ...booking, status: 'cancelled' } : booking
            )
        );
    };

    return (
        <BookingContext.Provider value={{ bookings, addBooking, cancelBooking }}>
            {children}
        </BookingContext.Provider>
    );
};

export const useBookingContext = () => {
    const context = useContext(BookingContext);
    if (!context) throw new Error('useBookingContext must be used within BookingProvider');
    return context;
};