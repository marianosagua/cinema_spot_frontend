import { useState, useEffect } from "react";
import {
  getMovies,
  createMovie,
  updateMovie,
  deleteMovie,
} from "@/api/services/movieService";
import { Movie, Rating } from "@/interfaces/movie";
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
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const initialMovie: Partial<Movie> = {
  title: "",
  description: "",
  poster: "",
  category: "",
  duration: "",
  banner: "",
  synopsis: "",
  trailer: "",
  director: "",
  rating: Rating.G,
  review: "",
};

export const MoviesAdmin = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentMovie, setCurrentMovie] =
    useState<Partial<Movie>>(initialMovie);
  const [openDetails, setOpenDetails] = useState(false);
  const [detailsMovie, setDetailsMovie] = useState<Movie | null>(null);

  const fetchMovies = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMovies();
      setMovies(data);
    } catch {
      setError("Error al cargar películas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleOpenCreate = () => {
    setEditMode(false);
    setCurrentMovie(initialMovie);
    setOpenDialog(true);
  };

  const handleOpenEdit = (movie: Movie) => {
    setEditMode(true);
    setCurrentMovie(movie);
    setOpenDialog(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCurrentMovie({ ...currentMovie, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value: string, name: string) => {
    setCurrentMovie({ ...currentMovie, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (editMode && currentMovie.id) {
        await updateMovie(currentMovie.id, currentMovie);
      } else {
        await createMovie(currentMovie);
      }
      fetchMovies();
      setOpenDialog(false);
    } catch {
      setError("Error al guardar la película");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta película?")) return;
    setLoading(true);
    setError(null);
    try {
      await deleteMovie(id);
      fetchMovies();
    } catch {
      setError("Error al eliminar la película");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetails = (movie: Movie) => {
    setDetailsMovie(movie);
    setOpenDetails(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
        <h2 className="text-2xl font-bold text-white">Películas</h2>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <button
              className="bg-gradient-to-r from-[#E50914] via-[#FF3333] to-[#E50914] text-white font-bold px-6 py-2 rounded-lg shadow-md hover:scale-105 transition-all duration-200 border-2 border-[#E50914] hover:border-[#FF3333]"
              onClick={handleOpenCreate}
            >
              + Nueva Película
            </button>
          </DialogTrigger>
          <DialogContent className="bg-[#181818] text-white rounded-2xl shadow-2xl border border-[#333]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-[#FFD700] mb-2">
                {editMode ? "Editar Película" : "Nueva Película"}
              </DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-[#FFD700]">Título</Label>
                  <Input
                    className="bg-[#232323] text-white"
                    name="title"
                    value={currentMovie.title || ""}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label className="text-[#FFD700]">Categoría</Label>
                  <Input
                    className="bg-[#232323] text-white"
                    name="category"
                    value={currentMovie.category || ""}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label className="text-[#FFD700]">Duración</Label>
                  <Input
                    className="bg-[#232323] text-white"
                    name="duration"
                    value={currentMovie.duration || ""}
                    onChange={handleChange}
                    placeholder="Ej: 2h 30m"
                  />
                </div>
                <div>
                  <Label className="text-[#FFD700]">Director</Label>
                  <Input
                    className="bg-[#232323] text-white"
                    name="director"
                    value={currentMovie.director || ""}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label className="text-[#FFD700]">Rating</Label>
                  <Select
                    value={currentMovie.rating || Rating.G}
                    onValueChange={(v) => handleSelectChange(v, "rating")}
                  >
                    <SelectTrigger className="bg-[#232323] text-white">
                      <SelectValue placeholder="Selecciona un rating" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#232323] text-white">
                      {Object.values(Rating).map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-[#FFD700]">Poster (URL)</Label>
                  <Input
                    className="bg-[#232323] text-white"
                    name="poster"
                    value={currentMovie.poster || ""}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label className="text-[#FFD700]">Banner (URL)</Label>
                  <Input
                    className="bg-[#232323] text-white"
                    name="banner"
                    value={currentMovie.banner || ""}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label className="text-[#FFD700]">Trailer (URL)</Label>
                  <Input
                    className="bg-[#232323] text-white"
                    name="trailer"
                    value={currentMovie.trailer || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <Label className="text-[#FFD700]">Descripción</Label>
                <textarea
                  name="description"
                  value={currentMovie.description || ""}
                  onChange={handleChange}
                  className="w-full rounded-md border border-input bg-[#232323] text-white px-3 py-2 text-base shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FFD700]"
                  rows={2}
                />
              </div>
              <div>
                <Label className="text-[#FFD700]">Sinopsis</Label>
                <textarea
                  name="synopsis"
                  value={currentMovie.synopsis || ""}
                  onChange={handleChange}
                  className="w-full rounded-md border border-input bg-[#232323] text-white px-3 py-2 text-base shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FFD700]"
                  rows={2}
                />
              </div>
              <div>
                <Label className="text-[#FFD700]">Review</Label>
                <textarea
                  name="review"
                  value={currentMovie.review || ""}
                  onChange={handleChange}
                  className="w-full rounded-md border border-input bg-[#232323] text-white px-3 py-2 text-base shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FFD700]"
                  rows={2}
                />
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
              <th className="py-3 px-4 text-left">Título</th>
              <th className="py-3 px-4 text-left">Categoría</th>
              <th className="py-3 px-4 text-left">Duración</th>
              <th className="py-3 px-4 text-left">Director</th>
              <th className="py-3 px-4 text-left">Rating</th>
              <th className="py-3 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((movie) => (
              <tr
                key={movie.id}
                className="border-b border-[#333] hover:bg-[#292929] transition-all"
              >
                <td className="py-3 px-4 text-white font-semibold">
                  {movie.title}
                </td>
                <td className="py-3 px-4 text-gray-300">{movie.category}</td>
                <td className="py-3 px-4 text-gray-300">{movie.duration}</td>
                <td className="py-3 px-4 text-gray-300">{movie.director}</td>
                <td className="py-3 px-4 text-gray-300">{movie.rating}</td>
                <td className="py-3 px-4 text-center flex gap-2 justify-center">
                  <button
                    className="bg-blue-500 text-white font-bold px-4 py-1 rounded hover:bg-blue-600 transition-all"
                    onClick={() => handleOpenDetails(movie)}
                  >
                    Ver detalles
                  </button>
                  <button
                    className="bg-[#FFD700] text-[#181818] font-bold px-4 py-1 rounded hover:bg-yellow-400 transition-all"
                    onClick={() => handleOpenEdit(movie)}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-[#E50914] text-white font-bold px-4 py-1 rounded hover:bg-[#b0060f] transition-all"
                    onClick={() => handleDelete(movie.id)}
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
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="bg-[#232323] rounded-xl p-4 shadow flex flex-col gap-2"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#FFD700] font-bold">{movie.title}</span>
              <span className="text-gray-400 text-sm">{movie.rating}</span>
            </div>
            <div className="text-gray-300 mb-2">
              Categoría:{" "}
              <span className="font-semibold text-white">{movie.category}</span>
            </div>
            <div className="text-gray-300 mb-2">
              Duración:{" "}
              <span className="font-semibold text-white">{movie.duration}</span>
            </div>
            <div className="text-gray-300 mb-2">
              Director:{" "}
              <span className="font-semibold text-white">{movie.director}</span>
            </div>
            <div className="flex gap-2 mt-2">
              <button
                className="flex-1 bg-blue-500 text-white font-bold py-2 rounded hover:bg-blue-600 transition-all"
                onClick={() => handleOpenDetails(movie)}
              >
                Ver detalles
              </button>
              <button
                className="flex-1 bg-[#FFD700] text-[#181818] font-bold py-2 rounded hover:bg-yellow-400 transition-all"
                onClick={() => handleOpenEdit(movie)}
              >
                Editar
              </button>
              <button
                className="flex-1 bg-[#E50914] text-white font-bold py-2 rounded hover:bg-[#b0060f] transition-all"
                onClick={() => handleDelete(movie.id)}
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
              Detalles de la Película
            </DialogTitle>
          </DialogHeader>
          {detailsMovie && (
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0 w-full md:w-1/3 flex flex-col items-center">
                {detailsMovie.poster && (
                  <img
                    src={detailsMovie.poster}
                    alt={detailsMovie.title}
                    className="rounded-lg w-full object-cover max-h-64 mb-4 border-2 border-[#FFD700] shadow-lg"
                  />
                )}
                {detailsMovie.banner && (
                  <img
                    src={detailsMovie.banner}
                    alt={detailsMovie.title + " banner"}
                    className="rounded-lg w-full object-cover max-h-32 mb-2 border border-[#333]"
                  />
                )}
                <span className="text-[#FFD700] font-bold text-lg mt-2">
                  {detailsMovie.title}
                </span>
                <span className="text-gray-300 text-sm">
                  {detailsMovie.category}
                </span>
                <span className="text-gray-400 text-sm">
                  Duración:{" "}
                  <span className="text-white font-semibold">
                    {detailsMovie.duration}
                  </span>
                </span>
                <span className="text-gray-400 text-sm">
                  Director:{" "}
                  <span className="text-white font-semibold">
                    {detailsMovie.director}
                  </span>
                </span>
                <span className="text-gray-400 text-sm">
                  Rating:{" "}
                  <span className="text-white font-semibold">
                    {detailsMovie.rating}
                  </span>
                </span>
                {detailsMovie.trailer && (
                  <a
                    href={detailsMovie.trailer}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-blue-400 mt-2"
                  >
                    Ver trailer
                  </a>
                )}
              </div>
              <div className="flex-1 flex flex-col gap-4">
                <div>
                  <span className="text-[#FFD700] font-semibold">
                    Descripción:
                  </span>
                  <p className="text-gray-200 text-base mt-1 mb-2 bg-[#232323] rounded p-2 shadow-inner">
                    {detailsMovie.description}
                  </p>
                </div>
                <div>
                  <span className="text-[#FFD700] font-semibold">
                    Sinopsis:
                  </span>
                  <p className="text-gray-200 text-base mt-1 mb-2 bg-[#232323] rounded p-2 shadow-inner">
                    {detailsMovie.synopsis}
                  </p>
                </div>
                <div>
                  <span className="text-[#FFD700] font-semibold">Review:</span>
                  <p className="text-gray-200 text-base mt-1 mb-2 bg-[#232323] rounded p-2 shadow-inner">
                    {detailsMovie.review}
                  </p>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    className="bg-[#FFD700] text-[#181818] font-bold px-4 py-1 rounded hover:bg-yellow-400 transition-all"
                    onClick={() => {
                      setOpenDetails(false);
                      handleOpenEdit(detailsMovie);
                    }}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-[#E50914] text-white font-bold px-4 py-1 rounded hover:bg-[#b0060f] transition-all"
                    onClick={() => {
                      setOpenDetails(false);
                      handleDelete(detailsMovie.id);
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
