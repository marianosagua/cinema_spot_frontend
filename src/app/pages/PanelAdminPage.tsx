import { useState } from "react";
import { MoviesAdmin } from "@/app/components/MoviesAdmin";
import { RoomsAdmin } from "@/app/components/RoomsAdmin";
import { ShowtimesAdmin } from "@/app/components/ShowtimesAdmin";
import { CategoriesAdmin } from "@/app/components/CategoriesAdmin";
import { ReservationsAdmin } from "@/app/components/ReservationsAdmin";
import { UsersAdmin } from "@/app/components/UsersAdmin";
import { RolesAdmin } from "@/app/components/RolesAdmin";
import { ActorsAdmin } from "@/app/components/ActorsAdmin";

const TABS = [
  { label: "Películas", key: "movies" },
  { label: "Salas de cine", key: "rooms" },
  { label: "Funciones", key: "showtimes" },
  { label: "Reservaciones", key: "reservations" },
  { label: "Categorías", key: "categories" },
  { label: "Usuarios", key: "users" },
  { label: "Roles", key: "roles" },
  { label: "Actores", key: "cast" },
];

export const PanelAdminPage = () => {
  const [activeTab, setActiveTab] = useState("movies");
  return (
    <div className="min-h-screen bg-[#181818] py-10 px-2 flex flex-col items-center">
      <div className="w-full max-w-6xl">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Panel de Administración
        </h1>
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`px-5 py-2 rounded-full font-semibold transition-all duration-200 text-lg shadow-md border-2
                ${
                  activeTab === tab.key
                    ? "bg-gradient-to-r from-[#E50914] via-[#FF3333] to-[#E50914] text-white border-[#E50914] scale-105"
                    : "bg-[#232323] text-gray-300 border-[#232323] hover:bg-[#E50914]/80 hover:text-white hover:border-[#E50914]"
                }
              `}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {/* Tab Content */}
        <div className="bg-[#222] rounded-2xl shadow-xl p-6 md:p-10 min-h-[400px]">
          {activeTab === "movies" && <MoviesAdmin />}
          {activeTab === "rooms" && <RoomsAdmin />}
          {activeTab === "showtimes" && <ShowtimesAdmin />}
          {activeTab === "reservations" && <ReservationsAdmin />}
          {activeTab === "categories" && <CategoriesAdmin />}
          {activeTab === "users" && <UsersAdmin />}
          {activeTab === "roles" && <RolesAdmin />}
          {activeTab === "cast" && <ActorsAdmin />}
        </div>
      </div>
    </div>
  );
};
