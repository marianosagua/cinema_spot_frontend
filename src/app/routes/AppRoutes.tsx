import { Navigate, Route, Routes } from "react-router-dom";
import { HomePage, MovieDetailsPage, SeatSelectionPage } from "../pages";
import { AppLayout } from "../layout/AppLayout";
import { useEffect, useState } from "react";
import { AuthRoutes } from "./AuthRoutes";
import { ProfilePage } from "../pages/ProfilePage";

export const AppRoutes = () => {
  const [isLogged, setisLogged] = useState<boolean>();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const isLoggedIn = !!token;
    if (isLoggedIn) {
      setisLogged(true);
    } else {
      setisLogged(false);
    }
  }, []);

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movies/:id" element={<MovieDetailsPage />} />
        <Route
          path="/movies/:id/seats/:showtimeId"
          element={<SeatSelectionPage />}
        />
        {isLogged ? (
          <Route path="/profile" element={<ProfilePage />} />
        ) : (
          <Route path="/auth/*" element={<AuthRoutes />} />
        )}

        <Route path="*" element={<Navigate to={"/"} />} />
      </Routes>
    </AppLayout>
  );
};
