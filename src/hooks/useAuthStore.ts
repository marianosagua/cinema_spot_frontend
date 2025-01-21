import { useAppSelector } from "@/store/store";
import { apiUrl } from "@/api/variables";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login, logout } from "@/store/slices";
import { useNavigate } from "react-router-dom";
import { FormRegisterInput } from "@/app/auth/pages";

export const useAuthStore = () => {
  const { userData, isLogged, token } = useAppSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const setLoginUser = async (
    email: string,
    password: string
  ): Promise<void> => {
    const { data, status } = await axios.post(
      `${apiUrl}/api/auth/login`,
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

    if (status === 200) {
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userData", JSON.stringify(data.user));
      dispatch(login(data));
      navigate("/");
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
  ): Promise<void> => {
    const { status, data } = await axios.post(
      `${apiUrl}/api/auth/register`,
      dataUser,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (status === 200) {
      dispatch(login(data));
      navigate("/");
    }
  };

  return {
    setLoginUser,
    setLogoutUser,
    setRegisterUser,

    userData,
    isLogged,
    token,
  };
};
