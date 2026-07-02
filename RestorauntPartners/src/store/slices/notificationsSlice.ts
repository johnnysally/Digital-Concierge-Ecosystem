import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotificationItem } from '../../shared/types/restaurant';

interface NotificationsState {
  items: NotificationItem[];
}

const initialState: NotificationsState = {
  items: [],
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications(state, action: PayloadAction<NotificationItem[]>) {
      state.items = action.payload;
    },
    markNotificationRead(state, action: PayloadAction<string>) {
      const notification = state.items.find((item) => item.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
  },
});

export const { setNotifications, markNotificationRead } = notificationsSlice.actions;

export default notificationsSlice.reducer;
