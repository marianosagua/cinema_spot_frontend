import type React from "react";
import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import HomePageLogo from "../images/HomePageLogo.png";
import { Movie } from "@/interfaces/movie";
import { FutureRelease } from "@/interfaces/futureRelease";
import { getFutureMovies, getMovies } from "@/api/services";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export const HomePage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [upcomingMovies, setupcomingMovies] = useState<FutureRelease[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const movies = await getMovies();
        setFeaturedMovies(movies);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    const fetchUpcomingMovies = async () => {
      try {
        const movies = await getFutureMovies();
        setupcomingMovies(movies);
      } catch (error) {
        console.error("Error fetching upcoming movies:", error);
      }
    };

    fetchMovies();
    fetchUpcomingMovies();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredMovies.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [featuredMovies.length]);

  const handleBookingNow = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };

  // Función para formatear fecha a string legible
  const formatDate = (date: Date | string) => {
    if (!date) return "-";
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen -mt-24 flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img
            src={HomePageLogo}
            alt="Sala de cine"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
        <div className="container mx-auto px-4 z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold font-oswald mb-4 tracking-wide">
            Bienvenido a CinemaSpot
          </h1>
          <p className="text-xl md:text-2xl text-[#E0E0E0] mb-8 font-montserrat max-w-2xl mx-auto">
            Reserva tus entradas para las mejores películas de la ciudad y
            disfruta de una experiencia cinematográfica inolvidable
          </p>
          <Link to="/movies">
            <Button className="bg-[#E50914] hover:bg-[#FF3333] text-white text-lg px-8 py-6">
              Explorar Películas
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Movies */}
      <section className="py-16 bg-[#121212]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold font-oswald text-center mb-12">
            En Cartelera
          </h2>

          {/* Desktop View */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredMovies.map((movie: Movie) => (
              <div
                key={movie.id}
                className="group relative bg-[#1E1E1E] rounded-lg overflow-hidden transition-transform hover:scale-105 flex flex-col cursor-pointer"
              >
                <div className="aspect-[2/3] relative">
                  <img
                    src={movie.poster || "/placeholder.svg"}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold font-montserrat text-white">
                      {movie.title}
                    </h3>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-[#D4AF37] mr-1" />
                      <span className="text-sm text-[#E0E0E0]">
                        {movie.review}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-[#E0E0E0] font-openSans mb-4 line-clamp-3">
                    {movie.description}
                  </p>
                  <Button
                    onClick={() => handleBookingNow(movie.id)}
                    className="w-full bg-[#E50914] hover:bg-[#E50914]/90 text-white mt-auto"
                  >
                    Reservar Ahora
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile View - Carousel */}
          <div className="md:hidden relative">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {featuredMovies.map((movie: Movie) => (
                  <div key={movie.id} className="w-full flex-shrink-0 px-4">
                    <div className="bg-[#1E1E1E] rounded-lg overflow-hidden flex flex-col">
                      <div className="aspect-[2/3] relative h-[300px]">
                        <img
                          src={movie.banner || "/placeholder.svg"}
                          alt={movie.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4 flex flex-col flex-grow">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-semibold font-montserrat text-white">
                            {movie.title}
                          </h3>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-[#D4AF37] mr-1" />
                            <span className="text-sm text-[#E0E0E0]">
                              {movie.rating}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-[#E0E0E0] font-openSans mb-4 line-clamp-3">
                          {movie.description}
                        </p>
                        <Button
                          onClick={() => handleBookingNow(movie.id)}
                          className="w-full bg-[#E50914] hover:bg-[#E50914]/90 text-white mt-auto"
                        >
                          Reservar Ahora
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center mt-4 gap-2">
              {featuredMovies.map((_, index) => (
                <button
                  key={index}
                  className={`h-2 w-2 rounded-full ${
                    currentSlide === index ? "bg-[#E50914]" : "bg-gray-600"
                  }`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Releases */}
      <section className="py-16 bg-[#0A0A0A]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold font-oswald text-center mb-12">
            Próximos Estrenos
          </h2>

          {/* Desktop View */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
            {upcomingMovies.map((movie: FutureRelease) => (
              <div
                key={movie.id}
                className="group relative bg-[#1E1E1E] rounded-lg overflow-hidden transition-transform hover:scale-105 flex flex-col"
              >
                <div className="aspect-[2/3] relative">
                  <img
                    src={movie.poster || "/placeholder.svg"}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-xl font-semibold font-montserrat text-white mb-2">
                    {movie.title}
                  </h3>
                  <p className="text-sm text-[#D4AF37] font-openSans mb-4">
                    Estreno: {formatDate(movie.release_date)}
                  </p>
                  <Button
                    variant="outline"
                    className="w-full border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#121212] mt-auto bg-black"
                    onClick={() => handleBookingNow(movie.id)}
                  >
                    Ver Detalles
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile View - Carousel */}
          <div className="md:hidden relative">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {upcomingMovies.map((movie: FutureRelease) => (
                  <div key={movie.id} className="w-full flex-shrink-0 px-4">
                    <div className="bg-[#1E1E1E] rounded-lg overflow-hidden flex flex-col">
                      <div className="aspect-[2/3] relative h-[300px]">
                        <img
                          src={movie.banner || "/placeholder.svg"}
                          alt={movie.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4 flex flex-col flex-grow">
                        <h3 className="text-xl font-semibold font-montserrat text-white mb-2">
                          {movie.title}
                        </h3>
                        <p className="text-sm text-[#D4AF37] font-openSans mb-4">
                          Estreno: {formatDate(movie.release_date)}
                        </p>
                        <Button
                          variant="outline"
                          className="w-full border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#121212] mt-auto bg-black"
                          onClick={() => handleBookingNow(movie.id)}
                        >
                          Ver Detalles
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center mt-4 gap-2">
              {upcomingMovies.map((_, index) => (
                <button
                  key={index}
                  className={`h-2 w-2 rounded-full ${
                    currentSlide === index ? "bg-[#E50914]" : "bg-gray-600"
                  }`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
