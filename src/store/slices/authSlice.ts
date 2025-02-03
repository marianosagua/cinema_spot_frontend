import { createSlice } from "@reduxjs/toolkit";
import { User } from "../../interfaces/user";

export interface AuthState {
  userData: User;
  isLogged: boolean;
  token: string;
}

const defaultUser = {
  id: "",
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  role: "",
  created_at: "",
  updated_at: "",
  email_validated: false,
};

const initialState: AuthState = {
  userData: localStorage.getItem("userData")
    ? JSON.parse(localStorage.getItem("userData")!)
    : defaultUser,
  isLogged: !!localStorage.getItem("authToken"),
  token: localStorage.getItem("authToken") || "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      console.log(action.payload);
      const { token, user } = action.payload;
      state.token = token;
      state.userData = user;
      state.isLogged = true;
    },
    logout: (state) => {
      state.userData = {
        id: "",
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        role: "",
        created_at: "",
        updated_at: "",
        email_validated: false,
      };
      state.isLogged = false;
      state.token = "";
    },
    updateUserData: (state, action) => {
      state.userData = action.payload;
    },
  },
});

export const { login, logout, updateUserData } = authSlice.actions;
