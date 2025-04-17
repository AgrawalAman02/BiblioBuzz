import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from '@/features/auth/authSlice';
import { authApi } from '@/features/api/authApi';
import { bookApi } from '@/features/api/bookApi';
import { reviewApi } from '@/features/api/reviewApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [bookApi.reducerPath]: bookApi.reducer,
    [reviewApi.reducerPath]: reviewApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(bookApi.middleware)
      .concat(reviewApi.middleware),
});

setupListeners(store.dispatch);

export default store;