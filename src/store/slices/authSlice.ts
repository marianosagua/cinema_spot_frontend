import { User } from "@/interfaces";
import { createSlice } from "@reduxjs/toolkit";

export interface AuthState {
  userData: User;
  isLogged: boolean;
  token: string;
}

const initialState = {
  userData: JSON.parse(localStorage.getItem("userData") || "{}") || {},
  isLogged: localStorage.getItem("authToken") ? true : false,
  token: localStorage.getItem("authToken") || "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      const { token, user } = action.payload;
      state.token = token;
      state.userData = user;
      state.isLogged = true;
      localStorage.setItem("authToken", token);
      localStorage.setItem("userData", JSON.stringify(user));
    },
    logout: (state) => {
      state.userData = initialState.userData;
      state.isLogged = initialState.isLogged;
      state.token = initialState.token;
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
    },
  },
});

export const { login, logout } = authSlice.actions;
