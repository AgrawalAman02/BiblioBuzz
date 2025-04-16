import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { bookApi } from '../features/api/bookApi';
import { reviewApi } from '../features/api/reviewApi';
import { authApi } from '../features/api/authApi';
import authReducer from '../features/auth/authSlice';

/**
 * Configure Redux store with API slices and reducers
 */
export const store = configureStore({
  reducer: {
    // API reducers
    [bookApi.reducerPath]: bookApi.reducer,
    [reviewApi.reducerPath]: reviewApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    
    // Feature reducers
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      bookApi.middleware,
      reviewApi.middleware,
      authApi.middleware
    ),
});

// Enable refetchOnFocus and refetchOnReconnect
setupListeners(store.dispatch);

export default store;