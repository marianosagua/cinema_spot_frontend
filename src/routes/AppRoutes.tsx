import { Navigate, Route, Routes } from "react-router-dom";
import { HomePage, MovieDetailsPage, SeatSelectionPage } from "../app/pages";
import { AppLayout } from "../app/layout/AppLayout";
import { ProfilePage } from "../app/pages/ProfilePage";
import { AuthRoutes } from "../app/auth/routes/AuthRoutes";
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
