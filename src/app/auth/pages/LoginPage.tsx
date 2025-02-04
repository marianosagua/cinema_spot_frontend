import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useAuthStore } from "@/hooks/useAuthStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Icons } from "@/components/ui/icons";

interface IformInput {
  email: string;
  password: string;
}

export const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IformInput>();
  const { setLoginUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  });

  const onSubmit = async (data: IformInput) => {
    setIsLoading(true);
    try {
      await setLoginUser(data.email, data.password);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex min-h-screen w-full flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md sm:max-w-lg"
      >
        <Card className="bg-black border-zinc-800">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold tracking-tight text-white">
              Welcome back
            </CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4">
                <div className="grid gap-2 text-white">
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
                <div className="grid gap-2 text-white">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    {...register("password", {
                      required: "Password is required",
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
                  Sign In
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-zinc-400 text-center w-full">
              Don't have an account?{" "}
              <Link
                to="/auth/register"
                className="text-zinc-200 hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};
