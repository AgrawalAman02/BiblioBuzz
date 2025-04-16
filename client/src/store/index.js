import { configureStore } from '@reduxjs/toolkit';

// Create a simple store with no reducers yet
// We'll add reducers incrementally as we build features
export const store = configureStore({
  reducer: {
    // We'll add reducers here as we need them
  },
  devTools: true,
});