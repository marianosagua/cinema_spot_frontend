import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useAuthStore } from "@/hooks/useAuthStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/ui/icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  } = useForm<FormRegisterInput>();
  const { setRegisterUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  });

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
    <div className="container flex h-screen w-full min-h-screen flex-col items-center justify-center px-4 sm:px-6 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full sm:max-w-md md:max-w-lg"
      >
        <Card className="bg-black border-zinc-800">
          <CardHeader className="space-y-1 text-white">
            <CardTitle className="text-3xl font-bold tracking-tight">
              Create an account
            </CardTitle>
            <CardDescription>
              Enter your details below to create your account
            </CardDescription>
          </CardHeader>
          <CardContent className="text-white">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    {...register("first_name", {
                      required: "First name is required",
                    })}
                    className="bg-zinc-900 border-zinc-800"
                  />
                  {errors.first_name && (
                    <p className="text-sm text-red-500">
                      {errors.first_name.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    {...register("last_name", {
                      required: "Last name is required",
                    })}
                    className="bg-zinc-900 border-zinc-800"
                  />
                  {errors.last_name && (
                    <p className="text-sm text-red-500">
                      {errors.last_name.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    placeholder="example@example.com"
                    type="email"
                    {...register("email", { required: "Email is required" })}
                    className="bg-zinc-900 border-zinc-800"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: 6,
                    })}
                    className="bg-zinc-900 border-zinc-800"
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Sign Up
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-zinc-400 text-center w-full">
              Already have an account?{" "}
              <Link to="/auth/login" className="text-zinc-200 hover:underline">
                Login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};
