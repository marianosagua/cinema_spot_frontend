import { useState, useEffect } from "react";
import { Check, ChevronRight, Loader2 } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  getMovie,
  getSeatsByRoom,
  getShowtime,
  getShowtimesByMovie,
} from "@/api/services";
import type { Seat } from "@/interfaces/seat";
import type { Movie, Showtime } from "@/interfaces";
import { useReservationStore } from "@/hooks/useReservationStore";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useToast } from "@/hooks/use-toast";

// Define extended seat type for UI management
interface SeatUI extends Seat {
  isSelected: boolean;
  row: string;
  col: number;
  price: number;
}

// Define rows for the seating chart
const ROWS = ["A", "B", "C", "D", "E", "F", "G", "H"];
const COLS_PER_ROW = 12;

export const SeleccionAsientosPage = () => {
  const { id: movieId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedShowtime, setSelectedShowtime] = useState<string | null>(null);
  const [seats, setSeats] = useState<SeatUI[]>([]);
  const [seatMap, setSeatMap] = useState<
    Record<string, Record<number, SeatUI | null>>
  >({});
  const [selectedSeats, setSelectedSeats] = useState<SeatUI[]>([]);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { setAddReservation } = useReservationStore();
  const { isLogged } = useAuthStore();
  const { toast } = useToast();

  // Fetch movie and showtime data
  useEffect(() => {
    const fetchMovieAndShowtimes = async () => {
      try {
        setLoading(true);
        if (!movieId) return;

        const [movieData, showtimesData] = await Promise.all([
          getMovie(Number(movieId)),
          getShowtimesByMovie(movieId),
        ]);

        setMovie(movieData);
        setShowtimes(showtimesData);

        // Select first showtime by default if available
        if (showtimesData.length > 0 && !selectedShowtime) {
          setSelectedShowtime(showtimesData[0].id);
        }
      } catch (error) {
        console.error("Error fetching movie and showtimes:", error);
        toast({
          title: "Error",
          description:
            "No se pudieron cargar los datos de la película o los horarios.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMovieAndShowtimes();
  }, [movieId, toast]);

  // Fetch seats when showtime changes
  useEffect(() => {
    const fetchSeats = async () => {
      if (!selectedShowtime) return;

      try {
        setLoading(true);
        const showtimeData = await getShowtime(selectedShowtime);
        if (!showtimeData.room) {
          throw new Error("No room information available for this showtime");
        }

        const seatsData = await getSeatsByRoom(showtimeData.room.id);

        // Initialize the seat map with all rows and columns
        const initialSeatMap: Record<
          string,
          Record<number, SeatUI | null>
        > = {};

        ROWS.forEach((row) => {
          initialSeatMap[row] = {};
          // Fill with null for all possible seats
          for (let col = 1; col <= COLS_PER_ROW; col++) {
            initialSeatMap[row][col] = null;
          }
        });

        // Map the seatsData to the seatMap
        const formattedSeats: SeatUI[] = seatsData.map((seat: Seat) => {
          const seatNum = seat.seat_number;
          const rowIndex = Math.floor((seatNum - 1) / COLS_PER_ROW);
          const row = ROWS[rowIndex] || "A"; // Default to "A" if out of range
          const col = ((seatNum - 1) % COLS_PER_ROW) + 1;

          const seatUI: SeatUI = {
            ...seat,
            isSelected: false,
            row,
            col,
            price: row < "D" ? 15 : 12, // Premium seats in front rows
          };

          // Add to the seat map
          if (initialSeatMap[row]) {
            initialSeatMap[row][col] = seatUI;
          }

          return seatUI;
        });

        setSeats(formattedSeats);
        setSeatMap(initialSeatMap);
      } catch (error) {
        console.error("Error fetching seats:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los asientos para este horario.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSeats();
  }, [selectedShowtime, toast]);

  // Handle showtime selection
  const handleShowtimeSelect = (showtimeId: string) => {
    setSelectedShowtime(showtimeId);
    // Reset selected seats when changing showtime
    setSelectedSeats([]);
  };

  // Handle seat selection
  const toggleSeatSelection = (seat: SeatUI | null) => {
    if (!seat) return; // Skip if no seat
    if (!seat.is_available) return; // Skip if not available

    if (!isLogged) {
      setShowAuthModal(true);
      return;
    }

    // Toggle selection in seat map
    const updatedSeats = seats.map((s) => {
      if (s.id === seat.id) {
        return { ...s, isSelected: !s.isSelected };
      }
      return s;
    });

    // Update seat map
    const updatedSeatMap = { ...seatMap };
    if (updatedSeatMap[seat.row] && updatedSeatMap[seat.row][seat.col]) {
      updatedSeatMap[seat.row][seat.col] = {
        ...seat,
        isSelected: !seat.isSelected,
      };
    }

    setSeats(updatedSeats);
    setSeatMap(updatedSeatMap);

    // Update selected seats
    const newSelectedSeats = updatedSeats.filter((s) => s.isSelected);
    setSelectedSeats(newSelectedSeats);
  };

  // Calculate total price
  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  // Handle proceed to checkout
  const handleProceed = async () => {
    if (selectedSeats.length === 0) {
      toast({
        title: "Selección Incompleta",
        description: "Por favor selecciona al menos un asiento para continuar.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (!movie || !selectedShowtime) return;

      setAddReservation({
        movie,
        showtime: showtimes.find((st) => st.id === selectedShowtime),
        seats: selectedSeats,
        price: totalPrice,
      });

      navigate("/reservation");
    } catch (error) {
      console.error("Error proceeding to reservation:", error);
      toast({
        title: "Error",
        description:
          "Ocurrió un error al procesar tu reserva. Por favor intenta de nuevo.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <DialogContent className="bg-zinc-950 border border-zinc-800 shadow-2xl rounded-2xl max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-3xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-white via-red-400 to-red-600">
              ¡Inicia sesión o regístrate!
            </DialogTitle>
          </DialogHeader>
          <div className="text-center text-lg text-zinc-200 py-2">
            Debes iniciar sesión o crear una cuenta para seleccionar tus
            asientos y continuar con la reserva.
          </div>
          <DialogFooter className="flex flex-col gap-3 mt-4">
            <Button
              className="w-full bg-gradient-to-r from-red-600 to-red-400 text-white font-bold py-2 rounded-lg shadow-lg hover:from-red-500 hover:to-red-300 transition-all text-lg border border-red-700"
              onClick={() => {
                setShowAuthModal(false);
                navigate("/autenticacion/inicio-sesion");
              }}
            >
              Iniciar Sesión
            </Button>
            <Button
              variant="secondary"
              className="w-full bg-zinc-800 text-white font-bold py-2 rounded-lg shadow-lg hover:bg-zinc-700 transition-all text-lg border border-zinc-700"
              onClick={() => {
                setShowAuthModal(false);
                navigate("/autenticacion/registro");
              }}
            >
              Registrarse
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="container mx-auto px-4">
        {/* Movie Information Section */}
        <section className="mb-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-32 flex-shrink-0">
              <div className="aspect-[2/3] relative rounded-lg overflow-hidden border-2 border-[#D4AF37]/30">
                {movie?.poster && (
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="object-cover w-full h-full"
                  />
                )}
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold font-['Oswald'] mb-2">
                {movie?.title}
              </h1>
              <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                <Badge className="bg-[#E50914] text-white">
                  {movie?.category}
                </Badge>
                <span className="text-[#E0E0E0] font-['Open_Sans']">
                  {movie?.duration}
                </span>
                <span className="text-[#E0E0E0] font-['Open_Sans']">
                  {movie?.rating}
                </span>
              </div>
              <p className="text-[#E0E0E0] font-['Open_Sans']">
                Por favor, selecciona el horario y los asientos para continuar
                con tu reserva.
              </p>
            </div>
          </div>
        </section>

        {/* Showtime Selection Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold font-['Oswald'] mb-6">
            Selecciona el horario
          </h2>

          <div className="overflow-x-auto pb-4">
            <div className="flex gap-3 min-w-max">
              {showtimes.map((showtime) => (
                <Button
                  key={showtime.id}
                  variant={
                    selectedShowtime === showtime.id ? "default" : "outline"
                  }
                  className={
                    selectedShowtime === showtime.id
                      ? "bg-[#E50914] text-white"
                      : "border-[#E0E0E0] text-[#E0E0E0] hover:border-[#00BFFF] hover:text-[#00BFFF]"
                  }
                  onClick={() => handleShowtimeSelect(showtime.id)}
                >
                  {showtime.start_time} {showtime.end_time}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Seating Map Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold font-['Oswald'] mb-6">
            Elige tus asientos
          </h2>

          <div className="flex flex-col items-center mb-8 max-w-5xl mx-auto">
            {/* Screen */}
            <div className="w-full max-w-4xl h-10 bg-[#D4AF37]/20 border-2 border-[#D4AF37] rounded-full mb-12 flex items-center justify-center">
              <span className="text-[#D4AF37] font-bold text-sm uppercase">
                PANTALLA
              </span>
            </div>

            {/* Seating Map */}
            <div className="w-full max-w-4xl overflow-auto pb-8">
              <div className="grid gap-y-3 justify-center">
                {ROWS.map((row) => (
                  <div key={row} className="flex items-center justify-center">
                    <div className="w-7 text-center font-bold text-white mr-3">
                      {row}
                    </div>
                    <div className="flex gap-2 justify-center">
                      {Array.from(
                        { length: COLS_PER_ROW },
                        (_, i) => i + 1
                      ).map((col) => {
                        const seat = seatMap[row]?.[col];
                        // Determinar el estado del asiento
                        const isAvailable = seat ? seat.is_available : true;
                        const isSelected = seat?.isSelected ?? false;
                        const isOccupied = seat && !isAvailable;

                        return (
                          <button
                            key={`${row}${col}`}
                            disabled={isOccupied}
                            onClick={() => toggleSeatSelection(seat)}
                            className={`
                              w-9 h-9 text-center flex items-center justify-center text-sm font-medium rounded-md transition-all
                              ${
                                isSelected
                                  ? "bg-[#E50914] text-white"
                                  : isOccupied
                                  ? "bg-[#555] text-[#999] cursor-not-allowed"
                                  : "bg-white text-black hover:bg-[#E0E0E0]"
                              }
                            `}
                            aria-label={`Asiento ${row}${col}`}
                          >
                            {isSelected ? <Check className="h-4 w-4" /> : col}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-10 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-white rounded-sm"></div>
                <span className="text-[#E0E0E0] text-sm">Disponible</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-[#555] rounded-sm"></div>
                <span className="text-[#E0E0E0] text-sm">Ocupado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-[#E50914] rounded-sm"></div>
                <span className="text-[#E0E0E0] text-sm">Seleccionado</span>
              </div>
            </div>

            {/* Selected Seats Counter */}
            <div className="mt-6 text-center">
              <p className="text-white">
                {selectedSeats.length > 0
                  ? `Asientos seleccionados: ${selectedSeats.length}`
                  : "No hay asientos seleccionados"}
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                {selectedSeats.map((seat) => (
                  <Badge
                    key={seat.id}
                    variant="outline"
                    className="bg-[#E50914] text-white"
                  >
                    {seat.row}
                    {seat.col}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Summary and Action Section */}
        <Card className="bg-[#1E1E1E] rounded-lg p-6 max-w-3xl mx-auto mb-12">
          <CardContent className="p-4">
            <h2 className="text-xl font-bold font-['Oswald'] mb-4">
              Resumen de la Reserva
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-white font-['Montserrat'] font-semibold mb-1">
                  Película
                </h3>
                <p className="text-[#E0E0E0] font-['Open_Sans']">
                  {movie?.title}
                </p>
              </div>

              <div>
                <h3 className="text-white font-['Montserrat'] font-semibold mb-1">
                  Horario
                </h3>
                <p className="text-[#E0E0E0] font-['Open_Sans']">
                  {selectedShowtime
                    ? showtimes.find((st) => st.id === selectedShowtime)
                        ?.start_time
                    : "No seleccionado"}
                </p>
              </div>

              <div>
                <h3 className="text-white font-['Montserrat'] font-semibold mb-1">
                  Asientos
                </h3>
                <p className="text-[#E0E0E0] font-['Open_Sans']">
                  {selectedSeats.length > 0
                    ? selectedSeats
                        .map((seat) => `${seat.row}${seat.col}`)
                        .join(", ")
                    : "No hay asientos seleccionados"}
                </p>
              </div>

              <div>
                <h3 className="text-white font-['Montserrat'] font-semibold mb-1">
                  Total
                </h3>
                <p className="text-[#D4AF37] font-['Montserrat'] font-bold text-lg">
                  ${totalPrice.toFixed(2)}
                </p>
              </div>
            </div>

            <Button
              className="w-full bg-[#E50914] hover:bg-[#FF3333] text-white flex items-center justify-center"
              disabled={selectedSeats.length === 0}
              onClick={handleProceed}
            >
              Continuar al Pago
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
