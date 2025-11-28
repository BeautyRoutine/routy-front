import { createSlice } from '@reduxjs/toolkit';

const userConfigSlice = createSlice({
  name: 'userConfig',
  initialState: {
    apiBaseUrl: 'http://localhost:8080/api',
  },
  reducers: {},
});

export default userConfigSlice.reducer;
