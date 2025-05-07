import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage, RegisterPage, ResetPasswordPage } from "../pages";

export const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="/inicio-sesion" element={<LoginPage />} />
      <Route path="/registro" element={<RegisterPage />} />
      <Route path="/restablecer-contraseña" element={<ResetPasswordPage />} />

      <Route path="/*" element={<Navigate to={"/"} />} />
    </Routes>
  );
};
