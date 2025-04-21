export interface Movie {
  id:          number;
  title:       string;
  description: string;
  poster:      string;
  category:    string;
  duration:    string;
  banner:      string;
  synopsis:    string;
  trailer:     string;
  director:    string;
  rating:      Rating;
  review:      string;
  showtimes:   Showtime[];
}

export enum Rating {
  G = "G", // Added G
  PG = "PG", // Added PG
  PG13 = "PG-13",
  R = "R",
}

export interface Showtime {
  id:         string;
  start_time: string; // Changed from Date to string
  end_time:   string; // Changed from Date to string
  room:       Room;
  is_full:    boolean;
}

export interface Room {
  id:   string;
  name: Name;
}

export enum Name {
  A1 = "A1",
  B1 = "B1",
  C1 = "C1",
}
