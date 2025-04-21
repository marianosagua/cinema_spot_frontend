import { useState, useEffect } from "react";
import { getMovies } from "@/api/services/movieService";
import { getCategories } from "@/api/services/getCategories";
import { Movie } from "@/interfaces/movie";
import { Category } from "@/interfaces/category";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
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
  // Asume que la entrada puede ser un ID (string/number) o ya un nombre (string)
  const getDisplayCategoryName = (categoryIdentifier: string | number) => {
    const catById = categories.find(
      (c) => String(c.id) === String(categoryIdentifier)
    );
    if (catById) {
      return catById.name; // Encontrado por ID, devuelve el nombre
    }
    // Si no se encuentra por ID, asume que categoryIdentifier ya es el nombre (o fallback)
    return String(categoryIdentifier);
  };

  // Filtrado solo con los filtros aplicados
  const filteredMovies = movies.filter((movie) => {
    // Compare movie category ID (assuming movie.category holds the ID) with the applied category ID
    const matchesCategory =
      appliedCategory === "all" || String(movie.category) === appliedCategory;

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

  return (
    <div className="container mx-auto px-4">
      {/* Filter Section */}
      <section className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold font-['Oswald'] text-center mb-8">
          Find your movie
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="bg-[#E0E0E0] text-black font-['Open_Sans']">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Input
              type="date"
              className="bg-[#E0E0E0] text-black font-['Open_Sans'] h-10"
              disabled
            />
          </div>

          <div>
            <Select value={rating} onValueChange={setRating}>
              <SelectTrigger className="bg-[#E0E0E0] text-black font-['Open_Sans']">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="g">G</SelectItem>
                <SelectItem value="pg">PG</SelectItem>
                <SelectItem value="pg13">PG-13</SelectItem>
                <SelectItem value="r">R</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input
              type="text"
              placeholder="Find movie..."
              className="bg-[#E0E0E0] text-black font-['Open_Sans'] pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-4 flex justify-center">
          <Button
            className="bg-[#E50914] hover:bg-[#FF3333] text-white px-8"
            onClick={() => {
              setAppliedCategory(category);
              setAppliedRating(rating);
              setAppliedSearch(search);
              setCurrentPage(1);
            }}
          >
            Apply
          </Button>
        </div>
      </section>

      {/* Movie Grid */}
      <section>
        <h2 className="text-2xl md:text-3xl font-bold font-['Oswald'] text-center mb-8">
          Available Movies
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-full text-center text-white">
              Loading movies...
            </div>
          ) : currentMovies.length === 0 ? (
            <div className="col-span-full text-center text-white">
              No movies found.
            </div>
          ) : (
            currentMovies.map((movie) => (
              <Link key={movie.id} to={`/movies/${movie.id}`} className="block">
                <Card className="bg-[#1E1E1E] border border-gray-800 overflow-hidden transition-transform hover:scale-105 hover:-translate-y-1">
                  <div className="aspect-[2/3] relative border-b border-[#D4AF37]/30">
                    <img
                      src={movie.poster || "/placeholder.svg"}
                      alt={movie.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <CardContent className="p-4 text-center">
                    <h3 className="text-xl font-semibold font-['Montserrat'] text-white mb-2">
                      {movie.title}
                    </h3>
                    <p className="text-sm text-[#E0E0E0] font-['Open_Sans'] mb-4">
                      {/* Usa el nuevo helper para mostrar el nombre de la categoría */}
                      {getDisplayCategoryName(movie.category)} |{" "}
                      {movie.duration}
                    </p>
                    <Button
                      className="w-full bg-[#E50914] hover:bg-[#FF3333] text-white"
                      onClick={(e) => e.preventDefault()}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 gap-4">
            <Button
              variant="ghost"
              onClick={prevPage}
              disabled={currentPage === 1}
              className="bg-cinema-background border border-cinema-accent/30 text-cinema-accent hover:bg-cinema-accent/10 hover:text-cinema-gold transition-colors duration-200 rounded-lg shadow-sm px-5 py-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <span className="text-cinema-textSecondary font-montserrat">
              {currentPage} de {totalPages}
            </span>

            <Button
              variant="ghost"
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="bg-cinema-background border border-cinema-accent/30 text-cinema-accent hover:bg-cinema-accent/10 hover:text-cinema-gold transition-colors duration-200 rounded-lg shadow-sm px-5 py-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </section>
    </div>
  );
};
