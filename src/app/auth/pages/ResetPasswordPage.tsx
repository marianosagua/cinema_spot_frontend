import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Mail, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface ResetPasswordInput {
  email: string;
}

export const ResetPasswordPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordInput>();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const email = watch("email");

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.minHeight = "100vh";
    document.body.style.backgroundColor = "#121212";
    document.documentElement.style.minHeight = "100vh";
  }, []);

  const onSubmit = async (data: ResetPasswordInput) => {
    setIsLoading(true);
    // Aquí iría la lógica real de envío de email
    setTimeout(() => {
      setEmailSent(true);
      setIsLoading(false);
    }, 1500);
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
                  Restablecer Contraseña
                </motion.h1>
                <motion.p
                  className="text-[#E0E0E0] font-montserrat"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  Ingresa tu email y te enviaremos instrucciones para
                  restablecer tu contraseña
                </motion.p>
              </div>

              {emailSent ? (
                <div className="text-center py-8">
                  <p className="text-[#28A745] font-bold font-montserrat mb-4">
                    ¡Revisa tu correo electrónico!
                  </p>
                  <p className="text-[#E0E0E0] text-sm font-['Open_Sans'] mb-6">
                    Si existe una cuenta asociada, recibirás un enlace para
                    restablecer tu contraseña.
                  </p>
                  <Link to="/auth/login">
                    <Button className="w-full bg-[#E50914] hover:bg-[#FF3333] text-white font-montserrat py-6">
                      Volver al Login
                    </Button>
                  </Link>
                </div>
              ) : (
                <motion.form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-[#E0E0E0] font-['Open_Sans']"
                    >
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

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] hover:from-[#F5D76E] hover:to-[#D4AF37] text-black font-bold font-montserrat py-6 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-[#D4AF37]/30"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin h-5 w-5 border-2 border-black border-t-transparent rounded-full"></div>
                        <span>Enviando...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <span>Enviar instrucciones</span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    )}
                  </Button>
                </motion.form>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};
