/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Play, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getMovie } from "@/api/services/movieService";
import { getCastByMovie } from "@/api/services/actorsService";
import { Movie, Rating, Showtime } from "@/interfaces";
import { Actor } from "@/interfaces/actor";

// Helper function to check if two dates are the same day
const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

// Helper function to format date for tabs
const formatDateTab = (date: Date): string => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (isSameDay(date, today)) return "Today";
  if (isSameDay(date, tomorrow)) return "Tomorrow";

  // Capitalize first letter of weekday name in English
  const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
  return weekday.charAt(0).toUpperCase() + weekday.slice(1);
};

// Helper function to format time
const formatTime = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch (e) {
    return "Invalid Time";
  }
};

export const MovieDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [showTrailer, setShowTrailer] = useState(false);
  const [selectedShowtimeId, setSelectedShowtimeId] = useState<string | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [movie, setMovie] = useState<Movie>({
    id: 0,
    title: "",
    description: "",
    poster: "",
    category: "",
    duration: "",
    banner: "",
    synopsis: "",
    trailer: "",
    director: "",
    rating: Rating.PG,
    review: "",
    showtimes: [],
  });
  const [cast, setCast] = useState<Actor[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchMovieDetails = async () => {
      try {
        const data = await getMovie(id);
        // Ensure showtimes are sorted by start_time
        const sortedShowtimes = data.showtimes.sort(
          (a: Showtime, b: Showtime) =>
            new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
        );
        setMovie({ ...data, showtimes: sortedShowtimes });

        // Set initial selected date if showtimes exist
        if (sortedShowtimes.length > 0) {
          setSelectedDate(new Date(sortedShowtimes[0].start_time));
        }
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    const fetchCast = async () => {
      try {
        if (id) {
          const castData = await getCastByMovie(id);
          // Si la API retorna un objeto con propiedad 'cast', usarla. Si es array directo, usarlo directo.
          const castArray = Array.isArray(castData)
            ? castData
            : castData.cast || [];
          setCast(castArray);
        }
      } catch (error) {
        console.error("Error fetching cast:", error);
        setCast([]);
      }
    };

    fetchMovieDetails();
    fetchCast();
  }, [id]);

  // Group showtimes by date and get unique dates
  const { showtimesByDate, availableDates } = useMemo(() => {
    const grouped: { [key: string]: Showtime[] } = {};
    const dates: Date[] = [];
    movie.showtimes.forEach((showtime) => {
      try {
        const date = new Date(showtime.start_time);
        const dateString = date.toDateString(); // Use date string as key
        if (!grouped[dateString]) {
          grouped[dateString] = [];
          dates.push(date);
        }
        grouped[dateString].push(showtime);
      } catch (e) {
        console.error("Invalid date in showtime:", showtime);
      }
    });
    // Sort dates chronologically
    dates.sort((a, b) => a.getTime() - b.getTime());
    return { showtimesByDate: grouped, availableDates: dates };
  }, [movie.showtimes]);

  const selectedShowtime = useMemo(() => {
    return movie.showtimes.find((st) => st.id === selectedShowtimeId) || null;
  }, [selectedShowtimeId, movie.showtimes]);

  // Toggle trailer visibility
  const toggleTrailer = () => {
    setShowTrailer(!showTrailer);
  };

  // Handle date selection
  const selectDate = (date: Date) => {
    setSelectedDate(date);
    setSelectedShowtimeId(null); // Reset time selection when date changes
  };

  // Handle showtime selection
  const selectShowtime = (showtimeId: string) => {
    setSelectedShowtimeId(showtimeId);
  };

  return (
    <>
      {/* Movie Hero Section */}
      <section className="relative -mt-24">
        <div className="absolute inset-0 z-0">
          <img
            src={movie.banner || "/placeholder.svg"}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>

        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Movie Poster */}
            <div className="hidden md:block w-64 flex-shrink-0">
              <div className="aspect-[2/3] relative rounded-lg overflow-hidden border-2 border-[#D4AF37]/30">
                <img
                  src={movie.poster || "/placeholder.svg"}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Movie Details */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-5xl font-bold font-oswald mb-2">
                {movie.title}
              </h1>
              <p className="text-xl md:text-2xl text-[#E0E0E0] mb-4 font-montserrat">
                {movie.description}
              </p>

              <div className="flex items-center gap-2 mb-6">
                <Badge className="bg-[#E50914] text-white">
                  {movie.category}
                </Badge>
                <span className="text-[#E0E0E0] font-openSans flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {parseInt(movie.duration.split(":")[0], 10)}h{" "}
                  {movie.duration.split(":")[1]}m
                </span>
                <span className="text-[#E0E0E0] font-openSans">
                  {movie.rating}
                </span>
              </div>

              <div className="flex flex-wrap gap-4 mb-8">
                <Button
                  variant="outline"
                  className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#121212] flex items-center gap-2 bg-black"
                  onClick={toggleTrailer}
                >
                  <Play className="h-4 w-4" />
                  {showTrailer ? "Hide Trailer" : "Watch Trailer"}
                </Button>
              </div>

              <div className="md:hidden">
                <h2 className="text-xl font-bold font-oswald mb-2">Synopsis</h2>
                <p className="text-[#E0E0E0] font-openSans mb-6 line-clamp-3">
                  {movie.synopsis}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trailer Section (Conditional) */}
      {showTrailer && (
        <section className="bg-[#1E1E1E] py-8">
          <div className="container mx-auto px-4">
            <div className="aspect-video relative rounded-lg overflow-hidden border-2 border-[#D4AF37]/30">
              <iframe
                src={movie.trailer}
                title={`${movie.title} Trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              ></iframe>
            </div>
          </div>
        </section>
      )}

      {/* Detailed Information Section */}
      <section className="py-12 bg-[#121212]">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Synopsis */}
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold font-oswald mb-4">Synopsis</h2>
              <p className="text-[#E0E0E0] font-openSans mb-8">
                {movie.synopsis}
              </p>

              <h2 className="text-2xl font-bold font-oswald mb-4">
                Additional Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div>
                  <h3 className="text-white font-semibold mb-1">Director</h3>
                  <p className="text-[#E0E0E0] font-openSans">
                    {movie.director}
                  </p>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Rating</h3>
                  <p className="text-[#E0E0E0] font-openSans">{movie.rating}</p>
                </div>
                <div className="md:col-span-2">
                  <h3 className="text-white font-semibold mb-1">Cast</h3>
                  {cast.length > 0 ? (
                    <div className="flex flex-wrap gap-4 mt-2">
                      {cast.map((actor) => (
                        <div
                          key={actor.actor}
                          className="flex items-center gap-2 bg-[#232323] rounded-lg px-3 py-2"
                        >
                          <span className="text-[#E0E0E0] font-openSans font-semibold">
                            {actor.actorFirstName} {actor.actorLastName}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[#E0E0E0] font-openSans">
                      No cast information available.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Showtimes - New Structure */}
            <div>
              <h2 className="text-2xl font-bold font-oswald mb-4">Schedules</h2>
              {availableDates.length > 0 ? (
                <div className="bg-[#1E1E1E] rounded-lg p-1 mb-4 flex space-x-1">
                  {/* Date Tabs */}
                  {availableDates.map((date) => (
                    <Button
                      key={date.toISOString()}
                      variant={
                        selectedDate && isSameDay(date, selectedDate)
                          ? "default"
                          : "ghost"
                      }
                      onClick={() => selectDate(date)}
                      className={`flex-1 justify-center ${
                        selectedDate && isSameDay(date, selectedDate)
                          ? "bg-[#E50914] text-white"
                          : "text-gray-400 hover:bg-gray-700 hover:text-white"
                      }`}
                    >
                      {formatDateTab(date)}
                    </Button>
                  ))}
                </div>
              ) : null}

              {
                selectedDate && showtimesByDate[selectedDate.toDateString()] ? (
                  <Card className="border-none bg-[#1E1E1E]">
                    <CardContent className="p-4">
                      {/* Time Buttons */}
                      <div className="flex flex-wrap gap-2">
                        {showtimesByDate[selectedDate.toDateString()].map(
                          (showtime) => (
                            <Button
                              key={showtime.id}
                              variant={
                                selectedShowtimeId === showtime.id
                                  ? "default"
                                  : "outline"
                              }
                              className={`
                                px-6 py-3 rounded-xl font-bold text-lg shadow-md transition-all duration-200
                                border-2
                                ${
                                  selectedShowtimeId === showtime.id
                                    ? "bg-white text-[#E50914] border-[#D4AF37] ring-2 ring-[#D4AF37]"
                                    : "bg-white text-[#121212] border-[#E0E0E0] hover:bg-[#E50914] hover:text-white hover:border-[#E50914] hover:shadow-lg"
                                }
                              `}
                              onClick={() => selectShowtime(showtime.id)}
                            >
                              {formatTime(showtime.start_time)}
                            </Button>
                          )
                        )}
                      </div>

                      {/* Selection Info & Actions */}
                      {selectedShowtime && (
                        <div className="mt-4 p-4 bg-[#121212] rounded-lg">
                          <p className="text-[#E0E0E0] mb-4">
                            Selected:{" "}
                            <span className="text-white">
                              {formatTime(selectedShowtime.start_time)}
                            </span>{" "}
                            on{" "}
                            <span className="text-white">
                              {selectedDate
                                ? formatDateTab(selectedDate)
                                : "N/A"}
                            </span>
                          </p>
                          <div className="flex gap-2">
                            <Link
                              to={`/movies/${id}/seats/${selectedShowtime.id}`}
                            >
                              <Button className="bg-[#E50914] hover:bg-[#FF3333] text-white">
                                Select Seats
                              </Button>
                            </Link>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : availableDates.length === 0 ? (
                  <p className="text-[#E0E0E0]">
                    No schedules available for this movie yet.
                  </p>
                ) : null /* Handle case where selectedDate might be invalid briefly */
              }
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
