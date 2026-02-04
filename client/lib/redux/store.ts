import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { authSlice } from "./authSlice";

// Combine reducers
const rootReducer = combineReducers({
  authReducer: authSlice.reducer,
});

// Create store
export const store = configureStore({
  reducer: rootReducer,
});

// Typed hooks & types
export const useAppDispatch = () => useDispatch<typeof store.dispatch>();
export type RootState = ReturnType<typeof store.getState>;
