import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import weatherReducer from "./weatherSlice";
import ExpoFileSystemStorage from "redux-persist-expo-filesystem";

const persistConfig = {
  key: "root",
  storage: ExpoFileSystemStorage,
  blacklist: ["error", "dayError", "loading"],
};

const persistedReducer = persistReducer(persistConfig, weatherReducer);

export const store = configureStore({
  reducer: {
    weather: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
export const persistor = persistStore(store);
