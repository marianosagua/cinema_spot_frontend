import { useState, useEffect } from "react";
import {
  getShowtimes,
  createShowtime,
  updateShowtime,
  deleteShowtime,
} from "@/api/services/showtimeService";
import { Showtime } from "@/interfaces/showtime";
import { Room as RoomType, Movie } from "@/interfaces/movie";
import { getMovies } from "@/api/services/movieService";
import { getRooms } from "@/api/services/roomService";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/hooks/useAuthStore";

const initialShowtime: Partial<Showtime> = {
  id: "",
  movie: "",
  start_time: "",
  end_time: "",
  room: undefined,
  is_full: false,
};

export const ShowtimesAdmin = () => {
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [movies, setMovies] = useState<{ id: string; title: string }[]>([]);
  const [rooms, setRooms] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentShowtime, setCurrentShowtime] =
    useState<Partial<Showtime>>(initialShowtime);
  const [openDetails, setOpenDetails] = useState(false);
  const [detailsShowtime, setDetailsShowtime] = useState<Showtime | null>(null);
  const { token } = useAuthStore();

  const fetchShowtimes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getShowtimes(token);
      setShowtimes(data);
    } catch {
      setError("Error al cargar funciones");
    } finally {
      setLoading(false);
    }
  };

  const fetchMoviesAndRooms = async () => {
    try {
      const moviesData: Movie[] = await getMovies();
      setMovies(moviesData.map((m) => ({ id: String(m.id), title: m.title })));
      const roomsData: RoomType[] = await getRooms();
      setRooms(roomsData.map((r) => ({ id: String(r.id), name: r.name })));
    } catch {
      // Puedes mostrar un toast o error si lo deseas
    }
  };

  useEffect(() => {
    fetchShowtimes();
    fetchMoviesAndRooms();
  }, []);

  const handleOpenCreate = () => {
    setEditMode(false);
    setCurrentShowtime(initialShowtime);
    setOpenDialog(true);
  };

  const handleOpenEdit = (showtime: Showtime) => {
    setEditMode(true);
    setCurrentShowtime(showtime);
    setOpenDialog(true);
  };

  const handleOpenDetails = (showtime: Showtime) => {
    setDetailsShowtime(showtime);
    setOpenDetails(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setCurrentShowtime({ ...currentShowtime, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentShowtime({
      ...currentShowtime,
      [e.target.name]: e.target.checked,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (editMode && currentShowtime.id) {
        await updateShowtime(currentShowtime.id, currentShowtime as Showtime);
      } else {
        await createShowtime(currentShowtime as Showtime);
      }
      fetchShowtimes();
      setOpenDialog(false);
    } catch {
      setError("Error al guardar la función");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta función?")) return;
    setLoading(true);
    setError(null);
    try {
      await deleteShowtime(id);
      fetchShowtimes();
    } catch {
      setError("Error al eliminar la función");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
        <h2 className="text-2xl font-bold text-white">Funciones</h2>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <button
              className="bg-gradient-to-r from-[#E50914] via-[#FF3333] to-[#E50914] text-white font-bold px-6 py-2 rounded-lg shadow-md hover:scale-105 transition-all duration-200 border-2 border-[#E50914] hover:border-[#FF3333]"
              onClick={handleOpenCreate}
            >
              + Nueva Función
            </button>
          </DialogTrigger>
          <DialogContent className="bg-[#181818] text-white rounded-2xl shadow-2xl border border-[#333]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-[#FFD700] mb-2">
                {editMode ? "Editar Función" : "Nueva Función"}
              </DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-[#FFD700]">Película</Label>
                  <select
                    name="movie"
                    value={currentShowtime.movie || ""}
                    onChange={handleChange}
                    className="w-full rounded-md border border-input bg-[#232323] text-white px-3 py-2 text-base shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FFD700]"
                    required
                  >
                    <option value="">Selecciona una película</option>
                    {movies.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label className="text-[#FFD700]">Sala</Label>
                  <select
                    name="room"
                    value={currentShowtime.room || ""}
                    onChange={handleChange}
                    className="w-full rounded-md border border-input bg-[#232323] text-white px-3 py-2 text-base shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FFD700]"
                    required
                  >
                    <option value="">Selecciona una sala</option>
                    {rooms.map((r) => (
                      <option key={r.id} value={r.name}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label className="text-[#FFD700]">Inicio</Label>
                  <Input
                    className="bg-[#232323] text-white"
                    name="start_time"
                    type="datetime-local"
                    value={currentShowtime.start_time || ""}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label className="text-[#FFD700]">Fin</Label>
                  <Input
                    className="bg-[#232323] text-white"
                    name="end_time"
                    type="datetime-local"
                    value={currentShowtime.end_time || ""}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    name="is_full"
                    checked={!!currentShowtime.is_full}
                    onChange={handleCheckboxChange}
                    className="accent-[#FFD700] w-5 h-5"
                  />
                  <Label className="text-[#FFD700]">¿Sala llena?</Label>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-[#FFD700] text-[#181818] font-bold hover:bg-yellow-400"
                >
                  {loading ? "Guardando..." : "Guardar"}
                </Button>
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-[#FFD700] text-[#FFD700] hover:bg-[#232323] hover:text-white"
                  >
                    Cancelar
                  </Button>
                </DialogClose>
              </DialogFooter>
              {error && (
                <div className="text-red-500 text-sm mt-2">{error}</div>
              )}
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {loading && <div className="text-gray-300 mb-4">Cargando...</div>}
      {/* Tabla para pantallas medianas y grandes */}
      <div className="hidden md:block rounded-lg shadow-inner">
        <table className="min-w-full bg-[#232323] rounded-lg">
          <thead>
            <tr className="text-[#FFD700] text-lg">
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Película</th>
              <th className="py-3 px-4 text-left">Sala</th>
              <th className="py-3 px-4 text-left">Inicio</th>
              <th className="py-3 px-4 text-left">Fin</th>
              <th className="py-3 px-4 text-left">Llena</th>
              <th className="py-3 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {showtimes.map((showtime) => (
              <tr
                key={showtime.id}
                className="border-b border-[#333] hover:bg-[#292929] transition-all"
              >
                <td className="py-3 px-4 text-white font-semibold">
                  {showtime.id}
                </td>
                <td className="py-3 px-4 text-gray-300">
                  {movies.find((m) => m.id === showtime.movie)?.title ||
                    showtime.movie}
                </td>
                <td className="py-3 px-4 text-gray-300">{showtime.room}</td>
                <td className="py-3 px-4 text-gray-300">
                  {showtime.start_time}
                </td>
                <td className="py-3 px-4 text-gray-300">{showtime.end_time}</td>
                <td className="py-3 px-4 text-gray-300">
                  {showtime.is_full ? "Sí" : "No"}
                </td>
                <td className="py-3 px-4 text-center flex gap-2 justify-center">
                  <button
                    className="bg-blue-500 text-white font-bold px-4 py-1 rounded hover:bg-blue-600 transition-all"
                    onClick={() => handleOpenDetails(showtime)}
                  >
                    Ver detalles
                  </button>
                  <button
                    className="bg-[#FFD700] text-[#181818] font-bold px-4 py-1 rounded hover:bg-yellow-400 transition-all"
                    onClick={() => handleOpenEdit(showtime)}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-[#E50914] text-white font-bold px-4 py-1 rounded hover:bg-[#b0060f] transition-all"
                    onClick={() => handleDelete(showtime.id)}
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
        {showtimes.map((showtime) => (
          <div
            key={showtime.id}
            className="bg-[#232323] rounded-xl p-4 shadow flex flex-col gap-2"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#FFD700] font-bold">
                {movies.find((m) => m.id === showtime.movie)?.title ||
                  showtime.movie}
              </span>
              <span className="text-gray-400 text-sm">
                Sala: {showtime.room}
              </span>
            </div>
            <div className="text-gray-300 mb-2">
              Inicio:{" "}
              <span className="font-semibold text-white">
                {showtime.start_time}
              </span>
            </div>
            <div className="text-gray-300 mb-2">
              Fin:{" "}
              <span className="font-semibold text-white">
                {showtime.end_time}
              </span>
            </div>
            <div className="text-gray-300 mb-2">
              Llena:{" "}
              <span className="font-semibold text-white">
                {showtime.is_full ? "Sí" : "No"}
              </span>
            </div>
            <div className="flex gap-2 mt-2">
              <button
                className="flex-1 bg-blue-500 text-white font-bold py-2 rounded hover:bg-blue-600 transition-all"
                onClick={() => handleOpenDetails(showtime)}
              >
                Ver detalles
              </button>
              <button
                className="flex-1 bg-[#FFD700] text-[#181818] font-bold py-2 rounded hover:bg-yellow-400 transition-all"
                onClick={() => handleOpenEdit(showtime)}
              >
                Editar
              </button>
              <button
                className="flex-1 bg-[#E50914] text-white font-bold py-2 rounded hover:bg-[#b0060f] transition-all"
                onClick={() => handleDelete(showtime.id)}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Modal de detalles */}
      <Dialog open={openDetails} onOpenChange={setOpenDetails}>
        <DialogContent className="max-w-md bg-[#181818] text-white rounded-2xl shadow-2xl border border-[#333]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#FFD700] mb-2">
              Detalles de la Función
            </DialogTitle>
          </DialogHeader>
          {detailsShowtime && (
            <div className="flex flex-col gap-4 items-center">
              <span className="text-[#FFD700] font-bold text-lg">
                {movies.find((m) => m.id === detailsShowtime.movie)?.title ||
                  detailsShowtime.movie}
              </span>
              <span className="text-gray-400 text-sm">
                Sala: {detailsShowtime.room}
              </span>
              <span className="text-gray-400 text-sm">
                Inicio: {detailsShowtime.start_time}
              </span>
              <span className="text-gray-400 text-sm">
                Fin: {detailsShowtime.end_time}
              </span>
              <span className="text-gray-400 text-sm">
                Llena: {detailsShowtime.is_full ? "Sí" : "No"}
              </span>
              <div className="flex gap-2 mt-4">
                <button
                  className="bg-[#FFD700] text-[#181818] font-bold px-4 py-1 rounded hover:bg-yellow-400 transition-all"
                  onClick={() => {
                    setOpenDetails(false);
                    handleOpenEdit(detailsShowtime);
                  }}
                >
                  Editar
                </button>
                <button
                  className="bg-[#E50914] text-white font-bold px-4 py-1 rounded hover:bg-[#b0060f] transition-all"
                  onClick={() => {
                    setOpenDetails(false);
                    handleDelete(detailsShowtime.id);
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