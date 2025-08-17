import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./services/authApi";
import { userApi } from "./services/userApi";
import { blogApi } from "./services/blogApi";
import { universityApi } from "./services/universityApi";
import { tagApi } from "./services/tagApi";
import { dashboardApi } from "./services/dashboardApi";
import { uploadApi } from "./services/uploadApi";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [blogApi.reducerPath]: blogApi.reducer,
    [universityApi.reducerPath]: universityApi.reducer,
    [tagApi.reducerPath]: tagApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [uploadApi.reducerPath]: uploadApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      userApi.middleware,
      blogApi.middleware,
      universityApi.middleware,
      tagApi.middleware,
      dashboardApi.middleware,
      uploadApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
