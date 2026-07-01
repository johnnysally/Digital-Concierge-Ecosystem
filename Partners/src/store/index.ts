import { configureStore } from '@reduxjs/toolkit';
import propertyReducer from './slices/propertySlice';
import roomReducer from './slices/roomSlice';
import reservationReducer from './slices/reservationSlice';
import guestReducer from './slices/guestSlice';

const store = configureStore({
  reducer: {
    property: propertyReducer,
    room: roomReducer,
    reservation: reservationReducer,
    guest: guestReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
