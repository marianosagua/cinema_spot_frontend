import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#121212] text-white font-montserrat">
      <Navbar />
      <main className="pt-24">{children}</main>
      <Footer />
    </div>
  );
};
