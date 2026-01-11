import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../services/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Firebase auth objects aren't serializable
    }),
});

export default store;
