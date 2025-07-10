import { useState, useEffect } from "react";
import {
  getActors,
  createActor,
  updateActor,
  deleteActor,
} from "@/api/services/actorsService";
import { Actor, Nationality } from "@/interfaces/actor";
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

const initialActor: Partial<Actor> = {
  id: 0,
  first_name: "",
  last_name: "",
  age: 0,
  nationality: Nationality.Estadounidense,
};

export const ActorsAdmin = () => {
  const [actors, setActors] = useState<Actor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentActor, setCurrentActor] =
    useState<Partial<Actor>>(initialActor);
  const [openDetails, setOpenDetails] = useState(false);
  const [detailsActor, setDetailsActor] = useState<Actor | null>(null);
  const [openAllActors, setOpenAllActors] = useState(false);
  const { token } = useAuthStore();

  const fetchActors = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getActors(token);
      setActors(data);
    } catch {
      setError("Error al cargar actores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActors();
  }, []);

  const handleOpenCreate = () => {
    setEditMode(false);
    setCurrentActor(initialActor);
    setOpenDialog(true);
  };

  const handleOpenEdit = (actor: Actor) => {
    setEditMode(true);
    setCurrentActor(actor);
    setOpenDialog(true);
  };

  const handleOpenDetails = (actor: Actor) => {
    setDetailsActor(actor);
    setOpenDetails(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "age") {
      setCurrentActor({ ...currentActor, [name]: parseInt(value) });
    } else {
      setCurrentActor({ ...currentActor, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (editMode && currentActor.id) {
        await updateActor(currentActor.id, currentActor, token);
      } else {
        await createActor(currentActor, token);
      }
      fetchActors();
      setOpenDialog(false);
    } catch {
      setError("Error al guardar el actor");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (actorId: number) => {
    if (!window.confirm("¿Seguro que deseas eliminar este actor?")) return;
    setLoading(true);
    setError(null);
    try {
      await deleteActor(actorId, token);
      fetchActors();
    } catch {
      setError("Error al eliminar el actor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
        <h2 className="text-2xl font-bold text-white">Actores</h2>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <button
              className="bg-gradient-to-r from-[#E50914] via-[#FF3333] to-[#E50914] text-white font-bold px-6 py-2 rounded-lg shadow-md hover:scale-105 transition-all duration-200 border-2 border-[#E50914] hover:border-[#FF3333]"
              onClick={handleOpenCreate}
            >
              + Nuevo Actor
            </button>
          </DialogTrigger>
          <DialogContent className="bg-[#181818] text-white rounded-2xl shadow-2xl border border-[#333]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-[#FFD700] mb-2">
                {editMode ? "Editar Actor" : "Nuevo Actor"}
              </DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-[#FFD700]">Nombre</Label>
                  <Input
                    className="bg-[#232323] text-white"
                    name="first_name"
                    value={currentActor.first_name || ""}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label className="text-[#FFD700]">Apellido</Label>
                  <Input
                    className="bg-[#232323] text-white"
                    name="last_name"
                    value={currentActor.last_name || ""}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label className="text-[#FFD700]">Edad</Label>
                  <Input
                    className="bg-[#232323] text-white"
                    name="age"
                    type="number"
                    value={currentActor.age || ""}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label className="text-[#FFD700]">Nacionalidad</Label>
                  <select
                    name="nationality"
                    value={currentActor.nationality || ""}
                    onChange={handleChange}
                    className="w-full rounded-md border border-input bg-[#232323] text-white px-3 py-2 text-base shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FFD700]"
                    required
                  >
                    <option value="">Selecciona una nacionalidad</option>
                    {Object.values(Nationality).map((nationality) => (
                      <option key={nationality} value={nationality}>
                        {nationality}
                      </option>
                    ))}
                  </select>
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
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {/* Tabla para pantallas medianas y grandes */}
      <div className="hidden md:block rounded-lg shadow-inner">
        <table className="min-w-full bg-[#232323] rounded-lg">
          <thead>
            <tr className="text-[#FFD700] text-lg">
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Nombre</th>
              <th className="py-3 px-4 text-left">Apellido</th>
              <th className="py-3 px-4 text-left">Edad</th>
              <th className="py-3 px-4 text-left">Nacionalidad</th>
              <th className="py-3 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {actors.slice(0, 20).map((actor) => (
              <tr
                key={actor.id}
                className="border-b border-[#333] hover:bg-[#292929] transition-all"
              >
                <td className="py-3 px-4 text-white font-semibold">
                  {actor.id}
                </td>
                <td className="py-3 px-4 text-gray-300">{actor.first_name}</td>
                <td className="py-3 px-4 text-gray-300">{actor.last_name}</td>
                <td className="py-3 px-4 text-gray-300">{actor.age}</td>
                <td className="py-3 px-4 text-gray-300">{actor.nationality}</td>
                <td className="py-3 px-4 text-center flex gap-2 justify-center">
                  <button
                    className="bg-blue-500 text-white font-bold px-4 py-1 rounded hover:bg-blue-600 transition-all"
                    onClick={() => handleOpenDetails(actor)}
                  >
                    Ver detalles
                  </button>
                  <button
                    className="bg-[#FFD700] text-[#181818] font-bold px-4 py-1 rounded hover:bg-yellow-400 transition-all"
                    onClick={() => handleOpenEdit(actor)}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-[#E50914] text-white font-bold px-4 py-1 rounded hover:bg-[#b0060f] transition-all"
                    onClick={() => handleDelete(actor.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {actors.length > 20 && (
          <div className="flex justify-center p-4">
            <button
              className="bg-gradient-to-r from-[#E50914] via-[#FF3333] to-[#E50914] text-white font-bold px-6 py-3 rounded-lg shadow-md hover:scale-105 transition-all duration-200 border-2 border-[#E50914] hover:border-[#FF3333]"
              onClick={() => setOpenAllActors(true)}
            >
              Ver todos los actores ({actors.length})
            </button>
          </div>
        )}
      </div>
      {/* Cards para mobile */}
      <div className="md:hidden flex flex-col gap-4">
        {actors.slice(0, 20).map((actor) => (
          <div
            key={actor.id}
            className="bg-[#232323] rounded-xl p-4 shadow flex flex-col gap-2"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#FFD700] font-bold">{`${actor.first_name} ${actor.last_name}`}</span>
              <span className="text-gray-400 text-sm">ID: {actor.id}</span>
            </div>
            <div className="text-gray-300 mb-2">
              Edad:{" "}
              <span className="font-semibold text-white">{actor.age}</span>
            </div>
            <div className="text-gray-300 mb-2">
              Nacionalidad:{" "}
              <span className="font-semibold text-white">
                {actor.nationality}
              </span>
            </div>
            <div className="flex gap-2 mt-2">
              <button
                className="flex-1 bg-blue-500 text-white font-bold py-2 rounded hover:bg-blue-600 transition-all"
                onClick={() => handleOpenDetails(actor)}
              >
                Ver detalles
              </button>
              <button
                className="flex-1 bg-[#FFD700] text-[#181818] font-bold py-2 rounded hover:bg-yellow-400 transition-all"
                onClick={() => handleOpenEdit(actor)}
              >
                Editar
              </button>
              <button
                className="flex-1 bg-[#E50914] text-white font-bold py-2 rounded hover:bg-[#b0060f] transition-all"
                onClick={() => handleDelete(actor.id)}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
        {actors.length > 20 && (
          <div className="flex justify-center p-4">
            <button
              className="bg-gradient-to-r from-[#E50914] via-[#FF3333] to-[#E50914] text-white font-bold px-6 py-3 rounded-lg shadow-md hover:scale-105 transition-all duration-200 border-2 border-[#E50914] hover:border-[#FF3333]"
              onClick={() => setOpenAllActors(true)}
            >
              Ver todos los actores ({actors.length})
            </button>
          </div>
        )}
      </div>
      {/* Modal de detalles */}
      <Dialog open={openDetails} onOpenChange={setOpenDetails}>
        <DialogContent className="max-w-md bg-[#181818] text-white rounded-2xl shadow-2xl border border-[#333]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#FFD700] mb-2">
              Detalles del Actor
            </DialogTitle>
          </DialogHeader>
          {detailsActor && (
            <div className="flex flex-col gap-4 items-center">
              <span className="text-[#FFD700] font-bold text-lg">{`${detailsActor.first_name} ${detailsActor.last_name}`}</span>
              <span className="text-gray-400 text-sm">
                ID: {detailsActor.id}
              </span>
              <span className="text-gray-400 text-sm">
                Edad: {detailsActor.age}
              </span>
              <span className="text-gray-400 text-sm">
                Nacionalidad: {detailsActor.nationality}
              </span>
              <div className="flex gap-2 mt-4">
                <button
                  className="bg-[#FFD700] text-[#181818] font-bold px-4 py-1 rounded hover:bg-yellow-400 transition-all"
                  onClick={() => {
                    setOpenDetails(false);
                    handleOpenEdit(detailsActor);
                  }}
                >
                  Editar
                </button>
                <button
                  className="bg-[#E50914] text-white font-bold px-4 py-1 rounded hover:bg-[#b0060f] transition-all"
                  onClick={() => {
                    setOpenDetails(false);
                    handleDelete(detailsActor.id);
                  }}
                >
                  Eliminar
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal para ver todos los actores */}
      <Dialog open={openAllActors} onOpenChange={setOpenAllActors}>
        <DialogContent className="max-w-6xl max-h-[80vh] bg-[#181818] text-white rounded-2xl shadow-2xl border border-[#333] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#FFD700] mb-2">
              Todos los Actores ({actors.length})
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[60vh]">
            <table className="min-w-full bg-[#232323] rounded-lg">
              <thead className="sticky top-0 bg-[#232323]">
                <tr className="text-[#FFD700] text-lg">
                  <th className="py-3 px-4 text-left">ID</th>
                  <th className="py-3 px-4 text-left">Nombre</th>
                  <th className="py-3 px-4 text-left">Apellido</th>
                  <th className="py-3 px-4 text-left">Edad</th>
                  <th className="py-3 px-4 text-left">Nacionalidad</th>
                  <th className="py-3 px-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {actors.map((actor) => (
                  <tr
                    key={actor.id}
                    className="border-b border-[#333] hover:bg-[#292929] transition-all"
                  >
                    <td className="py-3 px-4 text-white font-semibold">
                      {actor.id}
                    </td>
                    <td className="py-3 px-4 text-gray-300">
                      {actor.first_name}
                    </td>
                    <td className="py-3 px-4 text-gray-300">
                      {actor.last_name}
                    </td>
                    <td className="py-3 px-4 text-gray-300">{actor.age}</td>
                    <td className="py-3 px-4 text-gray-300">
                      {actor.nationality}
                    </td>
                    <td className="py-3 px-4 text-center flex gap-2 justify-center">
                      <button
                        className="bg-blue-500 text-white font-bold px-4 py-1 rounded hover:bg-blue-600 transition-all"
                        onClick={() => {
                          setOpenAllActors(false);
                          handleOpenDetails(actor);
                        }}
                      >
                        Ver detalles
                      </button>
                      <button
                        className="bg-[#FFD700] text-[#181818] font-bold px-4 py-1 rounded hover:bg-yellow-400 transition-all"
                        onClick={() => {
                          setOpenAllActors(false);
                          handleOpenEdit(actor);
                        }}
                      >
                        Editar
                      </button>
                      <button
                        className="bg-[#E50914] text-white font-bold px-4 py-1 rounded hover:bg-[#b0060f] transition-all"
                        onClick={() => {
                          setOpenAllActors(false);
                          handleDelete(actor.id);
                        }}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="border-[#FFD700] text-[#FFD700] hover:bg-[#232323] hover:text-white"
              >
                Cerrar
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 