import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "../app/layout/AppLayout";
import { AuthRoutes } from "../app/auth/routes/AuthRoutes";
import { useAuthStore } from "@/hooks/useAuthStore";
import {
  HomePage,
  MovieDetailsPage,
  ProfilePage,
  ReservationPage,
  SeatSelectionPage,
} from "@/app/pages";

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
          <>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/reservation" element={<ReservationPage />} />
          </>
        ) : (
          <Route path="/auth/*" element={<AuthRoutes />} />
        )}

        <Route path="*" element={<Navigate to={"/"} />} />
      </Routes>
    </AppLayout>
  );
};
