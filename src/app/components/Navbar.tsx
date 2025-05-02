import type React from "react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CinemaSpotLogo from "../images/CinemaSpotLogo.png";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // For demo purposes, we'll consider the user logged in
  // In a real app, this would come from an authentication context or API
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle mobile menu toggle
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle logout
  const handleLogout = () => {
    // In a real app, you would handle logout logic here
    setIsLoggedIn(false);
    // Redirect to home page or login page
  };

  // Check if the current path matches the given path
  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#121212]/95 backdrop-blur-sm shadow-md"
          : "bg-[#121212]/80"
      }`}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="relative h-10 w-10 rounded-full overflow-hidden">
            <img
              src={CinemaSpotLogo}
              alt="Logo CinemaSpot"
              className="w-full h-full object-contain"
            />
          </div>
          <motion.span
            className="text-2xl font-bold font-oswald tracking-wider text-white"
            whileHover={{
              color: "#E50914",
              textShadow: "0 0 8px rgba(229, 9, 20, 0.3)",
            }}
            transition={{ duration: 0.2 }}
          >
            CinemaSpot
          </motion.span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center justify-center flex-1 mx-4">
          <div className="flex gap-8">
            <NavLink to="/" isActive={isActive("/")} label="Inicio" />
            <NavLink
              to="/movies"
              isActive={isActive("/movies")}
              label="Películas"
            />
          </div>
        </nav>

        {/* Auth Buttons - Desktop */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <Link to="/profile">
                <motion.div
                  className="relative text-white font-montserrat text-lg flex items-center gap-2 px-3 py-1.5 rounded-md"
                  whileHover={{
                    color: "#E50914",
                  }}
                >
                  <User className="h-4 w-4" />
                  <span>Perfil</span>
                  <motion.div
                    className="absolute bottom-0 left-1/2 h-0.5 bg-[#D4AF37] rounded-full"
                    initial={{ width: 0, x: "-50%" }}
                    whileHover={{
                      width: "80%",
                      x: "-40%",
                    }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.div>
              </Link>
              <motion.button
                className="relative text-white font-montserrat text-lg flex items-center gap-2 px-3 py-1.5 rounded-md"
                onClick={handleLogout}
                whileHover={{
                  color: "#E50914",
                }}
              >
                <LogOut className="h-4 w-4" />
                <span>Cerrar Sesión</span>
                <motion.div
                  className="absolute bottom-0 left-1/2 h-0.5 bg-[#D4AF37] rounded-full"
                  initial={{ width: 0, x: "-50%" }}
                  whileHover={{
                    width: "80%",
                    x: "-40%",
                  }}
                  transition={{ duration: 0.2 }}
                />
              </motion.button>
            </>
          ) : (
            <>
              <Link to="/login">
                <motion.div
                  className="relative text-white font-montserrat text-lg px-3 py-1.5 rounded-md"
                  whileHover={{
                    color: "#E50914",
                  }}
                >
                  <span>Iniciar Sesión</span>
                  <motion.div
                    className="absolute bottom-0 left-1/2 h-0.5 bg-[#D4AF37] rounded-full"
                    initial={{ width: 0, x: "-50%" }}
                    whileHover={{
                      width: "80%",
                      x: "-40%",
                    }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.div>
              </Link>
              <Link to="/register">
                <motion.button
                  className="bg-[#E50914] text-white font-montserrat text-lg px-5 py-1.5 rounded-md"
                  whileHover={{
                    backgroundColor: "#FF3333",
                    boxShadow: "0 0 15px rgba(212, 175, 55, 0.5)",
                  }}
                  transition={{ duration: 0.2 }}
                >
                  Registrarse
                </motion.button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          className="md:hidden text-[#D4AF37]"
          onClick={toggleMenu}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <AnimatePresence mode="wait">
            {isMenuOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: 0, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="h-6 w-6" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 0, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="h-6 w-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden bg-[#1E1E1E] border-t border-[#D4AF37]/30"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <MobileNavLink
                to="/"
                isActive={isActive("/")}
                label="Inicio"
                onClick={() => setIsMenuOpen(false)}
              />
              <MobileNavLink
                to="/movies"
                isActive={isActive("/movies")}
                label="Películas"
                onClick={() => setIsMenuOpen(false)}
              />

              <div className="h-px bg-[#D4AF37]/20 my-2"></div>

              {isLoggedIn ? (
                <>
                  <MobileNavLink
                    to="/profile"
                    isActive={isActive("/profile")}
                    label="Perfil"
                    icon={<User className="h-4 w-4" />}
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <button
                    className="flex items-center gap-2 text-white font-montserrat text-lg py-2 px-3 rounded-md hover:bg-[#1A0000] hover:text-[#E50914] transition-colors"
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </button>
                </>
              ) : (
                <>
                  <MobileNavLink
                    to="/login"
                    isActive={isActive("/login")}
                    label="Iniciar Sesión"
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                    <motion.div
                      className="bg-[#E50914] text-white font-montserrat text-lg py-2 px-3 rounded-md text-center"
                      whileHover={{
                        backgroundColor: "#FF3333",
                        boxShadow: "0 0 10px rgba(212, 175, 55, 0.3)",
                      }}
                    >
                      Registrarse
                    </motion.div>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

// Desktop Navigation Link Component
interface NavLinkProps {
  to: string;
  isActive: boolean;
  label: string;
}

const NavLink: React.FC<NavLinkProps> = ({ to, isActive, label }) => {
  return (
    <Link to={to}>
      <motion.div
        className={`relative font-montserrat text-lg px-3 py-1.5 rounded-md ${
          isActive
            ? "bg-[#1A0000] text-white"
            : "text-white hover:text-[#E50914]"
        }`}
        whileHover={!isActive ? { y: -1 } : {}}
      >
        <span>{label}</span>
        {isActive && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37] rounded-full"
            layoutId="activeNavIndicator"
          />
        )}
        {!isActive && (
          <motion.div
            className="absolute bottom-0 left-1/2 h-0.5 bg-[#D4AF37] rounded-full"
            initial={{ width: 0, x: "-50%" }}
            whileHover={{
              width: "80%",
              x: "-40%",
            }}
            transition={{ duration: 0.2 }}
          />
        )}
      </motion.div>
    </Link>
  );
};

// Mobile Navigation Link Component
interface MobileNavLinkProps {
  to: string;
  isActive: boolean;
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
}

const MobileNavLink: React.FC<MobileNavLinkProps> = ({
  to,
  isActive,
  label,
  icon,
  onClick,
}) => {
  return (
    <Link to={to} onClick={onClick}>
      <motion.div
        className={`flex items-center gap-2 font-montserrat text-lg py-2 px-3 rounded-md ${
          isActive
            ? "bg-[#1A0000] text-[#E50914] border-l-2 border-[#D4AF37]"
            : "text-white hover:bg-[#1A0000] hover:text-[#E50914] transition-colors"
        }`}
        whileTap={{ scale: 0.98 }}
      >
        {icon}
        <span>{label}</span>
      </motion.div>
    </Link>
  );
};

export default Navbar;
