import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/hooks/useAuthStore";

export interface FormRegisterInput {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export const RegisterPage = () => {
  const { register, handleSubmit } = useForm<FormRegisterInput>();
  const { setRegisterUser } = useAuthStore();

  const onSubmit = async (data: FormRegisterInput) => {
    setRegisterUser(data);
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
          Register
        </motion.h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Input
              type="text"
              placeholder="First Name"
              {...register("first_name", { required: true })}
              className="w-full bg-gray-900 text-white border-zinc-700 focus:ring-blue-900"
            />
          </motion.div>
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Input
              type="text"
              placeholder="Last Name"
              {...register("last_name", { required: true })}
              className="w-full bg-gray-900 text-white border-zinc-700 focus:ring-blue-900"
            />
          </motion.div>
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Input
              type="email"
              placeholder="Email"
              {...register("email", { required: true })}
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
              placeholder="Password"
              {...register("password", { required: true, minLength: 6 })}
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
              Register
            </Button>
          </motion.div>
        </form>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-4 text-center text-gray-400"
        >
          Already have an account?{" "}
          <a href="/auth/login" className="text-blue-900 hover:underline">
            Login
          </a>
        </motion.p>
      </motion.div>
    </div>
  );
};
