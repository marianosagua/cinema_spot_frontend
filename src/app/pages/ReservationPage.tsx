import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion"; // motion ya no se usa
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useReservationStore } from "@/hooks/useReservationStore";
import { Button } from "@/components/ui/button";
import { addReservationDB, updateSeat } from "@/api/services";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/hooks/useAuthStore";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formatDuration = (duration: string) => {
  try {
    const parts = duration.split(":");
    if (parts.length === 3) {
      const hours = parseInt(parts[0]);
      const minutes = parseInt(parts[1]);
      if (hours > 0) {
        return `${hours}h ${minutes}m`;
      } else {
        return `${minutes}m`;
      }
    }
    return duration;
  } catch {
    return duration;
  }
};

// Función para formatear fecha DD/MM/YYYY
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// Función para formatear hora HH:MM desde 'HH:MM:SS' o 'HH:MM'
const formatTime = (timeStr: string) => {
  if (!timeStr) return "-";
  // Si viene en formato HH:MM:SS o HH:MM
  const parts = timeStr.split(":");
  if (parts.length >= 2) {
    return `${parts[0].padStart(2, "0")}:${parts[1].padStart(2, "0")}`;
  }
  return timeStr;
};

export const ReservationPage: React.FC = () => {
  const { movie, showtime, seats, price, setResetReservation, functionDate } =
    useReservationStore();
  const { userData } = useAuthStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [cardData, setCardData] = useState({
    name: "",
    number: "",
    expiry: "",
    cvv: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    console.log(showtime);
  }, []);

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      if (!userData?.id || !showtime?.id || !seats) {
        throw new Error("Datos incompletos para la reserva");
      }
      await addReservationDB({
        user_id: userData.id,
        showtime_id: showtime.id,
        seat_ids: seats.map((seat) => seat.id),
      });

      await Promise.all(
        seats.map((seat) =>
          updateSeat(seat.id, { ...seat, is_available: false })
        )
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

  // Eliminar bookingFee y PayPal
  // const bookingFee = 3.5;
  const ticketPrice = price;
  const total = Number(ticketPrice).toFixed(2);

  return (
    <div className="min-h-screen bg-[#111] flex flex-col items-center justify-start pt-6 pb-8 px-2 sm:px-4">
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-10 font-['Oswald'] text-white">
        Completa tu compra
      </h1>
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-6 md:gap-8 mx-auto justify-center items-stretch md:items-start">
        {/* Resumen de Reserva */}
        <Card className="flex-1 bg-[#181818] border-none shadow-xl rounded-xl p-0">
          <CardHeader className="border-b border-[#222] pb-4">
            <CardTitle className="text-2xl font-bold font-['Oswald'] text-white">
              Resumen de Reserva
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 pb-2 px-6">
            <div className="flex gap-4 items-center mb-6">
              <div className="w-20 h-28 bg-[#222] rounded-lg flex items-center justify-center overflow-hidden">
                {movie?.poster ? (
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="text-gray-500 text-xs">Sin imagen</span>
                )}
              </div>
              <div>
                <div className="text-lg font-bold text-white font-['Oswald'] leading-tight">
                  {movie?.title}
                </div>
                <div className="text-gray-300 text-sm font-semibold mt-1">
                  {movie?.duration ? formatDuration(movie.duration) : ""}
                </div>
                {functionDate && (
                  <div className="text-[#FFD700] text-sm font-semibold mt-1">
                    Fecha de la función: {formatDate(functionDate)}
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2 text-white text-base font-['Open_Sans']">
              <div className="flex justify-between">
                <span className="text-gray-300">Fecha:</span>
                <span>
                  {functionDate ? formatDate(functionDate) : (showtime?.start_time ? formatDate(showtime.start_time) : "-")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Hora:</span>
                <span>{formatTime(showtime?.start_time || "")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Asientos:</span>
                <span>{seats?.map((seat) => seat.seat_number).join(", ")}</span>
              </div>
              <hr className="my-3 border-[#222]" />
              <div className="flex justify-between">
                <span className="text-gray-300">Entradas:</span>
                <span>${Number(ticketPrice).toFixed(2)}</span>
              </div>
              {/* Eliminar cargo por servicio */}
              <div className="flex justify-between mt-2 text-lg font-bold">
                <span>Total:</span>
                <span className="text-[#FFD700]">${total}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Método de Pago */}
        <Card className="flex-1 bg-[#181818] border-none shadow-xl rounded-xl p-0">
          <CardHeader className="border-b border-[#222] pb-4">
            <CardTitle className="text-2xl font-bold font-['Oswald'] text-white">
              Método de Pago
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 pb-2 px-6">
            {/* Solo opción de tarjeta */}
            <div className="flex gap-2 mb-6">
              <button
                className={`flex-1 py-3 rounded-md font-bold text-base border transition-all duration-200 bg-[#2a2a2a] border-[#E50914] text-white`}
                disabled
              >
                <span className="inline-flex items-center gap-2">
                  <span className="inline-block w-5 h-5 mr-2 align-middle">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                      <rect
                        x="2"
                        y="6"
                        width="20"
                        height="12"
                        rx="2"
                        fill="#E50914"
                      />
                      <rect x="2" y="10" width="20" height="2" fill="#fff" />
                    </svg>
                  </span>
                  Tarjeta de crédito / débito
                </span>
              </button>
            </div>
            {/* Formulario de Tarjeta */}
            <form className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-1 font-semibold">
                  Nombre del titular
                </label>
                <input
                  type="text"
                  className="w-full bg-[#222] border border-[#333] rounded-md px-3 py-2 text-white focus:outline-none focus:border-[#E50914]"
                  placeholder="Juan Pérez (ejemplo)"
                  value={cardData.name || "Juan Pérez"}
                  onChange={(e) =>
                    setCardData({ ...cardData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1 font-semibold">
                  Número de tarjeta
                </label>
                <input
                  type="text"
                  className="w-full bg-[#222] border border-[#333] rounded-md px-3 py-2 text-white focus:outline-none focus:border-[#E50914]"
                  placeholder="1234 5678 9012 3456 (ejemplo)"
                  value={cardData.number || "1234 5678 9012 3456"}
                  onChange={(e) =>
                    setCardData({ ...cardData, number: e.target.value })
                  }
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-gray-300 text-sm mb-1 font-semibold">
                    Fecha de expiración
                  </label>
                  <input
                    type="text"
                    className="w-full bg-[#222] border border-[#333] rounded-md px-3 py-2 text-white focus:outline-none focus:border-[#E50914]"
                    placeholder="12/34 (ejemplo)"
                    value={cardData.expiry || "12/34"}
                    onChange={(e) =>
                      setCardData({ ...cardData, expiry: e.target.value })
                    }
                  />
                </div>
                <div className="w-24">
                  <label className="block text-gray-300 text-sm mb-1 font-semibold">
                    CVV
                  </label>
                  <input
                    type="password"
                    className="w-full bg-[#222] border border-[#333] rounded-md px-3 py-2 text-white focus:outline-none focus:border-[#E50914]"
                    placeholder="123 (ejemplo)"
                    value={cardData.cvv || "123"}
                    onChange={(e) =>
                      setCardData({ ...cardData, cvv: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="text-xs text-[#FFD700] mt-2">
                Todos los datos de tarjeta mostrados son de ejemplo y no son
                reales. No ingreses información real.
              </div>
            </form>

            <Button
              onClick={handleComplete}
              className="w-full bg-[#E50914] hover:bg-[#b0060f] text-white font-bold text-lg py-4 rounded-md shadow-lg transition-all duration-300 mt-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : null}
              Pagar ${total}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
