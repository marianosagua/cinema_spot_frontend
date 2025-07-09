import { Movie, Seat, Showtime } from "@/interfaces";
import { Rating, Name } from "@/interfaces/movie";
import { createSlice } from "@reduxjs/toolkit";

export interface ReservationState {
  movie?: Movie;
  showtime?: Showtime;
  seats?: Seat[];
  price?: number;
  functionDate?: string;
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
  functionDate: sessionStorage.getItem("functionDate") || undefined,
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
      state.functionDate = action.payload.functionDate;

      sessionStorage.setItem("movie", JSON.stringify(action.payload.movie));
      sessionStorage.setItem(
        "showtime",
        JSON.stringify(action.payload.showtime)
      );
      sessionStorage.setItem("seats", JSON.stringify(action.payload.seats));
      sessionStorage.setItem("price", String(action.payload.price));
      if (action.payload.functionDate) {
        sessionStorage.setItem("functionDate", action.payload.functionDate);
      } else {
        sessionStorage.removeItem("functionDate");
      }
    },
    resetReservation: (state) => {
      sessionStorage.removeItem("movie");
      sessionStorage.removeItem("showtime");
      sessionStorage.removeItem("seats");
      sessionStorage.removeItem("price");
      sessionStorage.removeItem("functionDate");

      state.movie = {
        id: 0,
        title: "",
        poster: "",
        category: "",
        description: "",
        duration: "",
        banner: "",
        synopsis: "",
        trailer: "",
        rating: Rating.G,
        director: "",
        review: "",
        showtimes: [],
      };
      state.showtime = {
        id: "",
        start_time: "",
        end_time: "",
        room: { id: "", name: Name.A1 },
        is_full: false,
      };
      state.seats = [];
      state.price = 0;
      state.functionDate = undefined;
    },
  },
});

export const { addReservation, resetReservation } = reservationSlice.actions;
