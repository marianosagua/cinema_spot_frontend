import { useState, useEffect } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/api/services/getCategories";
import { Category } from "@/interfaces/category";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/hooks/useAuthStore";

const initialCategory: Partial<Category> = {
  name: "",
};

export const CategoriesAdmin = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCategory, setCurrentCategory] =
    useState<Partial<Category>>(initialCategory);
  const { token } = useAuthStore();

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCategories(token);
      setCategories(data);
    } catch {
      setError("Error al cargar categorías");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenCreate = () => {
    setEditMode(false);
    setCurrentCategory(initialCategory);
    setOpenDialog(true);
  };

  const handleOpenEdit = (category: Category) => {
    setEditMode(true);
    setCurrentCategory(category);
    setOpenDialog(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentCategory({ ...currentCategory, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (editMode && currentCategory.id) {
        await updateCategory(currentCategory.id, currentCategory, token);
      } else {
        await createCategory(currentCategory, token);
      }
      fetchCategories();
      setOpenDialog(false);
    } catch {
      setError("Error al guardar la categoría");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta categoría?")) return;
    setLoading(true);
    setError(null);
    try {
      await deleteCategory(id, token);
      fetchCategories();
    } catch {
      setError("Error al eliminar la categoría");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
        <h2 className="text-2xl font-bold text-white">Categorías</h2>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <button
              className="bg-gradient-to-r from-[#E50914] via-[#FF3333] to-[#E50914] text-white font-bold px-6 py-2 rounded-lg shadow-md hover:scale-105 transition-all duration-200 border-2 border-[#E50914] hover:border-[#FF3333]"
              onClick={handleOpenCreate}
            >
              + Nueva Categoría
            </button>
          </DialogTrigger>
          <DialogContent className="bg-[#181818] text-white rounded-2xl shadow-2xl border border-[#333]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-[#FFD700] mb-2">
                {editMode ? "Editar Categoría" : "Nueva Categoría"}
              </DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <Label className="text-[#FFD700]">Nombre</Label>
                <Input
                  className="bg-[#232323] text-white"
                  name="name"
                  value={currentCategory.name || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-[#FFD700] text-[#181818] font-bold hover:bg-yellow-400"
                >
                  {loading ? "Guardando..." : "Guardar"}
                </Button>
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-[#FFD700] text-[#FFD700] hover:bg-[#232323] hover:text-white"
                  >
                    Cancelar
                  </Button>
                </DialogClose>
              </DialogFooter>
              {error && (
                <div className="text-red-500 text-sm mt-2">{error}</div>
              )}
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {loading && <div className="text-gray-300 mb-4">Cargando...</div>}
      {/* Tabla para pantallas medianas y grandes */}
      <div className="hidden md:block rounded-lg shadow-inner">
        <table className="min-w-full bg-[#232323] rounded-lg">
          <thead>
            <tr className="text-[#FFD700] text-lg">
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Nombre</th>
              <th className="py-3 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr
                key={category.id}
                className="border-b border-[#333] hover:bg-[#292929] transition-all"
              >
                <td className="py-3 px-4 text-white font-semibold">
                  {category.id}
                </td>
                <td className="py-3 px-4 text-gray-300">{category.name}</td>
                <td className="py-3 px-4 text-center flex gap-2 justify-center">
                  <button
                    className="bg-[#FFD700] text-[#181818] font-bold px-4 py-1 rounded hover:bg-yellow-400 transition-all"
                    onClick={() => handleOpenEdit(category)}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-[#E50914] text-white font-bold px-4 py-1 rounded hover:bg-[#b0060f] transition-all"
                    onClick={() => handleDelete(category.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Cards para mobile */}
      <div className="md:hidden flex flex-col gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-[#232323] rounded-xl p-4 shadow flex flex-col gap-2"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#FFD700] font-bold">{category.name}</span>
              <span className="text-gray-400 text-sm">ID: {category.id}</span>
            </div>
            <div className="flex gap-2 mt-2">
              <button
                className="flex-1 bg-[#FFD700] text-[#181818] font-bold py-2 rounded hover:bg-yellow-400 transition-all"
                onClick={() => handleOpenEdit(category)}
              >
                Editar
              </button>
              <button
                className="flex-1 bg-[#E50914] text-white font-bold py-2 rounded hover:bg-[#b0060f] transition-all"
                onClick={() => handleDelete(category.id)}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 