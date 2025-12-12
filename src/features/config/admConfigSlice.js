import { createSlice } from '@reduxjs/toolkit';

const admConfigSlice = createSlice({
  name: 'admConfig',
  initialState: {
    apiBaseUrl: `${process.env.REACT_APP_ADMIN_API_URL}/api/admin`,
  },
  reducers: {},
});

export default admConfigSlice.reducer;
