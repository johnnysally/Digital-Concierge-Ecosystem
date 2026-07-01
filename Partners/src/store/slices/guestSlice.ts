import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Guest } from '../../modules/guests/types';

interface GuestState {
  list: Guest[];
  loading: boolean;
}

const initialState: GuestState = {
  list: [],
  loading: false,
};

export const guestSlice = createSlice({
  name: 'guest',
  initialState,
  reducers: {
    setGuests: (state, action: PayloadAction<Guest[]>) => {
      state.list = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setGuests, setLoading } = guestSlice.actions;
export default guestSlice.reducer;
