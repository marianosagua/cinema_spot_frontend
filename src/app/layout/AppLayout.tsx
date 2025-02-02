import type React from "react";
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { useAuthStore } from "@/hooks/useAuthStore";
import { Home, LogIn, User, UserRoundPlus, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface LayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<LayoutProps> = ({ children }) => {
  const { isLogged } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  const NavItems = () => (
    <>
      <li>
        <Link
          to="/"
          className="flex items-center hover:text-gray-300 transition-colors duration-200"
          onClick={() => setIsOpen(false)}
        >
          <Home className="w-5 h-5 mr-1" />
          <span>Home</span>
        </Link>
      </li>
      {isLogged ? (
        <li>
          <Link
            to="/profile"
            className="flex items-center hover:text-gray-300 transition-colors duration-200"
            onClick={() => setIsOpen(false)}
          >
            <User className="w-5 h-5 mr-1" />
            <span>Profile</span>
          </Link>
        </li>
      ) : (
        <>
          <li>
            <Link
              to="/auth/login"
              className="flex items-center hover:text-gray-300 transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              <LogIn className="w-5 h-5 mr-1" />
              <span>Login</span>
            </Link>
          </li>
          <li>
            <Link
              to="/auth/register"
              className="flex items-center hover:text-gray-300 transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              <UserRoundPlus className="w-5 h-5 mr-1" />
              <span>Register</span>
            </Link>
          </li>
        </>
      )}
    </>
  );

  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      <header className="bg-black border-b border-gray-800">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            to="/"
            className="text-xl sm:text-3xl font-bold text-white hover:text-gray-300 transition-colors duration-200"
          >
            Movie Reservation System
          </Link>
          <ul className="hidden md:flex space-x-6">
            <NavItems />
          </ul>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-zinc-950 text-white">
              <SheetHeader>
                <SheetTitle className="text-white">Menu</SheetTitle>
              </SheetHeader>
              <ul className="mt-6 space-y-4">
                <NavItems />
              </ul>
            </SheetContent>
          </Sheet>
        </nav>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
      <Toaster />
      <footer className="bg-black border-t border-gray-800 py-6 text-center">
        <div className="container mx-auto px-4">
          <p className="text-gray-400">
            &copy; 2025 Movie Reservation System. Software development practice
            application, not an actual movie booking application.
          </p>
        </div>
      </footer>
    </div>
  );
};
