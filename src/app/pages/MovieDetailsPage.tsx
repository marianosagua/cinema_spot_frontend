import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, Film } from "lucide-react";
import { Movie } from "../../interfaces/movie";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Showtime } from "../../interfaces/showtime";
import { getMovie, getShowtimesByMovie } from "@/api/services";

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
  },
};

export const MovieDetailsPage = () => {
  const { id } = useParams();
  const [selectedShowtime, setSelectedShowtime] = useState<string | null>(null);
  const [movie, setmovie] = useState<Movie | null>(null);
  const [showtimes, setshowtimes] = useState<Showtime[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await Promise.all([
        getMovie(Number(id)),
        getShowtimesByMovie(Number(id)),
      ]);
      setmovie(data[0]);
      setshowtimes(data[1]);
    };
    fetchData();
  }, []);

  if (!movie) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        Movie not found
      </div>
    );
  }

  return (
    <motion.div
      className="flex flex-col lg:flex-row gap-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="lg:w-1/3" variants={itemVariants}>
        <Card className="overflow-hidden bg-gray-900 border-2 border-zinc-700">
          <CardContent className="p-0">
            <div className="relative aspect-[2/3]">
              <img
                src={movie.poster || "/placeholder.svg"}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
      <div className="lg:w-2/3 space-y-8">
        <motion.div variants={itemVariants}>
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
            {movie.title}
          </h1>
          <div className="flex items-center space-x-4 mb-4">
            <p className="text-lg py-1 flex items-center border border-zinc-800 px-4 rounded-full">
              <Film className="w-4 h-4 mr-2" />
              {movie.category}
            </p>
            <p className="text-lg py-1 flex items-center border border-zinc-800 px-4 rounded-full">
              <Clock className="w-4 h-4 mr-2" />
              2h 30m
            </p>
          </div>
          <p className="text-gray-300 text-lg">{movie.description}</p>
        </motion.div>
        <motion.div variants={itemVariants}>
          <h2 className="text-3xl font-semibold mb-6">Showtimes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {showtimes?.map((showtime) => (
              <Button
                key={showtime.id}
                className={`w-full justify-start bg-zinc-950 border border-zinc-800 py-7 hover:bg-zinc-800 hover:text-white ${
                  selectedShowtime === showtime.id
                    ? "bg-zinc-800 text-white"
                    : ""
                }`}
                onClick={() => setSelectedShowtime(showtime.id)}
              >
                <div className="text-left">
                  <p className="font-bold">
                    {showtime.start_time.substring(0, 5)} -{" "}
                    {showtime.end_time.substring(0, 5)}
                  </p>
                  <p className="text-sm text-gray-400">Room: {showtime.room}</p>
                </div>
              </Button>
            ))}
          </div>
        </motion.div>
        {selectedShowtime && (
          <motion.div variants={itemVariants}>
            <Link to={`/movies/${movie.id}/seats/${selectedShowtime}`}>
              <Button className="w-full sm:w-auto">Select Seats</Button>
            </Link>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
