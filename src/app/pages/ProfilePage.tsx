import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Calendar, LogOut, Ticket, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/hooks/useAuthStore";
import type { ReservationUser } from "@/interfaces/reservation";
import {
  deleteReservationDB,
  getReservationsByUser,
  updateSeat,
  assignRole,
  getReservations,
} from "@/api/services";
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
  },
};

export const ProfilePage: React.FC = () => {
  const { userData, setLogoutUser, token } = useAuthStore();
  const [reservations, setReservations] = useState<
    ReservationUser[] | undefined
  >();
  const [allReservations, setAllReservations] = useState<
    ReservationUser[] | undefined
  >();
  const [newRoleData, setNewRoleData] = useState({ userId: "", newRole: "" });
  const { toast } = useToast();

  const fetchReservations = async () => {
    const userReservations = await getReservationsByUser(userData.id);
    setReservations(userReservations);
  };

  const fetchAllReservations = async () => {
    const allReservations = await getReservations(token);
    setAllReservations(allReservations);
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleDeleteReservation = async (reservation: ReservationUser) => {
    await deleteReservationDB(reservation.id_reservation);
    await updateSeat(reservation.seat_data.id, {
      ...reservation.seat_data,
      room: reservation.showtime_data.room.id,
      is_available: true,
    });
    fetchReservations();
    fetchAllReservations();
  };

  const handleAssignRole = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newRoleData.userId || !newRoleData.newRole) {
      toast({
        title: "Invalid Input",
        description: "Please provide a valid user ID and role.",
      });
      return;
    }

    if(newRoleData.newRole !== "ADMIN" && newRoleData.newRole !== "USER") {
      toast({
        title: "Invalid Role",
        description: "Role must be either 'ADMIN' or 'USER'.",
      });
      return;
    }

    const response = await assignRole(
      newRoleData.userId,
      newRoleData.newRole,
      token
    );
    console.log(response);
    setNewRoleData({ userId: "", newRole: "" });

    toast({
      title: "Role Assigned",
      description: `Role ${newRoleData.newRole} has been successfully assigned to user ID ${newRoleData.userId}.`,
    });
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto space-y-8 px-4 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1
        className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500"
        variants={itemVariants}
      >
        User Profile
      </motion.h1>
      <motion.div variants={itemVariants}>
        <Card className="bg-gray-900 border border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white font-semibold text-2xl">
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center">
              <div className="text-white w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center text-2xl font-bold mr-6">
                {userData.first_name.charAt(0).toUpperCase()}
                {userData.last_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white flex flex-row justify-center items-center">
                  {userData.first_name} {userData.last_name}
                  <Badge variant="secondary" className="ml-2 cursor-default">
                    {userData.role}
                  </Badge>
                </h2>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-4 text-gray-400" />
                <p className="text-white font-semibold">{userData.email}</p>
              </div>
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-4 text-gray-400" />
                <p className="text-white font-semibold">
                  Member since: {userData?.created_at?.slice(0, 10)}
                </p>
              </div>
            </div>

            {userData.role === "ADMIN" && (
              <div className="space-y-4 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      onClick={fetchAllReservations}
                      className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                    >
                      View All Reservations
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-800 text-white border border-zinc-800">
                    <DialogHeader>
                      <DialogTitle>All Reservations</DialogTitle>
                    </DialogHeader>
                    <div className="max-h-[60vh] overflow-y-auto">
                      {allReservations && allReservations.length > 0 ? (
                        <ul className="space-y-4">
                          {allReservations.map((reservation) => (
                            <li
                              key={reservation.id_reservation}
                              className="bg-gray-700 rounded-lg p-4 flex items-center justify-between"
                            >
                              <div>
                                <h3 className="text-lg font-semibold">
                                  {reservation.showtime_data.movie.title}
                                </h3>
                                <p>
                                  Date:{" "}
                                  {new Date(
                                    reservation.showtime_data.start_time
                                  ).toLocaleDateString()}
                                </p>
                                <p>
                                  Time:{" "}
                                  {new Date(
                                    reservation.showtime_data.start_time
                                  ).toLocaleTimeString()}
                                </p>
                                <p>
                                  Room: {reservation.showtime_data.room.name}
                                </p>
                                <p>Seat: {reservation.seat_data.seat_number}</p>
                                <p>User: {reservation.user_data.email}</p>
                              </div>

                              <div className="flex items-center space-x-4">
                                <Ticket className="w-6 h-6 text-blue-400" />
                                <Button
                                  onClick={() =>
                                    handleDeleteReservation(reservation)
                                  }
                                  variant="destructive"
                                  size="icon"
                                  className="h-8 w-8"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No reservations found.</p>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
                      Assign Role
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-800 text-white border border-zinc-800">
                    <DialogHeader>
                      <DialogTitle>Assign Role</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAssignRole} className="space-y-4">
                      <div>
                        <Label htmlFor="userId">User ID</Label>
                        <Input
                          id="userId"
                          value={newRoleData.userId}
                          onChange={(e) =>
                            setNewRoleData({
                              ...newRoleData,
                              userId: e.target.value,
                            })
                          }
                          className="bg-gray-700 text-white border border-zinc-800"
                        />
                      </div>
                      <div>
                        <Label htmlFor="newRole">New Role</Label>
                        <Input
                          id="newRole"
                          value={newRoleData.newRole}
                          onChange={(e) =>
                            setNewRoleData({
                              ...newRoleData,
                              newRole: e.target.value,
                            })
                          }
                          className="bg-gray-700 text-white border border-zinc-800"
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-green-500 hover:bg-green-600"
                      >
                        Assign Role
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            )}

            <div className="space-x-4">
              <Button
                onClick={setLogoutUser}
                className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Log Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="bg-gray-900 border border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white font-semibold text-2xl">
              Your Reservations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {reservations && reservations.length > 0 ? (
              <ul className="space-y-4">
                {reservations.map((reservation) => (
                  <li
                    key={reservation.id_reservation}
                    className="bg-gray-800 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-grow">
                        <h3 className="text-lg font-semibold text-white">
                          {reservation.showtime_data.movie.title}
                        </h3>
                        <p className="text-gray-400">
                          {new Date(reservation.showtime_data.start_time)
                            .toLocaleString()
                            .substring(0, 10)}{" "}
                          at{" "}
                          {new Date(
                            reservation.showtime_data.start_time
                          ).toLocaleTimeString()}
                        </p>
                        <p className="text-gray-400">
                          Room: {reservation.showtime_data.room.name}
                        </p>
                        <p className="text-gray-400">
                          Seat: {reservation.seat_data.seat_number}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Ticket className="w-6 h-6 text-blue-400" />
                        <Button
                          onClick={() => handleDeleteReservation(reservation)}
                          variant="destructive"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">You have no reservations yet.</p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};
