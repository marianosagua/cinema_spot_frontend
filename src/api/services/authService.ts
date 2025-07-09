import { api } from "../../lib/axios";
import { AxiosError } from "axios";

interface ForgotPasswordRequest {
  email: string;
}

interface ForgotPasswordResponse {
  message: string;
}

export const forgotPassword = async (
  data: ForgotPasswordRequest
): Promise<ForgotPasswordResponse> => {
  try {
    const response = await api.post<ForgotPasswordResponse>(
      "/api/auth/olvide-password",
      data
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(
        error.response.data.message ||
          "Error al solicitar el restablecimiento de contraseña"
      );
    }
    throw new Error(
      "Error de conexión al solicitar el restablecimiento de contraseña"
    );
  }
};
