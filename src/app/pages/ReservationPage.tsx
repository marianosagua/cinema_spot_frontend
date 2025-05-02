import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useReservationStore } from "@/hooks/useReservationStore";
import { Button } from "@/components/ui/button";
import { addReservationDB, updateSeat } from "@/api/services";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/hooks/useAuthStore";
import { Loader2 } from "lucide-react";
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
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
};

export const ReservationPage: React.FC = () => {
  const { movie, showtime, seats, price, setResetReservation } =
    useReservationStore();
  const { userData } = useAuthStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      await addReservationDB({
        user_id: userData?.id,
        showtime_id: showtime?.id,
        seat_ids: seats?.map((seat) => seat.id),
      });

      await Promise.all(
        seats?.map((seat) =>
          updateSeat(seat.id, { ...seat, is_available: false })
        ) || []
      );

      toast({
        title: "Reserva Completada",
        description: "Tu reserva ha sido completada exitosamente.",
      });

      setTimeout(() => {
        setResetReservation();
        navigate("/");
      }, 3000);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ha ocurrido un error al completar la reserva.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setResetReservation();
    navigate("/");
  };

  return (
    <motion.div
      className="max-w-2xl mx-auto space-y-8 p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1
        className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500"
        variants={itemVariants}
      >
        Confirmación de Reserva
      </motion.h1>
      <motion.div variants={itemVariants}>
        <Card className="bg-zinc-950 border-zinc-800 text-white">
          <CardHeader>
            <CardTitle className="text-3xl font-semibold">
              Detalles de la Reserva
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="font-bold">
              <span className="text-gray-400">Película:</span> {movie?.title}
            </p>
            <p className="font-bold">
              <span className="text-gray-400">Fecha:</span>{" "}
              {showtime?.start_time}
            </p>
            <p className="font-bold">
              <span className="text-gray-400">Hora:</span>{" "}
              {showtime?.start_time} - {showtime?.end_time}
            </p>
            <p className="font-bold">
              <span className="text-gray-400">Asientos:</span>{" "}
              {seats?.map((seat) => seat.seat_number).join(", ")}
            </p>
            <p className="text-xl font-bold">
              <span className="text-gray-400">Total:</span> ${price}
            </p>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Button
              onClick={handleComplete}
              variant={"secondary"}
              className="w-full sm:w-auto font-semibold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Completar Reserva
            </Button>
            <Button
              onClick={handleCancel}
              variant={"outline"}
              className="w-full sm:w-auto bg-zinc-950 border-zinc-800 hover:bg-zinc-800 hover:text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
              disabled={isLoading}
            >
              Cancelar
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  );
};
