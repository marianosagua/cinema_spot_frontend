export interface Reservation {
  id_reservation: string;
  user_data: UserData;
  showtime_data: ShowtimeData;
  seat_data: SeatData;
}

export interface SeatData {
  id: string;
  seat_number: number;
  room: Room;
}

export interface Room {
  id: string;
  name: string;
}

export interface ShowtimeData {
  id: string;
  movie: Movie;
  start_time: Date;
  end_time: Date;
  room: Room;
}

export interface Movie {
  id: number;
  title: string;
  description: string;
  poster: string;
}

export interface UserData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}
