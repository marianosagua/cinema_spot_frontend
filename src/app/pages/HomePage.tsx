import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Movie } from "../../interfaces/movie";
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
      <h1 className="text-4xl sm:text-5xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
        Now Showing
      </h1>
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {movies.map((movie) => (
          <motion.div key={movie.id} variants={itemVariants}>
            <Link to={`/movies/${movie.id}`}>
              <Card className="overflow-hidden bg-gray-900 hover:bg-gray-800 transition-colors duration-300 border-zinc-900">
                <CardContent className="p-0">
                  <div className="relative aspect-[3/4]">
                    <img
                      src={movie.poster || "/placeholder.svg"}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3">
                      <h2 className="text-lg sm:text-xl font-semibold mb-1 text-white line-clamp-1">
                        {movie.title}
                      </h2>
                      <Badge variant="default" className="text-xs">
                        {movie.category}
                      </Badge>
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
