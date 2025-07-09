import { useEffect, useState } from "react";
import { useAuthStore } from "@/hooks/useAuthStore";
import { getReservationsByUser } from "@/api/services/reservationService";
import { getUserById } from "@/api/services/usersService";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Reservation } from "@/interfaces/user";
import { motion } from "framer-motion";
import {
  Ticket,
  Calendar,
  Mail,
  User2,
  Shield,
  Edit,
  ChevronRight,
  Clock,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const ProfilePage = () => {
  const { userData, setUpdateUserData } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [activeReservations, setActiveReservations] = useState<Reservation[]>(
    []
  );
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener datos actualizados del usuario
        const updatedUserData = await getUserById(userData.id);
        setUpdateUserData(updatedUserData);

        // Obtener las reservaciones
        const userReservations = await getReservationsByUser(userData.id);
        const active = userReservations.filter(
          (r: Reservation) => r.status === "active"
        );
        setActiveReservations(active);
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
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-[#E50914] text-[#E50914] hover:bg-[#E50914]/10 hover:text-[#E50914] font-medium py-6 transition-all duration-300"
                    onClick={() => navigate("/perfil/editar")}
                  >
                    <Edit className="w-5 h-5 mr-2" />
                    Editar Perfil
                  </Button>
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
                    onClick={() => navigate("/reservaciones")}
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
                      {activeReservations.map((reservation) => (
                        <ReservationCard
                          key={reservation.id}
                          reservation={reservation}
                          isActive
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente de Tarjeta de Reservación
const ReservationCard = ({
  reservation,
  isActive = false,
}: {
  reservation: Reservation;
  isActive?: boolean;
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
          <div className="flex flex-col items-end gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-400">Total</p>
              <p className="text-2xl font-bold text-white">
                ${reservation.totalAmount.toFixed(2)}
              </p>
            </div>
            {isActive && (
              <Button
                variant="outline"
                className="border-[#E50914] text-[#E50914] hover:bg-[#E50914]/10"
              >
                Ver Detalles
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);
