import { createSlice } from '@reduxjs/toolkit';

const userConfigSlice = createSlice({
  name: 'userConfig',
  initialState: {
    apiBaseUrl: `${process.env.REACT_APP_API_URL}/api`,
  },
  reducers: {},
});

export default userConfigSlice.reducer;
