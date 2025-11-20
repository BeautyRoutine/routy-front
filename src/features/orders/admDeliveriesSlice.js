import { createSlice } from '@reduxjs/toolkit';

const admDeliveriesSlice = createSlice({
  name: 'admDeliveries',
  initialState: {
    rowTotal: 0,
    list: [],
    selectedItem: null,
    pageGap: 3,
  },
  reducers: {
    setItemsCount: (state, action) => {
      state.rowTotal = action.payload;
    },
    setItems: (state, action) => {
      state.list = action.payload;
    },
    selectItem: (state, action) => {
      state.selectedItem = action.payload;
    },
    clearSelectedItem: state => {
      state.selectedItem = null;
    },
  },
});
export const { setItemsCount, setItems, selectItem, clearSelectedItem } = admDeliveriesSlice.actions;

export default admDeliveriesSlice.reducer;
