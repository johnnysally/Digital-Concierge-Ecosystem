import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Order, Profile, Settings } from '../../shared/types/restaurant';

interface RestaurantState {
  selectedOrderId: string | null;
  profile: Profile | null;
  settings: Settings | null;
  activeStatusFilter: string;
}

const initialState: RestaurantState = {
  selectedOrderId: null,
  profile: null,
  settings: null,
  activeStatusFilter: 'All',
};

const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState,
  reducers: {
    setSelectedOrderId(state, action: PayloadAction<string | null>) {
      state.selectedOrderId = action.payload;
    },
    setRestaurantProfile(state, action: PayloadAction<Profile>) {
      state.profile = action.payload;
    },
    setRestaurantSettings(state, action: PayloadAction<Settings>) {
      state.settings = action.payload;
    },
    setActiveStatusFilter(state, action: PayloadAction<string>) {
      state.activeStatusFilter = action.payload;
    },
  },
});

export const { setSelectedOrderId, setRestaurantProfile, setRestaurantSettings, setActiveStatusFilter } = restaurantSlice.actions;

export default restaurantSlice.reducer;
