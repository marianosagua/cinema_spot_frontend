import { addReservation } from "@/store/slices";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { ReservationState } from "../store/slices/reservationSlice";

export const useReservationStore = () => {
  const { movie, showtime, seats, price, userReservation } = useAppSelector(
    (state) => state.reservation
  );
  const dispatch = useAppDispatch();

  const setAddReservation = (data: ReservationState) => {
    dispatch(addReservation(data));
  };

  return {
    setAddReservation,

    movie,
    showtime,
    seats,
    price,
    userReservation,
  };
};
