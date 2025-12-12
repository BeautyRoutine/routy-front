import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // { [date: 'YYYY-MM-DD']: number[] }
  byDate: {},
};

const routineDraftSlice = createSlice({
  name: 'routineDraft',
  initialState,
  reducers: {
    addDraftProduct: (state, action) => {
      const { date, prdNo } = action.payload || {};
      if (!date || !prdNo) return;

      const current = state.byDate[date] || [];
      if (!current.includes(prdNo)) {
        state.byDate[date] = [...current, prdNo];
      }
    },
    removeDraftProduct: (state, action) => {
      const { date, prdNo } = action.payload || {};
      if (!date || !prdNo) return;

      const current = state.byDate[date] || [];
      state.byDate[date] = current.filter(id => id !== prdNo);
    },
    setDraftProducts: (state, action) => {
      const { date, prdNos } = action.payload || {};
      if (!date) return;

      const next = Array.isArray(prdNos) ? prdNos : [];
      // 중복 제거
      state.byDate[date] = Array.from(new Set(next));
    },
    clearDraftDate: (state, action) => {
      const { date } = action.payload || {};
      if (!date) return;
      delete state.byDate[date];
    },
    clearAllDraft: state => {
      state.byDate = {};
    },
  },
});

export const { addDraftProduct, removeDraftProduct, setDraftProducts, clearDraftDate, clearAllDraft } =
  routineDraftSlice.actions;

export default routineDraftSlice.reducer;
