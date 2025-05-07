import { useState, useEffect } from "react";
import { getMovies } from "@/api/services/movieService";
import { getCategories } from "@/api/services/getCategories";
import { Movie } from "@/interfaces/movie";
import { Category } from "@/interfaces/category";
import { Search, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

export const MovieCatalog = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 8;
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);

  // Filtros
  const [category, setCategory] = useState("all");
  const [rating, setRating] = useState("all");
  const [search, setSearch] = useState("");
  const [appliedCategory, setAppliedCategory] = useState("all");
  const [appliedRating, setAppliedRating] = useState("all");
  const [appliedSearch, setAppliedSearch] = useState("");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await getMovies();
        setMovies(data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchMovies();
    fetchCategories();
  }, []);

  // Helper para obtener el nombre de la categoría para DISPLAY
  const getDisplayCategoryName = (categoryIdentifier: string | number) => {
    const catById = categories.find(
      (c) => String(c.id) === String(categoryIdentifier)
    );
    if (catById) {
      return catById.name;
    }
    return String(categoryIdentifier);
  };

  // Helper para verificar si una película coincide con la categoría seleccionada
  const matchesSelectedCategory = (movie: Movie): boolean => {
    if (appliedCategory === "all") {
      return true;
    }

    // Si movie.category es el ID
    if (String(movie.category) === appliedCategory) {
      return true;
    }

    // Si movie.category es el nombre
    const selectedCategory = categories.find(
      (cat) => String(cat.id) === appliedCategory
    );
    if (selectedCategory && String(movie.category) === selectedCategory.name) {
      return true;
    }

    return false;
  };

  // Filtrado solo con los filtros aplicados
  const filteredMovies = movies.filter((movie) => {
    const matchesCategory = matchesSelectedCategory(movie);

    const normalizeRating = (rating: string) =>
      rating.toLowerCase().replace("-", "");
    const matchesRating =
      appliedRating === "all" ||
      normalizeRating(String(movie.rating)) === normalizeRating(appliedRating);
    const matchesSearch =
      appliedSearch.trim() === "" ||
      movie.title.toLowerCase().includes(appliedSearch.toLowerCase());
    return matchesCategory && matchesRating && matchesSearch;
  });

  // Paginación
  const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = filteredMovies.slice(
    indexOfFirstMovie,
    indexOfLastMovie
  );

  // Handle pagination
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Para propósitos de depuración
  const logFilterData = () => {
    console.log("Categoría seleccionada:", appliedCategory);
    console.log("Categorías disponibles:", categories);

    if (appliedCategory !== "all") {
      const selectedCatObj = categories.find(
        (c) => String(c.id) === appliedCategory
      );
      console.log("Objeto de categoría seleccionada:", selectedCatObj);

      const matchingMovies = movies.filter((movie) =>
        matchesSelectedCategory(movie)
      );
      console.log(
        "Películas que coinciden con esta categoría:",
        matchingMovies
      );
    }
  };

  return (
    <div className="container mx-auto px-4">
      {/* Filter Section */}
      <section className="mb-12 mt-8">
        <Card className="bg-[#1E1E1E] border border-[#D4AF37]/30 shadow-lg shadow-black/20 cursor-pointer">
          <CardContent className="p-8">
            <h1 className="text-3xl md:text-4xl font-bold font-['Oswald'] text-center mb-8 text-white">
              Encuentra tu película
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[#E0E0E0] font-semibold font-['Montserrat'] text-sm flex items-center gap-2">
                  <Filter size={16} className="text-[#D4AF37]" />
                  Categoría
                </label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="bg-zinc-800 text-[#E0E0E0] font-['Montserrat'] border-zinc-700 hover:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all duration-200">
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700 text-[#E0E0E0]">
                    <SelectItem
                      value="all"
                      className="hover:bg-zinc-800 hover:text-[#D4AF37] transition-colors duration-200 rounded cursor-pointer"
                    >
                      Todas las Categorías
                    </SelectItem>
                    {categories.map((cat) => (
                      <SelectItem
                        key={cat.id}
                        value={String(cat.id)}
                        className="hover:bg-zinc-800 hover:text-[#D4AF37] transition-colors duration-200 rounded cursor-pointer"
                      >
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-[#E0E0E0] font-semibold font-['Montserrat'] text-sm flex items-center gap-2">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-[#D4AF37]"
                  >
                    <path
                      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Clasificación
                </label>
                <Select value={rating} onValueChange={setRating}>
                  <SelectTrigger className="bg-zinc-800 text-[#E0E0E0] font-['Montserrat'] border-zinc-700 hover:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all duration-200">
                    <SelectValue placeholder="Seleccionar clasificación" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700 text-[#E0E0E0]">
                    <SelectItem
                      value="all"
                      className="hover:bg-zinc-800 hover:text-[#D4AF37] transition-colors duration-200 rounded cursor-pointer"
                    >
                      Todas las Clasificaciones
                    </SelectItem>
                    <SelectItem
                      value="g"
                      className="hover:bg-zinc-800 hover:text-[#D4AF37] transition-colors duration-200 rounded cursor-pointer"
                    >
                      G
                    </SelectItem>
                    <SelectItem
                      value="pg"
                      className="hover:bg-zinc-800 hover:text-[#D4AF37] transition-colors duration-200 rounded cursor-pointer"
                    >
                      PG
                    </SelectItem>
                    <SelectItem
                      value="pg13"
                      className="hover:bg-zinc-800 hover:text-[#D4AF37] transition-colors duration-200 rounded cursor-pointer"
                    >
                      PG-13
                    </SelectItem>
                    <SelectItem
                      value="r"
                      className="hover:bg-zinc-800 hover:text-[#D4AF37] transition-colors duration-200 rounded cursor-pointer"
                    >
                      R
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-[#E0E0E0] font-semibold font-['Montserrat'] text-sm flex items-center gap-2">
                  <Search size={16} className="text-[#D4AF37]" />
                  Buscar
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#D4AF37] h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Buscar película..."
                    className="bg-zinc-800 text-[#E0E0E0] font-['Montserrat'] border-zinc-700 pl-10 hover:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all duration-200"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <Button
                className="bg-[#E50914] hover:bg-[#FF3333] text-white px-8 py-6 text-lg rounded-md font-['Montserrat'] font-semibold transition-all duration-300 hover:shadow-[0_0_15px_rgba(229,9,20,0.5)] hover:scale-105"
                onClick={() => {
                  setAppliedCategory(category);
                  setAppliedRating(rating);
                  setAppliedSearch(search);
                  setCurrentPage(1);
                  logFilterData(); // Solo para depuración
                }}
              >
                Aplicar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Movie Grid */}
      <section>
        <h2 className="text-2xl md:text-3xl font-bold font-['Oswald'] text-center mb-8 text-white">
          Películas Disponibles
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-full text-center text-white py-16">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#E50914] mb-4"></div>
              <p className="text-lg font-['Montserrat']">
                Cargando películas...
              </p>
            </div>
          ) : currentMovies.length === 0 ? (
            <div className="col-span-full text-center text-white py-16">
              <p className="text-lg font-['Montserrat']">
                No se encontraron películas.
              </p>
            </div>
          ) : (
            currentMovies.map((movie) => (
              <Link key={movie.id} to={`/movies/${movie.id}`} className="block h-full">
                <Card className="bg-[#1E1E1E] border border-zinc-800 hover:border-[#D4AF37]/30 overflow-hidden transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/20 flex flex-col h-full">
                  <div className="aspect-[2/3] relative border-b border-[#D4AF37]/30">
                    <img
                      src={movie.poster || "/placeholder.svg"}
                      alt={movie.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <CardContent className="p-4 text-center flex flex-col flex-grow justify-between">
                    <div>
                      <h3 className="text-xl font-semibold font-['Montserrat'] text-white mb-2 line-clamp-2 h-14">
                        {movie.title}
                      </h3>
                      <p className="text-sm text-[#E0E0E0] font-['Open_Sans'] mb-4">
                        {getDisplayCategoryName(movie.category)} |{" "}
                        {movie.duration}
                      </p>
                    </div>
                    <Button
                      className="w-full bg-[#E50914] hover:bg-[#FF3333] text-white transition-all duration-200"
                      onClick={(e) => e.preventDefault()}
                    >
                      Ver Detalles
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-12 gap-4">
            <Button
              variant="ghost"
              onClick={prevPage}
              disabled={currentPage === 1}
              className="bg-zinc-800 border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10 hover:text-white transition-all duration-200 rounded-lg shadow-sm px-5 py-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <span className="text-[#E0E0E0] font-['Montserrat'] text-lg">
              {currentPage} de {totalPages}
            </span>

            <Button
              variant="ghost"
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="bg-zinc-800 border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10 hover:text-white transition-all duration-200 rounded-lg shadow-sm px-5 py-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        )}
      </section>
    </div>
  );
};
