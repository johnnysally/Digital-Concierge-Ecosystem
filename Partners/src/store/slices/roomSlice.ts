import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Room } from '../../modules/rooms/types';

interface RoomState {
  list: Room[];
  loading: boolean;
}

const initialState: RoomState = {
  list: [],
  loading: false,
};

export const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    setRooms: (state, action: PayloadAction<Room[]>) => {
      state.list = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setRooms, setLoading } = roomSlice.actions;
export default roomSlice.reducer;
