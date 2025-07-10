import { useState, useEffect } from "react";
import {
  getReservations,
  deleteReservationDB,
} from "@/api/services/reservationService";
import { Reservation } from "@/interfaces/reservation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuthStore } from "@/hooks/useAuthStore";

export const ReservationsAdmin = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [detailsReservation, setDetailsReservation] =
    useState<Reservation | null>(null);
  const { token } = useAuthStore();

  const fetchReservations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getReservations(token);
      setReservations(data);
    } catch {
      setError("Error al cargar reservaciones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleOpenDetails = (reservation: Reservation) => {
    setDetailsReservation(reservation);
    setOpenDetails(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta reservación?"))
      return;
    setLoading(true);
    setError(null);
    try {
      await deleteReservationDB(id);
      fetchReservations();
    } catch {
      setError("Error al eliminar la reservación");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
        <h2 className="text-2xl font-bold text-white">Reservaciones</h2>
      </div>
      {loading && <div className="text-gray-300 mb-4">Cargando...</div>}
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {/* Tabla para pantallas medianas y grandes */}
      <div className="hidden md:block rounded-lg shadow-inner">
        <table className="min-w-full bg-[#232323] rounded-lg">
          <thead>
            <tr className="text-[#FFD700] text-lg">
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Usuario</th>
              <th className="py-3 px-4 text-left">Película</th>
              <th className="py-3 px-4 text-left">Sala</th>
              <th className="py-3 px-4 text-left">Asiento</th>
              <th className="py-3 px-4 text-left">Fecha</th>
              <th className="py-3 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr
                key={reservation.id_reservation}
                className="border-b border-[#333] hover:bg-[#292929] transition-all"
              >
                <td className="py-3 px-4 text-white font-semibold">
                  {reservation.id_reservation}
                </td>
                <td className="py-3 px-4 text-gray-300">{`${reservation.user_data.first_name} ${reservation.user_data.last_name}`}</td>
                <td className="py-3 px-4 text-gray-300">
                  {reservation.showtime_data.movie.title}
                </td>
                <td className="py-3 px-4 text-gray-300">
                  {reservation.showtime_data.room.name}
                </td>
                <td className="py-3 px-4 text-gray-300">
                  {reservation.seat_data.seat_number}
                </td>
                <td className="py-3 px-4 text-gray-300">
                  {formatDate(reservation.showtime_data.start_time)}
                </td>
                <td className="py-3 px-4 text-center flex gap-2 justify-center">
                  <button
                    className="bg-blue-500 text-white font-bold px-4 py-1 rounded hover:bg-blue-600 transition-all"
                    onClick={() => handleOpenDetails(reservation)}
                  >
                    Ver detalles
                  </button>
                  <button
                    className="bg-[#E50914] text-white font-bold px-4 py-1 rounded hover:bg-[#b0060f] transition-all"
                    onClick={() => handleDelete(reservation.id_reservation)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Cards para mobile */}
      <div className="md:hidden flex flex-col gap-4">
        {reservations.map((reservation) => (
          <div
            key={reservation.id_reservation}
            className="bg-[#232323] rounded-xl p-4 shadow flex flex-col gap-2"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#FFD700] font-bold">
                {reservation.showtime_data.movie.title}
              </span>
              <span className="text-gray-400 text-sm">
                ID: {reservation.id_reservation}
              </span>
            </div>
            <div className="text-gray-300 mb-2">
              Usuario:{" "}
              <span className="font-semibold text-white">{`${reservation.user_data.first_name} ${reservation.user_data.last_name}`}</span>
            </div>
            <div className="text-gray-300 mb-2">
              Sala:{" "}
              <span className="font-semibold text-white">
                {reservation.showtime_data.room.name}
              </span>
            </div>
            <div className="text-gray-300 mb-2">
              Asiento:{" "}
              <span className="font-semibold text-white">
                {reservation.seat_data.seat_number}
              </span>
            </div>
            <div className="text-gray-300 mb-2">
              Fecha:{" "}
              <span className="font-semibold text-white">
                {formatDate(reservation.showtime_data.start_time)}
              </span>
            </div>
            <div className="flex gap-2 mt-2">
              <button
                className="flex-1 bg-blue-500 text-white font-bold py-2 rounded hover:bg-blue-600 transition-all"
                onClick={() => handleOpenDetails(reservation)}
              >
                Ver detalles
              </button>
              <button
                className="flex-1 bg-[#E50914] text-white font-bold py-2 rounded hover:bg-[#b0060f] transition-all"
                onClick={() => handleDelete(reservation.id_reservation)}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Modal de detalles */}
      <Dialog open={openDetails} onOpenChange={setOpenDetails}>
        <DialogContent className="max-w-2xl bg-[#181818] text-white rounded-2xl shadow-2xl border border-[#333]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#FFD700] mb-2">
              Detalles de la Reservación
            </DialogTitle>
          </DialogHeader>
          {detailsReservation && (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-[#FFD700] font-semibold">
                    Información del Usuario:
                  </span>
                  <div className="bg-[#232323] rounded p-3 mt-2">
                    <p className="text-gray-200">
                      Nombre:{" "}
                      {`${detailsReservation.user_data.first_name} ${detailsReservation.user_data.last_name}`}
                    </p>
                    <p className="text-gray-200">
                      Email: {detailsReservation.user_data.email}
                    </p>
                    <p className="text-gray-200">
                      ID: {detailsReservation.user_data.id}
                    </p>
                  </div>
                </div>
                <div>
                  <span className="text-[#FFD700] font-semibold">
                    Información de la Función:
                  </span>
                  <div className="bg-[#232323] rounded p-3 mt-2">
                    <p className="text-gray-200">
                      Película: {detailsReservation.showtime_data.movie.title}
                    </p>
                    <p className="text-gray-200">
                      Sala: {detailsReservation.showtime_data.room.name}
                    </p>
                    <p className="text-gray-200">
                      Inicio:{" "}
                      {formatDate(detailsReservation.showtime_data.start_time)}
                    </p>
                    <p className="text-gray-200">
                      Fin:{" "}
                      {formatDate(detailsReservation.showtime_data.end_time)}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <span className="text-[#FFD700] font-semibold">
                  Información del Asiento:
                </span>
                <div className="bg-[#232323] rounded p-3 mt-2">
                  <p className="text-gray-200">
                    Número: {detailsReservation.seat_data.seat_number}
                  </p>
                  <p className="text-gray-200">
                    Sala: {detailsReservation.seat_data.room.name}
                  </p>
                  <p className="text-gray-200">
                    ID del asiento: {detailsReservation.seat_data.id}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  className="bg-[#E50914] text-white font-bold px-4 py-1 rounded hover:bg-[#b0060f] transition-all"
                  onClick={() => {
                    setOpenDetails(false);
                    handleDelete(detailsReservation.id_reservation);
                  }}
                >
                  Eliminar
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}; 