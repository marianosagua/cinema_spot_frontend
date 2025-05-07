import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Eye, EyeOff, User, Mail, Lock, ArrowRight } from "lucide-react";
import { useAuthStore } from "@/hooks/useAuthStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

export interface FormRegisterInput {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormRegisterInput>();
  const { setRegisterUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Get current values for validation highlighting
  const first_name = watch("first_name");
  const last_name = watch("last_name");
  const email = watch("email");
  const password = watch("password");

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.minHeight = "100vh";
    document.body.style.backgroundColor = "#121212";
    document.documentElement.style.minHeight = "100vh";
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data: FormRegisterInput) => {
    setIsLoading(true);
    try {
      await setRegisterUser(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center">
      <div className="container mx-auto px-4 py-16 z-10">
        <motion.div
          className="max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-[#1E1E1E]/90 backdrop-blur-sm border-gray-800 shadow-2xl">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <motion.h1
                  className="text-3xl md:text-4xl font-bold font-oswald mb-2 text-white"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Crear Cuenta
                </motion.h1>
                <motion.p
                  className="text-[#E0E0E0] font-montserrat"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  Regístrate para acceder a todas las funciones
                </motion.p>
              </div>

              <motion.form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <div className="space-y-2">
                  <Label htmlFor="first_name" className="text-[#E0E0E0] font-['Open_Sans']">
                    Nombre
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                    <Input
                      id="first_name"
                      type="text"
                      placeholder="Tu nombre"
                      {...register("first_name", {
                        required: "El nombre es obligatorio",
                        minLength: {
                          value: 2,
                          message: "El nombre debe tener al menos 2 caracteres",
                        },
                      })}
                      className={`pl-10 bg-[#E0E0E0] text-black font-['Open_Sans'] ${
                        errors.first_name
                          ? "border-[#DC3545]"
                          : first_name
                          ? "border-[#28A745]"
                          : ""
                      }`}
                    />
                  </div>
                  {errors.first_name && (
                    <p className="text-[#DC3545] text-sm font-['Open_Sans']">
                      {errors.first_name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="last_name" className="text-[#E0E0E0] font-['Open_Sans']">
                    Apellido
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                    <Input
                      id="last_name"
                      type="text"
                      placeholder="Tu apellido"
                      {...register("last_name", {
                        required: "El apellido es obligatorio",
                        minLength: {
                          value: 2,
                          message: "El apellido debe tener al menos 2 caracteres",
                        },
                      })}
                      className={`pl-10 bg-[#E0E0E0] text-black font-['Open_Sans'] ${
                        errors.last_name
                          ? "border-[#DC3545]"
                          : last_name
                          ? "border-[#28A745]"
                          : ""
                      }`}
                    />
                  </div>
                  {errors.last_name && (
                    <p className="text-[#DC3545] text-sm font-['Open_Sans']">
                      {errors.last_name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#E0E0E0] font-['Open_Sans']">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="ejemplo@email.com"
                      {...register("email", {
                        required: "El email es obligatorio",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Por favor ingresa un email válido",
                        },
                      })}
                      className={`pl-10 bg-[#E0E0E0] text-black font-['Open_Sans'] ${
                        errors.email
                          ? "border-[#DC3545]"
                          : email
                          ? "border-[#28A745]"
                          : ""
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-[#DC3545] text-sm font-['Open_Sans']">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[#E0E0E0] font-['Open_Sans']">
                    Contraseña
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...register("password", {
                        required: "La contraseña es obligatoria",
                        minLength: {
                          value: 6,
                          message: "La contraseña debe tener al menos 6 caracteres",
                        },
                      })}
                      className={`pl-10 bg-[#E0E0E0] text-black font-['Open_Sans'] ${
                        errors.password
                          ? "border-[#DC3545]"
                          : password
                          ? "border-[#28A745]"
                          : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#D4AF37] hover:text-[#D4AF37]/80"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-[#DC3545] text-sm font-['Open_Sans']">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] hover:from-[#F5D76E] hover:to-[#D4AF37] text-black font-bold font-montserrat py-6 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-[#D4AF37]/30"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin h-5 w-5 border-2 border-black border-t-transparent rounded-full"></div>
                      <span>Registrando...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span>Registrarse</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </Button>

                <div className="pt-4 border-t border-gray-600 text-center">
                  <p className="text-[#E0E0E0] text-sm font-['Open_Sans'] mb-3">
                    ¿Ya tienes una cuenta?
                  </p>
                  <Link to="/autenticacion/inicio-sesion">
                    <Button
                      type="button"
                      className="w-full bg-[#E50914] hover:bg-[#FF3333] text-white font-montserrat py-6 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-[#E50914]/30"
                    >
                      <span>Iniciar Sesión</span>
                    </Button>
                  </Link>
                </div>
              </motion.form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};
