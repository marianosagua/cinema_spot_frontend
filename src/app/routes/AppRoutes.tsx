import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "../layout/AppLayout";
import { AuthRoutes } from "../auth/routes/AuthRoutes";
import {
  HomePage,
  MovieDetailsPage,
  SeatSelectionPage,
  ProfilePage,
} from "../pages";
import { useAuthStore } from "@/hooks/useAuthStore";

export const AppRoutes = () => {
  const { isLogged } = useAuthStore();

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
