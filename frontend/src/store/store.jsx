import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { todosCrud } from "./slices/todosCrud";

export const store = configureStore({
  reducer: {
    [todosCrud.reducerPath]: todosCrud.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(todosCrud.middleware),
});

setupListeners(store.dispatch);
