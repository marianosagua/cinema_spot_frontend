import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Movie } from "../../interfaces/movie";
import { getMovies } from "@/api/services/movieService";

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

export const HomePage = () => {
  const [movies, setmovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const movies = await getMovies();
      setmovies(movies);
    };
    fetchMovies();
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-5xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
        Now Showing
      </h1>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {movies.map((movie) => (
          <motion.div key={movie.id} variants={itemVariants}>
            <Link to={`/movies/${movie.id}`}>
              <Card className="overflow-hidden bg-gray-900 hover:bg-gray-800 transition-colors duration-300 border-2 border-zinc-700">
                <CardContent className="p-0">
                  <div className="relative aspect-[2/3]">
                    <img
                      src={movie.poster || "/placeholder.svg"}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h2 className="text-2xl font-semibold mb-2 text-white">
                        {movie.title}
                      </h2>
                      <Badge variant="default">{movie.category}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
