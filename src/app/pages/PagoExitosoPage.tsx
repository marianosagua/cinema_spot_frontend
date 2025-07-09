import { useNavigate, useLocation } from "react-router-dom";
import type { Seat } from "@/interfaces/seat";

// Función para formatear fecha DD/MM/YYYY
const formatDate = (dateStr: string) => {
  if (!dateStr) return "-";
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
  const parts = timeStr.split(":");
  if (parts.length >= 2) {
    return `${parts[0].padStart(2, "0")}:${parts[1].padStart(2, "0")}`;
  }
  return timeStr;
};

export const PagoExitosoPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { movie, showtime, seats, price, functionDate, room } = state || {};

  if (!movie || !showtime || !seats || !price) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#181818] text-white text-xl">
        No hay datos de ticket para mostrar.
      </div>
    );
  }

  // Determinar fecha y hora a mostrar
  const fecha = functionDate ? formatDate(functionDate) : (showtime?.start_time ? formatDate(showtime.start_time) : "-");
  const hora = showtime?.start_time ? formatTime(showtime.start_time) : "-";
  const sala = room?.name || showtime?.room?.name || "-";

  return (
    <div className="min-h-screen bg-[#181818] flex flex-col items-center justify-center px-2 py-8">
      {/* Encabezado de confirmación */}
      <div className="w-full max-w-2xl flex flex-col items-center mb-8">
        <div className="bg-[#444] w-full rounded-t-xl flex flex-col items-center py-8 relative">
          <div className="bg-[#e50914] rounded-full w-16 h-16 flex items-center justify-center absolute -top-8 left-1/2 -translate-x-1/2 shadow-lg">
            <svg
              width="36"
              height="36"
              fill="none"
              viewBox="0 0 24 24"
              stroke="white"
            >
              <circle cx="12" cy="12" r="12" fill="#e50914" />
              <path
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 13l3 3 7-7"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mt-10 text-center">
            ¡Reserva confirmada!
          </h2>
          <p className="text-lg text-gray-200 mt-2 text-center">
            Prepárate para una experiencia inolvidable
          </p>
        </div>
      </div>

      {/* Detalles del ticket */}
      <div className="w-full max-w-2xl bg-[#222] rounded-xl shadow-lg border border-[#444] flex flex-col md:flex-row items-center md:items-start p-6 md:p-8 gap-6">
        <div className="flex-1 w-full">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[#e50914] font-bold text-lg">CinemaSpot</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            {movie?.title || "Película"}
          </h3>
          <div className="flex flex-col gap-2 text-gray-200 text-base mb-4">
            <div className="flex items-center gap-2">
              <span role="img" aria-label="calendario">
                📅
              </span>
              <span>
                Fecha: <b>{fecha}</b> &nbsp; | &nbsp; Hora: <b>{hora}</b>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span role="img" aria-label="teatro">
                🎬
              </span>
              <span>
                Sala: <b>{sala}</b>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span role="img" aria-label="asientos">
                💺
              </span>
              <span>
                Asientos: <b>{Array.isArray(seats) ? (seats as Seat[]).map((seat) => seat.seat_number).join(", ") || "-" : "-"}</b>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span role="img" aria-label="pago">
                💳
              </span>
              <span>
                Total pagado: <b className="text-yellow-400">${price?.toFixed(2) || "0.00"}</b>
              </span>
            </div>
          </div>
          <div className="border-t border-[#444] my-4"></div>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center text-gray-300 text-sm gap-2">
            <span className="text-yellow-400 font-medium">
              ¡Disfruta la función! <span className="text-gray-300 font-normal">Equipo CinemaSpot</span>
            </span>
          </div>
        </div>
      </div>

      {/* Botones */}
      <div className="w-full max-w-2xl flex flex-col md:flex-row gap-4 mt-8">
        <button
          className="w-full md:w-auto bg-[#e50914] hover:bg-[#b0060f] text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center transition-colors"
          onClick={() => {
            /* Aquí iría la lógica para descargar el ticket */
          }}
        >
          <span className="mr-2">⬇️</span> Descargar boleto
        </button>
        <button
          className="w-full md:w-auto border-2 border-[#0d6efd] text-[#0d6efd] hover:bg-[#0d6efd] hover:text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center transition-colors"
          onClick={() => navigate("/")}
        >
          <span className="mr-2">🏠</span> Volver al inicio
        </button>
      </div>

      {/* Mensaje de confirmación */}
      <div className="w-full max-w-2xl text-center text-gray-300 mt-6">
        Te hemos enviado una copia a tu correo electrónico.
      </div>
    </div>
  );
};
