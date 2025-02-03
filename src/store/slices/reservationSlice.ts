import { Movie, Seat, Showtime } from "@/interfaces";
import { createSlice } from "@reduxjs/toolkit";

export interface ReservationState {
  movie?: Movie;
  showtime?: Showtime;
  seats?: Seat[];
  price?: number;
}

const getSessionItem = (key: string) => {
  const item = sessionStorage.getItem(key);
  return item ? JSON.parse(item) : null;
};

const initialState: ReservationState = {
  movie: getSessionItem("movie"),
  showtime: getSessionItem("showtime"),
  seats: getSessionItem("seats") || [],
  price: sessionStorage.getItem("price")
    ? parseFloat(sessionStorage.getItem("price")!)
    : 0,
};

export const reservationSlice = createSlice({
  name: "reservation",
  initialState,
  reducers: {
    addReservation: (state, action) => {
      state.movie = action.payload.movie;
      state.showtime = action.payload.showtime;
      state.seats = action.payload.seats;
      state.price = action.payload.price;

      sessionStorage.setItem("movie", JSON.stringify(action.payload.movie));
      sessionStorage.setItem(
        "showtime",
        JSON.stringify(action.payload.showtime)
      );
      sessionStorage.setItem("seats", JSON.stringify(action.payload.seats));
      sessionStorage.setItem("price", String(action.payload.price));
    },
    resetReservation: (state) => {
      sessionStorage.removeItem("movie");
      sessionStorage.removeItem("showtime");
      sessionStorage.removeItem("seats");
      sessionStorage.removeItem("price");

      state.movie = {
        id: 0,
        title: "",
        poster: "",
        category: "",
        description: "",
      };
      state.showtime = {
        id: "",
        movie: "",
        start_time: "",
        end_time: "",
        room: "",
        is_full: false,
      };
      state.seats = [];
      state.price = 0;
    },
  },
});

export const { addReservation, resetReservation } = reservationSlice.actions;
