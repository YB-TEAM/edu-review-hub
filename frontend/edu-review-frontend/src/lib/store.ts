import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./services/authApi";
import { institutionApi } from "./services/institutionApi";
import { blogApi } from "./services/blogApi";

// Auth slice for managing authentication state
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    // Auth state
    auth: authReducer,

    // API slices (only the new ones using createApi)
    [authApi.reducerPath]: authApi.reducer,
    [institutionApi.reducerPath]: institutionApi.reducer,
    [blogApi.reducerPath]: blogApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(
      authApi.middleware,
      institutionApi.middleware,
      blogApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
