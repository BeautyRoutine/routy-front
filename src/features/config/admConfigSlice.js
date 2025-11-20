import { createSlice } from '@reduxjs/toolkit';

const admConfigSlice = createSlice({
  name: 'admConfig',
  initialState: {
    apiBaseUrl: 'http://localhost:8085/api',
  },
  reducers: {},
});

export default admConfigSlice.reducer;
