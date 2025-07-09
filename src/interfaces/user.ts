export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  created_at: Date;
  updated_at: Date;
  email_validated: boolean;
}

export interface UserProfile extends User {
  reservations?: Reservation[];
}

export interface Reservation {
  id: string;
  movieTitle: string;
  showtime: string;
  seats: string[];
  totalAmount: number;
  status: string;
}
