import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type User = {
  id: string;
  email: string;
  name: string;
};
type AuthState = {
  user: User | null;
  loading: boolean;
};

/** Initial state */
const initialState: AuthState = {
  user: null,
  loading: true,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser:(state, action: PayloadAction<User | null>)=>{
      state.user = action.payload;
      state.loading = false;
    },
 logout: (state: AuthState)=>{
      state.user = null;
         state.loading = false;
      localStorage.removeItem("token");
    },
  },
});


/** Actions */
export const { setUser, logout } = authSlice.actions;

export default authSlice.reducer;