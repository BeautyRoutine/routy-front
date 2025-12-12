import { createSlice } from '@reduxjs/toolkit';

const admConfigSlice = createSlice({
  name: 'admConfig',
  initialState: {
    apiBaseUrl: 'http://localhost:8085/api/admin',
  },
  reducers: {},
});

export default admConfigSlice.reducer;
