import type React from "react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  getUserById,
} from "@/api/services";
import { useToast } from "@/hooks/use-toast";
import { Icons } from "@/components/ui/icons";

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

export const ProfilePage: React.FC = () => {
  const { userData, setLogoutUser, token, setUpdateUserData } = useAuthStore();
  const [reservations, setReservations] = useState<ReservationUser[]>([]);
  const [allReservations, setAllReservations] = useState<ReservationUser[]>([]);
  const [newRoleData, setNewRoleData] = useState({ userId: "", newRole: "" });
  const { toast } = useToast();
  const [emailValidated, setemailValidated] = useState(
    userData.email_validated
  );
  const [isLoadingYourReservations, setisLoadingYourReservations] =
    useState(false);
  const [isLoadingAllReservations, setisLoadingAllReservations] =
    useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchUserData = async () => {
      if (!emailValidated) {
        try {
          const { email_validated } = await getUserById(userData.id);

          if (email_validated) {
            setemailValidated(true);
            setUpdateUserData({ ...userData, email_validated: true });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          toast({
            title: "Error",
            description: "Failed to load your user data. Please try again.",
            variant: "destructive",
          });
        }
      }
    };

    fetchUserData();
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setisLoadingYourReservations(true);
      const userReservations = await getReservationsByUser(userData.id);
      setReservations(userReservations);
      setisLoadingYourReservations(false);
    } catch (error) {
      console.error("Error fetching user reservations:", error);
      toast({
        title: "Error",
        description: "Failed to load your reservations. Please try again.",
        variant: "destructive",
      });
    }
  };

  const fetchAllReservations = async () => {
    try {
      setisLoadingAllReservations(true);
      const allReservations = await getReservations(token);
      setAllReservations(allReservations);
      setisLoadingAllReservations(false);
    } catch (error) {
      console.error("Error fetching all reservations:", error);
      toast({
        title: "Error",
        description: "Failed to load all reservations. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteReservation = async (reservation: ReservationUser) => {
    try {
      await deleteReservationDB(reservation.id_reservation);
      await updateSeat(reservation.seat_data.id, {
        ...reservation.seat_data,
        room: reservation.showtime_data.room.id,
        is_available: true,
      });
      
      fetchReservations();

      if (userData.role === "ADMIN") {
        fetchAllReservations();
      }

      toast({
        title: "Reservation Deleted",
        description: "Your reservation has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting reservation:", error);
      toast({
        title: "Error",
        description: "Failed to delete reservation. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAssignRole = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newRoleData.userId || !newRoleData.newRole) {
      toast({
        title: "Invalid Input",
        description: "Please provide a valid user ID and role.",
        variant: "destructive",
      });
      return;
    }

    if (newRoleData.newRole !== "ADMIN" && newRoleData.newRole !== "USER") {
      toast({
        title: "Invalid Role",
        description: "Role must be either 'ADMIN' or 'USER'.",
        variant: "destructive",
      });
      return;
    }

    try {
      await assignRole(newRoleData.userId, newRoleData.newRole, token);
      setNewRoleData({ userId: "", newRole: "" });
      toast({
        title: "Role Assigned",
        description: `Role ${newRoleData.newRole} has been successfully assigned to user ID ${newRoleData.userId}.`,
      });
    } catch (error) {
      console.error("Error assigning role:", error);
      toast({
        title: "Error",
        description: "Failed to assign role. Please try again.",
        variant: "destructive",
      });
    }
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
        <Card className="bg-zinc-950 border-zinc-800 text-white">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gradient-to-br from-zinc-700 to-zinc-800 rounded-full flex items-center justify-center text-2xl font-bold">
                {userData.first_name.charAt(0).toUpperCase()}
                {userData.last_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold flex items-center space-x-2">
                  <span>
                    {userData.first_name} {userData.last_name}
                  </span>
                  <Badge variant="secondary" className="ml-2">
                    {userData.role}
                  </Badge>
                </h2>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-zinc-400" />
                <span className="font-semibold">{userData.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-zinc-400" />
                <span className="font-semibold">
                  Member since:{" "}
                  {new Date(userData?.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            {emailValidated ? (
              <Badge variant={"secondary"} className="cursor-default">
                Email Validado
              </Badge>
            ) : (
              <div className="flex items-center space-x-4">
                <Badge
                  variant={"destructive"}
                  className="cursor-default text-center"
                >
                  Email No Validado
                </Badge>
              </div>
            )}

            {userData.role === "ADMIN" && (
              <div className="space-y-4 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      onClick={fetchAllReservations}
                      variant={"secondary"}
                    >
                      View All Reservations
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-zinc-950 border-zinc-900 text-white  max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>All Reservations</DialogTitle>
                    </DialogHeader>
                    <div className="max-h-[60vh] overflow-y-auto">
                      {isLoadingAllReservations ? (
                        <div className="flex items-center justify-center h-full">
                          <Icons.spinner className="mr-2 h-10 w-10 animate-spin" />
                        </div>
                      ) : (
                        <AnimatePresence>
                          {allReservations.length > 0 ? (
                            <motion.ul className="space-y-4">
                              {allReservations.map((reservation) => (
                                <motion.li
                                  key={reservation.id_reservation}
                                  className="bg-zinc-900 rounded-lg p-4 flex items-center justify-between"
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -20 }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 24,
                                  }}
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
                                      Room:{" "}
                                      {reservation.showtime_data.room.name}
                                    </p>
                                    <p>
                                      Seat: {reservation.seat_data.seat_number}
                                    </p>
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
                                </motion.li>
                              ))}
                            </motion.ul>
                          ) : (
                            <p>No reservations found.</p>
                          )}
                        </AnimatePresence>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant={"default"}>Assign Role</Button>
                  </DialogTrigger>
                  <DialogContent className="bg-zinc-950 border-zinc-900 text-white">
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
                          className="bg-zinc-800 text-white border-zinc-700"
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
                          className="bg-zinc-800 text-white border-zinc-700"
                        />
                      </div>
                      <Button
                        type="submit"
                        variant={"secondary"}
                        className="w-full"
                      >
                        Assign Role
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            )}

            <div className="pt-4">
              <Button
                onClick={setLogoutUser}
                variant={"outline"}
                className="w-full sm:w-auto py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 bg-zinc-950 border-zinc-800 hover:bg-zinc-800 hover:text-white"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Log Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      <motion.div variants={itemVariants}>
        <Card className="bg-zinc-950 border-zinc-800 text-white">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              Your Reservations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingYourReservations ? (
              <div className="flex items-center justify-center h-full">
                <Icons.spinner className="mr-2 h-10 w-10 animate-spin" />
              </div>
            ) : (
              <AnimatePresence>
                {reservations.length > 0 ? (
                  <motion.ul className="space-y-4">
                    {reservations.map((reservation) => (
                      <motion.li
                        key={reservation.id_reservation}
                        className="bg-zinc-900  rounded-lg p-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 24,
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-grow">
                            <h3 className="text-lg font-semibold">
                              {reservation.showtime_data.movie.title}
                            </h3>
                            <p className="text-zinc-400">
                              {new Date(
                                reservation.showtime_data.start_time
                              ).toLocaleDateString()}{" "}
                              at{" "}
                              {new Date(
                                reservation.showtime_data.start_time
                              ).toLocaleTimeString()}
                            </p>
                            <p className="text-zinc-400">
                              Room: {reservation.showtime_data.room.name}
                            </p>
                            <p className="text-zinc-400">
                              Seat: {reservation.seat_data.seat_number}
                            </p>
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
                        </div>
                      </motion.li>
                    ))}
                  </motion.ul>
                ) : (
                  <p className="text-zinc-400">You have no reservations yet.</p>
                )}
              </AnimatePresence>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};
