import type React from "react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { setAddReservation } = useReservationStore();
  const { isLogged } = useAuthStore();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getShowtime(showtimeId);
        const dataSeats = await getSeatsByRoom(data.room);
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
  }, [showtimeId, toast]);

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

  const handleProceed = async () => {
    try {
      const movieData: Movie = await getMovie(Number(id));
      const showtime: Showtime = await getShowtime(showtimeId);
      const seatsFiltered = seats.filter((seat) =>
        selectedSeats.includes(seat.seat_number)
      );

      setAddReservation({
        movie: movieData,
        showtime: showtime,
        seats: seatsFiltered,
        price: selectedSeats.length * 10,
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
      <motion.div
        className="max-w-4xl mx-auto space-y-12 p-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500"
          variants={itemVariants}
        >
          Selecciona tus Asientos
        </motion.h1>
        <Card className="bg-zinc-950 border-zinc-800">
          <CardContent className="p-8">
            <motion.div
              className="w-full h-4 bg-gradient-to-r from-zinc-800 via-white to-zinc-800 rounded-full mb-12"
              variants={itemVariants}
            />
            <motion.div
              className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-4"
              variants={containerVariants}
            >
              <AnimatePresence>
                {seats.map((seat) => (
                  <motion.button
                    key={seat.id}
                    className={`w-10 h-10 text-white  rounded-lg mx-auto transition-all duration-200 ${
                      !seat.is_available
                        ? "bg-red-500 cursor-not-allowed"
                        : selectedSeats.includes(seat.seat_number)
                        ? "bg-green-500"
                        : "bg-zinc-700 hover:bg-zinc-600"
                    }`}
                    onClick={() =>
                      seat.is_available && toggleSeat(seat.seat_number)
                    }
                    disabled={!seat.is_available}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-sm font-bold">
                      {seat.seat_number}
                    </span>
                  </motion.button>
                ))}
              </AnimatePresence>
            </motion.div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-950 border-zinc-800 text-white">
          <CardContent className="p-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div>
              <p className="text-xl font-semibold mb-2">
                Asientos seleccionados: {selectedSeats.join(", ") || "Ninguno"}
              </p>
              <p className="text-2xl font-bold">
                Total: ${selectedSeats.length * 10}
              </p>
            </div>
            <Button
              variant={"secondary"}
              className="w-full sm:w-auto py-2 px-6 rounded-md shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
              disabled={selectedSeats.length === 0}
              onClick={handleProceed}
            >
              Proceder al Pago
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};
