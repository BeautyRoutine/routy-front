import { configureStore, createSlice } from '@reduxjs/toolkit';

// slice
// 통합
const configSlice = createSlice({
  // 운영 배포시 api base url 변경
  name: 'config',
  initialState: {
    apiBaseUrl: 'http://localhost:8085/api',
  },
  reducers: {},
});
// 주문
const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    rowTotal: 0,
    list: [],
    selectedOrder: null,
    pageGap: 2,
  },
  reducers: {
    setOrdersCount: (state, action) => {
      state.rowTotal = action.payload;
    },
    setOrders: (state, action) => {
      state.list = action.payload;
    },
    selectOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },
    clearSelectedOrder: state => {
      state.selectedOrder = null;
    },
  },
});

// reducer export
export const { setOrdersCount, setOrders, selectOrder, clearSelectedOrder } = ordersSlice.actions;

const store = configureStore({
  reducer: {
    orders: ordersSlice.reducer,
    config: configSlice.reducer,
  },
});

export default store;
