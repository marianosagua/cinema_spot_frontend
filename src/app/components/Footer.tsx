import type React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-cinema-background shadow-[0_-2px_10px_rgba(0,0,0,0.15)] mt-10 border-t-2 border-[#D4AF37]/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between py-6 gap-3 md:gap-6">
          <div className="flex items-center gap-2 mb-1 md:mb-0">
            <img src="/images/CinemaSpotLogo.png" alt="CinemaSpot Logo" className="h-6 w-6 rounded-sm shadow" />
            <span className="text-cinema-accent font-bold text-base tracking-wide font-montserrat">CinemaSpot</span>
          </div>
          <p className="text-xs text-cinema-textSecondary italic bg-cinema-accent/10 rounded px-4 py-2 font-montserrat text-center max-w-lg shadow animate-in order-3 md:order-none">
            Esta aplicación web es un proyecto de ejemplo para fines educativos y no representa un servicio real.
          </p>
          <p className="text-cinema-textSecondary font-openSans text-xs text-center md:text-right mt-2 md:mt-0">
            © {new Date().getFullYear()} CinemaSpot.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
