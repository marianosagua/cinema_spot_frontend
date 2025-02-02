import { addReservation } from "@/store/slices";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  ReservationState,
  resetReservation,
} from "../store/slices/reservationSlice";

export const useReservationStore = () => {
  const { movie, showtime, seats, price, userReservation } = useAppSelector(
    (state) => state.reservation
  );
  const dispatch = useAppDispatch();

  const setAddReservation = (data: ReservationState) => {
    dispatch(addReservation(data));
  };

  const setResetReservation = () => {
    dispatch(resetReservation());
  };

  return {
    setAddReservation,
    setResetReservation,

    movie,
    showtime,
    seats,
    price,
    userReservation,
  };
};
