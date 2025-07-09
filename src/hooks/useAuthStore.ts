import { useAppDispatch, useAppSelector } from "@/store/store";
import { apiUrl } from "@/api/variables";
import axios, { AxiosError } from "axios";
import { login, logout, updateUserData } from "@/store/slices";
import { useNavigate } from "react-router-dom";
import { FormRegisterInput } from "@/app/auth/pages";
import { User } from "@/interfaces";

export const useAuthStore = () => {
  const { userData, isLogged, token } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const setLoginUser = async (
    email: string,
    password: string
  ): Promise<string | void> => {
    try {
      const { data } = await axios.post(
        `${apiUrl}/api/auth/iniciar-sesion`,
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userData", JSON.stringify(data.user));
      dispatch(login(data));
      navigate("/");
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage =
        (axiosError.response?.data as { error?: string })?.error ||
        "Unexpected error occurred";

      return errorMessage;
    }
  };

  const setLogoutUser = (): void => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    dispatch(logout());
    navigate("/");
  };

  const setRegisterUser = async (
    dataUser: FormRegisterInput
  ): Promise<string | void> => {
    try {
      const { data } = await axios.post(
        `${apiUrl}/api/auth/registro`,
        dataUser,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userData", JSON.stringify(data.user));
      dispatch(login(data));
      navigate("/");
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage =
        (axiosError.response?.data as { error?: string })?.error ||
        "Unexpected error occurred";

      return errorMessage;
    }
  };

  const setUpdateUserData = async (dataUser: User): Promise<void> => {
    localStorage.setItem("userData", JSON.stringify(dataUser));
    dispatch(updateUserData(dataUser));
  };

  return {
    setLoginUser,
    setLogoutUser,
    setRegisterUser,
    setUpdateUserData,

    userData,
    isLogged,
    token,
  };
};
