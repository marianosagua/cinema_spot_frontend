import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getMovie, getSeatsByRoom, getShowtime } from "@/api/services";
import { Seat } from "@/interfaces/seat";
import { useReservationStore } from "@/hooks/useReservationStore";
import { Movie, Showtime } from "@/interfaces";

const itemVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
  },
};

export const SeatSelectionPage = () => {
  const { id, showtimeId } = useParams();
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [seats, setseats] = useState<Seat[]>();
  const { setAddReservation } = useReservationStore();

  const toggleSeat = (seatId: number) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((id) => id !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getShowtime(showtimeId);
      const dataSeats = await getSeatsByRoom(data.room);
      setseats(dataSeats);
    };
    fetchData();
  }, []);

  const handleClick = async () => {
    const movieData: Movie = await getMovie(Number(id));
    const showtime: Showtime = await getShowtime(showtimeId);
    const seats: Seat[] = await getSeatsByRoom(showtime.room);
    const seatsFiltered = seats.filter((seat) => {
      return selectedSeats.includes(seat.seat_number);
    });

    const data = {
      movie: movieData,
      showtime: showtime,
      seats: seatsFiltered,
      price: selectedSeats.length * 10,
    };

    setAddReservation(data);
    navigate("/reservation");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <h1 className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
        Select Your Seats
      </h1>
      <Card className="bg-gray-900 border border-zinc-700">
        <CardContent className="p-8">
          <div className="w-full h-4 bg-gradient-to-r from-gray-800 via-white to-gray-800 rounded-full mb-12"></div>
          <div className="grid grid-cols-5 gap-4">
            {seats?.map((seat) => (
              <motion.button
                key={seat.id}
                className={`w-12 h-12 rounded-lg mx-auto transition-all duration-200 ${
                  !seat.is_available
                    ? "bg-red-500 cursor-not-allowed text-white"
                    : selectedSeats.includes(seat.seat_number)
                    ? "bg-white text-black"
                    : "bg-green-700 hover:bg-gray-600 text-white"
                }`}
                onClick={() =>
                  seat.is_available && toggleSeat(seat.seat_number)
                }
                disabled={!seat.is_available}
                variants={itemVariants}
              >
                <span className={`text-lg font-bold`}>{seat.seat_number}</span>
              </motion.button>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gray-900 border border-zinc-700">
        <CardContent className="p-6 flex justify-between items-center">
          <div>
            <p className="text-xl font-semibold mb-2 text-white">
              Selected Seats: {selectedSeats.join(", ") || "None"}
            </p>
            <p className="text-2xl font-bold text-white">
              Total: ${selectedSeats.length * 10}
            </p>
          </div>
          <Button
            className="bg-gray-800 text-white py-2 px-6 rounded-md shadow-md hover:bg-gray-700 transition-all duration-300 ease-in-out"
            disabled={selectedSeats.length === 0}
            onClick={handleClick}
          >
            Proceed to Payment
            <ChevronRight className="ml-2 w-5 h-5" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
