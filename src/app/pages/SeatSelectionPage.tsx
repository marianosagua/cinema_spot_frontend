import type React from "react";
import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { getMovie, getSeatsByRoom, getShowtime } from "@/api/services";
import type { Seat } from "@/interfaces/seat";
import { useReservationStore } from "@/hooks/useReservationStore";
import type { Movie, Showtime } from "@/interfaces";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useToast } from "@/hooks/use-toast";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
};

export const SeatSelectionPage: React.FC = () => {
  const { id, showtimeId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const functionDate = location.state?.functionDate || null;
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [showtime, setShowtime] = useState<Showtime | null>(null);
  const { setAddReservation } = useReservationStore();
  const { isLogged } = useAuthStore();
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [movieData, showtimeData] = await Promise.all([
          getMovie(id),
          getShowtime(showtimeId),
        ]);

        setMovie(movieData);
        setShowtime(showtimeData);

        const dataSeats = await getSeatsByRoom(showtimeData.room);
        setSeats(dataSeats);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description:
            "Error al cargar datos de asientos. Por favor, inténtalo de nuevo.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, showtimeId, toast]);

  const toggleSeat = (seatId: number) => {
    if (!isLogged) {
      setShowAuthModal(true);
      return;
    }

    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId]
    );
  };

  // Función auxiliar para formatear duración
  const formatDuration = (duration: string) => {
    try {
      const parts = duration.split(":");
      if (parts.length === 3) {
        const hours = parseInt(parts[0]);
        const minutes = parseInt(parts[1]);
        if (hours > 0) {
          return `${hours}h ${minutes}min`;
        } else {
          return `${minutes}min`;
        }
      } else if (parts.length === 2) {
        const minutes = parseInt(parts[0]);
        const seconds = parseInt(parts[1]);
        if (minutes > 0) {
          return `${minutes}min ${seconds}s`;
        } else {
          return `${seconds}s`;
        }
      }
      return duration;
    } catch {
      return duration;
    }
  };

  const handleProceed = async () => {
    try {
      const seatsFiltered = seats.filter((seat) =>
        selectedSeats.includes(seat.seat_number)
      );

      setAddReservation({
        movie: movie!,
        showtime: showtime!,
        seats: seatsFiltered,
        price: selectedSeats.length * 10,
        functionDate,
      });

      navigate("/reservation");
    } catch (error) {
      console.error("Error proceeding to reservation:", error);
      toast({
        title: "Error",
        description:
          "Error al procesar la reserva. Por favor, inténtalo de nuevo.",
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
                  {movie?.duration
                    ? formatDuration(movie.duration)
                    : "Duración no disponible"}
                </span>
                <span className="text-[#E0E0E0] font-['Open_Sans']">
                  {movie?.rating}
                </span>
              </div>
              <p className="text-[#E0E0E0] font-['Open_Sans']">
                Por favor, selecciona los asientos para continuar con tu
                reserva.
              </p>
              {functionDate && (
                <div className="mt-2 text-[#FFD700] font-semibold">
                  Fecha de la función: {functionDate}
                </div>
              )}
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
              <motion.div
                className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <AnimatePresence>
                  {seats.map((seat) => (
                    <motion.button
                      key={seat.id}
                      className={`w-9 h-9 text-center flex items-center justify-center text-sm font-medium rounded-md transition-all duration-200 ${
                        !seat.is_available
                          ? "bg-[#555] text-[#999] cursor-not-allowed"
                          : selectedSeats.includes(seat.seat_number)
                          ? "bg-[#E50914] text-white shadow-lg border-2 border-[#E50914]"
                          : "bg-white text-black hover:bg-[#E0E0E0] hover:shadow-md"
                      }`}
                      onClick={() =>
                        seat.is_available && toggleSeat(seat.seat_number)
                      }
                      disabled={!seat.is_available}
                      variants={itemVariants}
                      whileHover={seat.is_available ? { scale: 1.05 } : {}}
                      whileTap={seat.is_available ? { scale: 0.95 } : {}}
                    >
                      {selectedSeats.includes(seat.seat_number) ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        seat.seat_number
                      )}
                    </motion.button>
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Legend */}
            <div className="flex flex-col md:flex-row justify-center gap-6 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-white rounded-sm border border-gray-300"></div>
                <span className="text-[#E0E0E0] text-sm">Disponible</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-[#555] rounded-sm"></div>
                <span className="text-[#E0E0E0] text-sm">Ocupado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-[#E50914] rounded-sm border-2 border-[#E50914]"></div>
                <span className="text-[#E0E0E0] text-sm">Seleccionado</span>
              </div>
            </div>

            {/* Selected Seats Counter */}
            <div className="mt-6 text-center">
              <p className="text-white font-semibold mb-3">
                {selectedSeats.length > 0
                  ? `Asientos seleccionados: ${selectedSeats.length}`
                  : "No hay asientos seleccionados"}
              </p>
              <div className="flex flex-wrap justify-center gap-2 mb-3">
                {selectedSeats.map((seatNumber) => (
                  <Badge
                    key={seatNumber}
                    variant="outline"
                    className="bg-[#E50914] text-white font-semibold"
                  >
                    {seatNumber}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Summary and Action Section */}
        <Card className="bg-[#1E1E1E]/95 backdrop-blur-sm border-2 border-[#D4AF37]/30 rounded-xl p-8 max-w-3xl mx-auto mb-12 shadow-2xl">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold font-['Oswald'] mb-6 text-white tracking-wide">
              Resumen de la Reserva
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-[#2A2A2A]/50 rounded-lg p-4 border border-[#E0E0E0]/20">
                <h3 className="text-white font-['Montserrat'] font-bold mb-2 text-sm uppercase tracking-wider">
                  Película
                </h3>
                <p className="text-[#E0E0E0] font-['Open_Sans'] font-semibold text-base">
                  {movie?.title}
                </p>
              </div>

              <div className="bg-[#2A2A2A]/50 rounded-lg p-4 border border-[#E0E0E0]/20">
                <h3 className="text-white font-['Montserrat'] font-bold mb-2 text-sm uppercase tracking-wider">
                  Duración
                </h3>
                <p className="text-[#E0E0E0] font-['Open_Sans'] font-semibold text-base">
                  {movie?.duration
                    ? formatDuration(movie.duration)
                    : "No disponible"}
                </p>
              </div>

              <div className="bg-[#2A2A2A]/50 rounded-lg p-4 border border-[#E0E0E0]/20">
                <h3 className="text-white font-['Montserrat'] font-bold mb-2 text-sm uppercase tracking-wider">
                  Asientos
                </h3>
                <p className="text-[#E0E0E0] font-['Open_Sans'] font-semibold text-base">
                  {selectedSeats.length > 0
                    ? selectedSeats.join(", ")
                    : "No hay asientos seleccionados"}
                </p>
              </div>

              <div className="bg-gradient-to-r from-[#D4AF37]/20 to-[#F5D76E]/20 rounded-lg p-4 border-2 border-[#D4AF37]/40">
                <h3 className="text-white font-['Montserrat'] font-bold mb-2 text-sm uppercase tracking-wider">
                  Total
                </h3>
                <p className="text-[#D4AF37] font-['Montserrat'] font-bold text-2xl tracking-wide">
                  ${(selectedSeats.length * 10).toFixed(2)}
                </p>
                <p className="text-[#D4AF37]/70 text-xs mt-1 font-['Open_Sans']">
                  * Precio de ejemplo: $10 por asiento
                </p>
              </div>
            </div>

            <Button
              className="w-full bg-gradient-to-r from-[#E50914] to-[#FF3333] hover:from-[#FF3333] hover:to-[#E50914] text-white font-bold font-['Montserrat'] py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-[#E50914]/50"
              disabled={selectedSeats.length === 0}
              onClick={handleProceed}
            >
              <span className="flex items-center justify-center gap-3">
                Continuar al Pago
                <ChevronRight className="w-6 h-6" />
              </span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
