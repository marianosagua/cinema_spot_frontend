import { useState, useEffect } from "react";
import {
  getRooms,
  createRoom,
  updateRoom,
  deleteRoom,
} from "@/api/services/roomService";
import { Room } from "@/interfaces/movie";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const initialRoom: Partial<Room> = {
  id: "",
  name: undefined,
};

export const RoomsAdmin = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<Partial<Room>>(initialRoom);
  const [openDetails, setOpenDetails] = useState(false);
  const [detailsRoom, setDetailsRoom] = useState<Room | null>(null);

  const fetchRooms = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRooms();
      setRooms(data);
    } catch {
      setError("Error al cargar salas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleOpenCreate = () => {
    setEditMode(false);
    setCurrentRoom(initialRoom);
    setOpenDialog(true);
  };

  const handleOpenEdit = (room: Room) => {
    setEditMode(true);
    setCurrentRoom(room);
    setOpenDialog(true);
  };

  const handleOpenDetails = (room: Room) => {
    setDetailsRoom(room);
    setOpenDetails(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setCurrentRoom({ ...currentRoom, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (editMode && currentRoom.id) {
        await updateRoom(currentRoom.id, currentRoom as Room);
      } else {
        await createRoom(currentRoom as Room);
      }
      fetchRooms();
      setOpenDialog(false);
    } catch {
      setError("Error al guardar la sala");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta sala?")) return;
    setLoading(true);
    setError(null);
    try {
      await deleteRoom(id);
      fetchRooms();
    } catch {
      setError("Error al eliminar la sala");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
        <h2 className="text-2xl font-bold text-white">Salas de Cine</h2>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <button
              className="bg-gradient-to-r from-[#E50914] via-[#FF3333] to-[#E50914] text-white font-bold px-6 py-2 rounded-lg shadow-md hover:scale-105 transition-all duration-200 border-2 border-[#E50914] hover:border-[#FF3333]"
              onClick={handleOpenCreate}
            >
              + Nueva Sala
            </button>
          </DialogTrigger>
          <DialogContent className="bg-[#181818] text-white rounded-2xl shadow-2xl border border-[#333]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-[#FFD700] mb-2">
                {editMode ? "Editar Sala" : "Nueva Sala"}
              </DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <Label className="text-[#FFD700]">Nombre</Label>
                <select
                  name="name"
                  value={currentRoom.name || ""}
                  onChange={handleChange}
                  className="w-full rounded-md border border-input bg-[#232323] text-white px-3 py-2 text-base shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FFD700]"
                  required
                >
                  <option value="">Selecciona una sala</option>
                  <option value="A1">A1</option>
                  <option value="B1">B1</option>
                  <option value="C1">C1</option>
                </select>
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
              <th className="py-3 px-4 text-left">Nombre</th>
              <th className="py-3 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr
                key={room.id}
                className="border-b border-[#333] hover:bg-[#292929] transition-all"
              >
                <td className="py-3 px-4 text-white font-semibold">
                  {room.id}
                </td>
                <td className="py-3 px-4 text-gray-300">{room.name}</td>
                <td className="py-3 px-4 text-center flex gap-2 justify-center">
                  <button
                    className="bg-blue-500 text-white font-bold px-4 py-1 rounded hover:bg-blue-600 transition-all"
                    onClick={() => handleOpenDetails(room)}
                  >
                    Ver detalles
                  </button>
                  <button
                    className="bg-[#FFD700] text-[#181818] font-bold px-4 py-1 rounded hover:bg-yellow-400 transition-all"
                    onClick={() => handleOpenEdit(room)}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-[#E50914] text-white font-bold px-4 py-1 rounded hover:bg-[#b0060f] transition-all"
                    onClick={() => handleDelete(room.id)}
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
        {rooms.map((room) => (
          <div
            key={room.id}
            className="bg-[#232323] rounded-xl p-4 shadow flex flex-col gap-2"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#FFD700] font-bold">{room.name}</span>
              <span className="text-gray-400 text-sm">ID: {room.id}</span>
            </div>
            <div className="flex gap-2 mt-2">
              <button
                className="flex-1 bg-blue-500 text-white font-bold py-2 rounded hover:bg-blue-600 transition-all"
                onClick={() => handleOpenDetails(room)}
              >
                Ver detalles
              </button>
              <button
                className="flex-1 bg-[#FFD700] text-[#181818] font-bold py-2 rounded hover:bg-yellow-400 transition-all"
                onClick={() => handleOpenEdit(room)}
              >
                Editar
              </button>
              <button
                className="flex-1 bg-[#E50914] text-white font-bold py-2 rounded hover:bg-[#b0060f] transition-all"
                onClick={() => handleDelete(room.id)}
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
              Detalles de la Sala
            </DialogTitle>
          </DialogHeader>
          {detailsRoom && (
            <div className="flex flex-col gap-4 items-center">
              <span className="text-[#FFD700] font-bold text-lg">
                {detailsRoom.name}
              </span>
              <span className="text-gray-400 text-sm">
                ID: {detailsRoom.id}
              </span>
              <div className="flex gap-2 mt-4">
                <button
                  className="bg-[#FFD700] text-[#181818] font-bold px-4 py-1 rounded hover:bg-yellow-400 transition-all"
                  onClick={() => {
                    setOpenDetails(false);
                    handleOpenEdit(detailsRoom);
                  }}
                >
                  Editar
                </button>
                <button
                  className="bg-[#E50914] text-white font-bold px-4 py-1 rounded hover:bg-[#b0060f] transition-all"
                  onClick={() => {
                    setOpenDetails(false);
                    handleDelete(detailsRoom.id);
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