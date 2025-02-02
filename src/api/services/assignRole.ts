import axios from "axios";
import { apiUrl } from "../variables";

export const assignRole = async (
  userId: string,
  roleId: string,
  token: string
) => {
  const response = await axios.post(
    `${apiUrl}/api/roles/assign-role`,
    {
      userId,
      newRole: roleId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response;
};
