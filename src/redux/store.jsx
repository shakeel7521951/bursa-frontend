import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "./slices/UserApi";
import userReducer from "./slices/UserSlice";
import { serviceApi } from "./slices/ServiceApi";
import { OrderApi } from "./slices/OrderSlices";
import { BlogApi } from "./slices/BlogSlice";

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    user: userReducer,
    [serviceApi.reducerPath]: serviceApi.reducer,
    [OrderApi.reducerPath]:OrderApi.reducer,
    [BlogApi.reducerPath]:BlogApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApi.middleware, serviceApi.middleware,OrderApi.middleware,BlogApi.middleware),
  devTools: process.env.NODE_ENV !== "production",
});
