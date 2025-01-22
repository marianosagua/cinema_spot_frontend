import { User } from "@/interfaces";
import { createSlice } from "@reduxjs/toolkit";

export interface AuthState {
  userData: User;
  isLogged: boolean;
  token: string;
}

const initialState: AuthState = {
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
  },
});

export const { login, logout } = authSlice.actions;
