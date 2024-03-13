import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { User } from "../../Interfaces/IUser";
import { fetchCurrentUser, signInUser } from "./accountThunk";
import { redirect } from "react-router-dom";

interface AccountState {
  user: User | null;
}

const initialState: AccountState = {
  user: null,
};

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    signOut: (state) => {
      state.user = null;
      localStorage.removeItem("user");
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(signInUser.fulfilled, fetchCurrentUser.fulfilled),
      (state, action) => {
        state.user = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(signInUser.rejected, fetchCurrentUser.rejected),
      (state, action) => {
        console.log(action.payload);
      }
    );
  },
});

export const { signOut, setUser } = accountSlice.actions;
