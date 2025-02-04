import type React from "react"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Calendar, LogOut, Ticket, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthStore } from "@/hooks/useAuthStore"
import type { ReservationUser } from "@/interfaces/reservation"
import { deleteReservationDB, getReservationsByUser, updateSeat, assignRole, getReservations } from "@/api/services"
import { useToast } from "@/hooks/use-toast"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

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
}

export const ProfilePage: React.FC = () => {
  const { userData, setLogoutUser, token } = useAuthStore()
  const [reservations, setReservations] = useState<ReservationUser[]>([])
  const [allReservations, setAllReservations] = useState<ReservationUser[]>([])
  const [newRoleData, setNewRoleData] = useState({ userId: "", newRole: "" })
  const { toast } = useToast()

  const fetchReservations = async () => {
    try {
      const userReservations = await getReservationsByUser(userData.id)
      setReservations(userReservations)
    } catch (error) {
      console.error("Error fetching user reservations:", error)
      toast({
        title: "Error",
        description: "Failed to load your reservations. Please try again.",
        variant: "destructive",
      })
    }
  }

  const fetchAllReservations = async () => {
    try {
      const allReservations = await getReservations(token)
      setAllReservations(allReservations)
    } catch (error) {
      console.error("Error fetching all reservations:", error)
      toast({
        title: "Error",
        description: "Failed to load all reservations. Please try again.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchReservations()
    fetchAllReservations()
  }, [userData.id, token])

  const handleDeleteReservation = async (reservation: ReservationUser) => {
    try {
      await deleteReservationDB(reservation.id_reservation)
      await updateSeat(reservation.seat_data.id, {
        ...reservation.seat_data,
        room: reservation.showtime_data.room.id,
        is_available: true,
      })
      fetchReservations()
      fetchAllReservations()
      toast({
        title: "Reservation Deleted",
        description: "Your reservation has been successfully deleted.",
      })
    } catch (error) {
      console.error("Error deleting reservation:", error)
      toast({
        title: "Error",
        description: "Failed to delete reservation. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAssignRole = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newRoleData.userId || !newRoleData.newRole) {
      toast({
        title: "Invalid Input",
        description: "Please provide a valid user ID and role.",
        variant: "destructive",
      })
      return
    }

    if (newRoleData.newRole !== "ADMIN" && newRoleData.newRole !== "USER") {
      toast({
        title: "Invalid Role",
        description: "Role must be either 'ADMIN' or 'USER'.",
        variant: "destructive",
      })
      return
    }

    try {
      await assignRole(newRoleData.userId, newRoleData.newRole, token)
      setNewRoleData({ userId: "", newRole: "" })
      toast({
        title: "Role Assigned",
        description: `Role ${newRoleData.newRole} has been successfully assigned to user ID ${newRoleData.userId}.`,
      })
    } catch (error) {
      console.error("Error assigning role:", error)
      toast({
        title: "Error",
        description: "Failed to assign role. Please try again.",
        variant: "destructive",
      })
    }
  }

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
        <Card className="bg-zinc-900 border-zinc-950 text-white">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Personal Information</CardTitle>
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
                  Member since: {new Date(userData?.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            {userData.role === "ADMIN" && (
              <div className="space-y-4 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      onClick={fetchAllReservations}
                      className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                    >
                      View All Reservations
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-zinc-900 text-white border-zinc-800 max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>All Reservations</DialogTitle>
                    </DialogHeader>
                    <div className="max-h-[60vh] overflow-y-auto">
                      <AnimatePresence>
                        {allReservations.length > 0 ? (
                          <motion.ul className="space-y-4">
                            {allReservations.map((reservation) => (
                              <motion.li
                                key={reservation.id_reservation}
                                className="bg-zinc-800 rounded-lg p-4 flex items-center justify-between"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                              >
                                <div>
                                  <h3 className="text-lg font-semibold">{reservation.showtime_data.movie.title}</h3>
                                  <p>Date: {new Date(reservation.showtime_data.start_time).toLocaleDateString()}</p>
                                  <p>Time: {new Date(reservation.showtime_data.start_time).toLocaleTimeString()}</p>
                                  <p>Room: {reservation.showtime_data.room.name}</p>
                                  <p>Seat: {reservation.seat_data.seat_number}</p>
                                  <p>User: {reservation.user_data.email}</p>
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
                              </motion.li>
                            ))}
                          </motion.ul>
                        ) : (
                          <p>No reservations found.</p>
                        )}
                      </AnimatePresence>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
                      Assign Role
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-zinc-900 text-white border-zinc-800">
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
                      <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
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
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Log Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="bg-zinc-900 border-zinc-950 text-white">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Your Reservations</CardTitle>
          </CardHeader>
          <CardContent>
            <AnimatePresence>
              {reservations.length > 0 ? (
                <motion.ul className="space-y-4">
                  {reservations.map((reservation) => (
                    <motion.li
                      key={reservation.id_reservation}
                      className="bg-zinc-800 rounded-lg p-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ type: "spring", stiffness: 300, damping: 24 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-grow">
                          <h3 className="text-lg font-semibold">{reservation.showtime_data.movie.title}</h3>
                          <p className="text-zinc-400">
                            {new Date(reservation.showtime_data.start_time).toLocaleDateString()} at{" "}
                            {new Date(reservation.showtime_data.start_time).toLocaleTimeString()}
                          </p>
                          <p className="text-zinc-400">Room: {reservation.showtime_data.room.name}</p>
                          <p className="text-zinc-400">Seat: {reservation.seat_data.seat_number}</p>
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
                    </motion.li>
                  ))}
                </motion.ul>
              ) : (
                <p className="text-zinc-400">You have no reservations yet.</p>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}       

