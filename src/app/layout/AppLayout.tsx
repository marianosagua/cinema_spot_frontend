import { useAuthStore } from "@/hooks/useAuthStore";
import { Home, LogIn, User, UserRoundPlus } from "lucide-react";
import { Link } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<LayoutProps> = ({ children }) => {
  const { isLogged } = useAuthStore();

  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      <header className="bg-black border-b border-gray-800">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            to="/"
            className="text-3xl font-bold text-white hover:text-gray-300 transition-colors duration-200"
          >
            MRS
          </Link>
          <ul className="flex space-x-6">
            <li>
              <Link
                to="/"
                className="flex items-center hover:text-gray-300 transition-colors duration-200"
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
                  >
                    <LogIn className="w-5 h-5 mr-1" />
                    <span>Login</span>
                  </Link>
                </li>

                <li>
                  <Link
                    to="/auth/register"
                    className="flex items-center hover:text-gray-300 transition-colors duration-200"
                  >
                    <UserRoundPlus className="w-5 h-5 mr-1" />
                    <span>Register</span>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
      <footer className="bg-black border-t border-gray-800 py-6 text-center">
        <div className="container mx-auto px-4">
          <p className="text-gray-400">&copy; 2023 MRS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
