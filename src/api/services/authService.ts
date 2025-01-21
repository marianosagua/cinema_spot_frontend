import axios from "axios";
import { apiUrl } from "../variables";

export const login = async (email: string, password: string) => {
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
    return true;
  }

  return false;
};
