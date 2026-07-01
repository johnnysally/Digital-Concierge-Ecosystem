import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Reservation } from '../../modules/reservations/types';

interface ReservationState {
  list: Reservation[];
  loading: boolean;
}

const initialState: ReservationState = {
  list: [],
  loading: false,
};

export const reservationSlice = createSlice({
  name: 'reservation',
  initialState,
  reducers: {
    setReservations: (state, action: PayloadAction<Reservation[]>) => {
      state.list = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setReservations, setLoading } = reservationSlice.actions;
export default reservationSlice.reducer;
