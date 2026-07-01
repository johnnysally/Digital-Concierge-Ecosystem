import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Property } from '../../modules/property/types';

interface PropertyState {
  list: Property[];
  current: Property | null;
  loading: boolean;
}

const initialState: PropertyState = {
  list: [],
  current: null,
  loading: false,
};

export const propertySlice = createSlice({
  name: 'property',
  initialState,
  reducers: {
    setProperties: (state, action: PayloadAction<Property[]>) => {
      state.list = action.payload;
    },
    setCurrentProperty: (state, action: PayloadAction<Property>) => {
      state.current = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setProperties, setCurrentProperty, setLoading } = propertySlice.actions;
export default propertySlice.reducer;
