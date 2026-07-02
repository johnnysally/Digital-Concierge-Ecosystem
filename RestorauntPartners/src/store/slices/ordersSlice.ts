import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Order } from '../../shared/types/restaurant';

interface OrdersState {
  orders: Order[];
  selectedOrderId: string | null;
  statusFilter: string;
}

const initialState: OrdersState = {
  orders: [],
  selectedOrderId: null,
  statusFilter: 'All',
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders(state, action: PayloadAction<Order[]>) {
      state.orders = action.payload;
    },
    setSelectedOrderId(state, action: PayloadAction<string | null>) {
      state.selectedOrderId = action.payload;
    },
    setStatusFilter(state, action: PayloadAction<string>) {
      state.statusFilter = action.payload;
    },
    updateOrderStatus(state, action: PayloadAction<{ id: string; status: string }>) {
      const order = state.orders.find((item) => item.id === action.payload.id);
      if (order) {
        order.status = action.payload.status;
      }
    },
  },
});

export const { setOrders, setSelectedOrderId, setStatusFilter, updateOrderStatus } = ordersSlice.actions;

export default ordersSlice.reducer;
