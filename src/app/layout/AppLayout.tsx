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
    <div className="bg-zinc-950 text-white min-h-screen flex flex-col">
      <header className="border-b border-gray-800">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            to="/"
            className="flex items-center space-x-2 text-xl sm:text-3xl font-bold text-white hover:text-gray-300 transition-colors duration-200"
          >
            <img
              src="/LogoCinemaSpot.png"
              alt="CinemaSpot Logo"
              className="h-8 w-auto"
            />
            <span>CinemaSpot</span>
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
      <footer className="bg-zinc-950 text-white border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row md:justify-between gap-8">
            <div className="flex-1">
              <h3 className="text-2xl font-bold">Movie Reservation</h3>
              <p className="text-gray-400 mt-2">
              Application to practice development, it is not real.
              </p>
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
              <li>
                <Link
                to="/"
                className="hover:text-blue-400 transition-colors"
                >
                Home
                </Link>
              </li>
              {isLogged ? (
                <li>
                <Link
                  to="/profile"
                  className="hover:text-blue-400 transition-colors"
                >
                  Profile
                </Link>
                </li>
              ) : (
                <>
                <li>
                  <Link
                  to="/auth/login"
                  className="hover:text-blue-400 transition-colors"
                  >
                  Login
                  </Link>
                </li>
                <li>
                  <Link
                  to="/auth/register"
                  className="hover:text-blue-400 transition-colors"
                  >
                  Register
                  </Link>
                </li>
                </>
              )}
              </ul>
            </div>
            </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Movie Reservation. </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
