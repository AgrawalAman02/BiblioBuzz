import { createSlice } from '@reduxjs/toolkit';
import { authApi } from '../api/authApi';

// Get user info from local storage if it exists
const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const initialState = {
  userInfo: userInfoFromStorage,
  isAuthenticated: !!userInfoFromStorage,
};

/**
 * Auth slice for managing user authentication state
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.userInfo = null;
      state.isAuthenticated = false;
      localStorage.removeItem('userInfo');
    },
  },
  // Handle login/register API success actions
  extraReducers: (builder) => {
    builder
      .addMatcher(
        authApi.endpoints.login.matchFulfilled,
        (state, { payload }) => {
          state.userInfo = payload;
          state.isAuthenticated = true;
          localStorage.setItem('userInfo', JSON.stringify(payload));
        }
      )
      .addMatcher(
        authApi.endpoints.register.matchFulfilled,
        (state, { payload }) => {
          state.userInfo = payload;
          state.isAuthenticated = true;
          localStorage.setItem('userInfo', JSON.stringify(payload));
        }
      );
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;