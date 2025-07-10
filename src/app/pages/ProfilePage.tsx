import { useEffect, useState } from "react";
import { useAuthStore } from "@/hooks/useAuthStore";
import { getReservationsByUser } from "@/api/services/reservationService";
import { getUserById } from "@/api/services/usersService";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Reservation as UserReservation } from "@/interfaces/user";
import { Reservation as ApiReservation } from "@/interfaces/reservation";
import { motion } from "framer-motion";
import {
  Ticket,
  Calendar,
  Mail,
  User2,
  Shield,
  ChevronRight,
  Clock,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const ProfilePage = () => {
  const { userData, setUpdateUserData } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [activeReservations, setActiveReservations] = useState<
    UserReservation[]
  >([]);
  const [showAllReservationsModal, setShowAllReservationsModal] =
    useState(false);
  const [selectedReservation, setSelectedReservation] =
    useState<UserReservation | null>(null);
  const [showReservationDetailsModal, setShowReservationDetailsModal] =
    useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener datos actualizados del usuario
        const updatedUserData = await getUserById(userData.id);
        setUpdateUserData(updatedUserData);

        // Obtener las reservaciones
        const userReservations: ApiReservation[] = await getReservationsByUser(
          userData.id
        );

        // Transformar los datos del API al formato que espera el componente
        const transformedReservations: UserReservation[] = userReservations.map(
          (reservation) => ({
            id: reservation.id_reservation,
            movieTitle: reservation.showtime_data.movie.title,
            showtime: reservation.showtime_data.start_time.toString(),
            seats: [reservation.seat_data.seat_number.toString()],
            totalAmount: 0, // El API no proporciona el monto total, se puede calcular si es necesario
            status: "active", // Asumimos que todas las reservaciones del usuario están activas
          })
        );

        setActiveReservations(transformedReservations);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos del perfil",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userData.id, setUpdateUserData, toast]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <Skeleton className="h-[200px] rounded-xl" />
          <Skeleton className="h-[400px] rounded-xl md:col-span-2" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Mi Perfil</h1>
            <p className="text-gray-400">Gestiona tu cuenta y reservaciones</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Profile Card */}
              <Card className="bg-[#1E1E1E] border-zinc-800">
                <CardContent className="p-6">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {userData.first_name} {userData.last_name}
                    </h2>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          userData.email_validated ? "success" : "destructive"
                        }
                        className={
                          userData.email_validated
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }
                      >
                        {userData.email_validated
                          ? "Verificado"
                          : "No Verificado"}
                      </Badge>
                    </div>
                    {userData.role === "ADMIN" && (
                      <button
                        className="mt-4 w-full bg-gradient-to-r from-[#E50914] via-[#FF3333] to-[#E50914] text-white font-bold py-3 rounded-xl shadow-lg hover:from-[#FF3333] hover:to-[#E50914] hover:scale-105 transition-all duration-300 text-lg flex items-center justify-center gap-2 border-2 border-[#E50914] hover:border-[#FF3333]"
                        onClick={() => navigate("/admin")}
                      >
                        Ir al panel
                      </button>
                    )}
                  </div>
                  {/* Botón de editar perfil eliminado */}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="bg-[#1E1E1E] border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-lg text-white">
                    Estadísticas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Ticket className="w-5 h-5 text-[#E50914]" />
                      <span className="text-gray-400">Reservaciones</span>
                    </div>
                    <span className="text-white font-semibold">
                      {activeReservations.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-[#E50914]" />
                      <span className="text-gray-400">Miembro desde</span>
                    </div>
                    <span className="text-white font-semibold">
                      {userData.created_at
                        ? format(new Date(userData.created_at), "MMM yyyy", {
                            locale: es,
                          })
                        : "No disponible"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="md:col-span-2 space-y-6">
              {/* Account Info */}
              <Card className="bg-[#1E1E1E] border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-xl text-white flex items-center gap-2">
                    <User2 className="w-5 h-5 text-[#E50914]" />
                    Información de la Cuenta
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Mail className="w-4 h-4" />
                          <span>Email</span>
                        </div>
                        <p className="text-white">{userData.email}</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Shield className="w-4 h-4" />
                          <span>Rol</span>
                        </div>
                        <p className="text-white capitalize">{userData.role}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Active Reservations */}
              <Card className="bg-[#1E1E1E] border-zinc-800">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl text-white flex items-center gap-2">
                    <Ticket className="w-5 h-5 text-[#E50914]" />
                    Reservaciones Activas
                  </CardTitle>
                  <Button
                    variant="ghost"
                    className="text-[#E50914] hover:text-[#FF3333] hover:bg-red-500/10"
                    onClick={() => setShowAllReservationsModal(true)}
                  >
                    Ver todas
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardHeader>
                <CardContent>
                  {activeReservations.length === 0 ? (
                    <div className="py-12 text-center">
                      <Ticket className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">
                        No tienes reservaciones activas
                      </h3>
                      <p className="text-gray-400 max-w-md mx-auto mb-6">
                        ¡Explora nuestra cartelera y reserva tus asientos para
                        los próximos estrenos!
                      </p>
                      <Button
                        className="bg-[#E50914] hover:bg-[#FF3333] text-white"
                        onClick={() => navigate("/cartelera")}
                      >
                        Ver Cartelera
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {activeReservations.slice(0, 4).map((reservation) => (
                        <ReservationCard
                          key={reservation.id}
                          reservation={reservation}
                          isActive
                          onViewDetails={(reservation) => {
                            setSelectedReservation(reservation);
                            setShowReservationDetailsModal(true);
                          }}
                        />
                      ))}
                      {activeReservations.length > 4 && (
                        <div className="text-center py-4">
                          <p className="text-gray-400">
                            Mostrando 4 de {activeReservations.length}{" "}
                            reservaciones
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para mostrar todas las reservaciones */}
      <Dialog
        open={showAllReservationsModal}
        onOpenChange={setShowAllReservationsModal}
      >
        <DialogContent className="bg-[#1E1E1E] border-zinc-800 max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
              <Ticket className="w-6 h-6 text-[#E50914]" />
              Todas mis Reservaciones ({activeReservations.length})
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-6">
            {activeReservations.map((reservation) => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                isActive
                onViewDetails={(reservation) => {
                  setSelectedReservation(reservation);
                  setShowReservationDetailsModal(true);
                }}
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Detalles de Reservación */}
      <Dialog
        open={showReservationDetailsModal}
        onOpenChange={setShowReservationDetailsModal}
      >
        <DialogContent className="bg-gradient-to-br from-[#0F0F0F] via-[#1A1A1A] to-[#0F0F0F] border-0 p-0 max-w-5xl max-h-[90vh] overflow-hidden">
          {selectedReservation && (
            <div className="relative">
              {/* Header con gradiente */}
              <div className="bg-gradient-to-r from-[#E50914] via-[#FF3333] to-[#E50914] p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative z-10">
                  <DialogHeader className="text-center">
                    <DialogTitle className="text-3xl font-bold text-white flex items-center justify-center gap-3">
                      <Ticket className="w-8 h-8" />
                      Detalles de Reservación
                    </DialogTitle>
                    <p className="text-white/80 mt-2 text-lg">
                      {selectedReservation.movieTitle}
                    </p>
                  </DialogHeader>
                </div>
                {/* Elementos decorativos */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                  <div className="absolute top-4 left-4 w-2 h-2 bg-white rounded-full"></div>
                  <div className="absolute top-8 right-8 w-3 h-3 bg-white rounded-full"></div>
                  <div className="absolute bottom-6 left-12 w-1 h-1 bg-white rounded-full"></div>
                  <div className="absolute bottom-12 right-16 w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>

              {/* Contenido principal */}
              <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Información de la Película */}
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-[#1E1E1E] to-[#2A2A2A] rounded-2xl p-6 border border-zinc-800/50 shadow-xl">
                      <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-[#E50914] to-[#FF3333] rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            🎬
                          </span>
                        </div>
                        Información de la Película
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-black/20 rounded-lg">
                          <div className="w-10 h-10 bg-gradient-to-r from-[#E50914] to-[#FF3333] rounded-lg flex items-center justify-center">
                            <span className="text-white text-lg">📽️</span>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Título</p>
                            <p className="text-white font-semibold text-lg">
                              {selectedReservation.movieTitle}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-black/20 rounded-lg">
                          <div className="w-10 h-10 bg-gradient-to-r from-[#E50914] to-[#FF3333] rounded-lg flex items-center justify-center">
                            <span className="text-white text-lg">🎭</span>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Género</p>
                            <p className="text-white font-semibold">
                              Acción / Aventura
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-black/20 rounded-lg">
                          <div className="w-10 h-10 bg-gradient-to-r from-[#E50914] to-[#FF3333] rounded-lg flex items-center justify-center">
                            <span className="text-white text-lg">⭐</span>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">
                              Calificación
                            </p>
                            <p className="text-white font-semibold">8.5/10</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Información de la Función */}
                    <div className="bg-gradient-to-br from-[#1E1E1E] to-[#2A2A2A] rounded-2xl p-6 border border-zinc-800/50 shadow-xl">
                      <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-[#E50914] to-[#FF3333] rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            🎫
                          </span>
                        </div>
                        Detalles de la Función
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-black/20 rounded-lg">
                          <Calendar className="w-5 h-5 text-[#E50914]" />
                          <div>
                            <p className="text-gray-400 text-sm">Fecha</p>
                            <p className="text-white font-semibold">
                              {format(
                                new Date(selectedReservation.showtime),
                                "EEEE, d 'de' MMMM 'de' yyyy",
                                { locale: es }
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-black/20 rounded-lg">
                          <Clock className="w-5 h-5 text-[#E50914]" />
                          <div>
                            <p className="text-gray-400 text-sm">Hora</p>
                            <p className="text-white font-semibold">
                              {format(
                                new Date(selectedReservation.showtime),
                                "HH:mm",
                                { locale: es }
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-black/20 rounded-lg">
                          <MapPin className="w-5 h-5 text-[#E50914]" />
                          <div>
                            <p className="text-gray-400 text-sm">Sala</p>
                            <p className="text-white font-semibold">
                              Sala Premium {selectedReservation.showtime}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Información de Asientos y Reservación */}
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-[#1E1E1E] to-[#2A2A2A] rounded-2xl p-6 border border-zinc-800/50 shadow-xl">
                      <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-[#E50914] to-[#FF3333] rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            💺
                          </span>
                        </div>
                        Información de Asientos
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-black/20 rounded-lg">
                          <Ticket className="w-5 h-5 text-[#E50914]" />
                          <div>
                            <p className="text-gray-400 text-sm">
                              Cantidad de Asientos
                            </p>
                            <p className="text-white font-semibold text-lg">
                              {selectedReservation.seats.length}{" "}
                              {selectedReservation.seats.length === 1
                                ? "Asiento"
                                : "Asientos"}
                            </p>
                          </div>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-[#E50914]/10 to-[#FF3333]/10 rounded-lg border border-[#E50914]/20">
                          <p className="text-gray-400 text-sm mb-2">
                            Asientos Seleccionados
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {selectedReservation.seats.map((seat, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-gradient-to-r from-[#E50914] to-[#FF3333] text-white rounded-full text-sm font-semibold"
                              >
                                {seat}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Información de la Reservación */}
                    <div className="bg-gradient-to-br from-[#1E1E1E] to-[#2A2A2A] rounded-2xl p-6 border border-zinc-800/50 shadow-xl">
                      <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-[#E50914] to-[#FF3333] rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            📋
                          </span>
                        </div>
                        Detalles de la Reservación
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-black/20 rounded-lg">
                          <div className="w-10 h-10 bg-gradient-to-r from-[#E50914] to-[#FF3333] rounded-lg flex items-center justify-center">
                            <span className="text-white text-lg">🆔</span>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">
                              ID de Reservación
                            </p>
                            <p className="text-white font-mono text-sm">
                              {selectedReservation.id}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-black/20 rounded-lg">
                          <div className="w-10 h-10 bg-gradient-to-r from-[#E50914] to-[#FF3333] rounded-lg flex items-center justify-center">
                            <span className="text-white text-lg">✅</span>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Estado</p>
                            <p className="text-green-400 font-semibold">
                              Confirmada
                            </p>
                          </div>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20">
                          <p className="text-green-400 text-sm font-semibold mb-1">
                            ✅ Reservación Confirmada
                          </p>
                          <p className="text-gray-400 text-xs">
                            Tu reservación está confirmada y lista para
                            disfrutar
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    className="bg-gradient-to-r from-[#E50914] to-[#FF3333] hover:from-[#FF3333] hover:to-[#E50914] text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0"
                    onClick={() => setShowReservationDetailsModal(false)}
                  >
                    Cerrar
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-zinc-800 to-zinc-700 hover:from-zinc-700 hover:to-zinc-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-zinc-600 hover:border-zinc-500"
                    onClick={() => {
                      setShowReservationDetailsModal(false);
                      navigate("/cartelera");
                    }}
                  >
                    Ver Más Películas
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Componente de Tarjeta de Reservación
const ReservationCard = ({
  reservation,
  isActive = false,
  onViewDetails,
}: {
  reservation: UserReservation;
  isActive?: boolean;
  onViewDetails: (reservation: UserReservation) => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <Card className="bg-[#1E1E1E] border-zinc-800 hover:border-zinc-700 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-xl font-bold text-white">
                {reservation.movieTitle}
              </h3>
              <Badge
                variant={isActive ? "default" : "secondary"}
                className={
                  isActive
                    ? "bg-[#E50914]/20 text-[#E50914] border-[#E50914]/30"
                    : "bg-zinc-700/20 text-zinc-400 border-zinc-700/30"
                }
              >
                {isActive ? "Activa" : "Completada"}
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar className="w-4 h-4 text-[#E50914]" />
                  <span className="text-sm">
                    {reservation.showtime
                      ? format(
                          new Date(reservation.showtime),
                          "d 'de' MMMM 'de' yyyy",
                          { locale: es }
                        )
                      : "Fecha no disponible"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock className="w-4 h-4 text-[#E50914]" />
                  <span className="text-sm">
                    {reservation.showtime
                      ? format(new Date(reservation.showtime), "HH:mm", {
                          locale: es,
                        })
                      : "Hora no disponible"}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-400">
                  <Ticket className="w-4 h-4 text-[#E50914]" />
                  <span className="text-sm">
                    {reservation.seats.length}{" "}
                    {reservation.seats.length === 1 ? "Asiento" : "Asientos"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <MapPin className="w-4 h-4 text-[#E50914]" />
                  <span className="text-sm">Sala {reservation.showtime}</span>
                </div>
              </div>
            </div>
          </div>
          {isActive && (
            <div className="flex flex-col items-end">
              <Button
                className="bg-gradient-to-r from-[#E50914] to-[#FF3333] hover:from-[#FF3333] hover:to-[#E50914] text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0"
                onClick={() => onViewDetails(reservation)}
              >
                Ver Detalles
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  </motion.div>
);
