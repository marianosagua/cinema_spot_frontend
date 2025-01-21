import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { login } from "@/api/services";
import { useNavigate } from "react-router-dom";
import { emitAuthChangeEvent } from "../layout/AppLayout";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await login(email, password);

    if (response) {
      emitAuthChangeEvent();
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-4xl font-bold text-center text-zinc-50 mb-8"
        >
          Login
        </motion.h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-900 text-white border-zinc-700 focus:ring-blue-900"
            />
          </motion.div>
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-900 text-white border-zinc-700 focus:ring-blue-900"
            />
          </motion.div>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Button
              type="submit"
              className="w-full bg-gray-900 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Iniciar Sesión
            </Button>
          </motion.div>
        </form>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-4 text-center text-gray-400"
        >
          ¿No tienes una cuenta?{" "}
          <a href="/register" className="text-blue-900 hover:underline">
            Regístrate
          </a>
        </motion.p>
      </motion.div>
    </div>
  );
};
