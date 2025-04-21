export interface Showtime {
  id:         string;
  movie:      string;
  start_time: string;
  end_time:   string;
  room:       Room;
  is_full:    boolean;
}

export enum Room {
  A1 = "A1",
  B1 = "B1",
  C1 = "C1",
}
