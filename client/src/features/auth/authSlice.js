import { createSlice } from '@reduxjs/toolkit';

// Initial state is empty since we'll rely on server verification
const initialState = {
  userInfo: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      state.isAuthenticated = true;
      // No longer storing tokens in localStorage or JavaScript cookies
      // We'll rely on HTTP-only cookies set by the server
    },
    logout: (state) => {
      state.userInfo = null;
      state.isAuthenticated = false;
      // No longer clearing tokens from localStorage or JavaScript cookies
      // The server will handle clearing the HTTP-only cookie
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;