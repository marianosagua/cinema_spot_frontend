import { useState, useEffect } from "react";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "@/api/services/usersService";
import { User } from "@/interfaces/user";
import {
  getRoles,
  Role,
} from "@/api/services/assignRole";
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

const initialUser: Partial<User> = {
  first_name: "",
  last_name: "",
  email: "",
  role: "",
};

export const UsersAdmin = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState<Partial<User>>(initialUser);
  const [openDetails, setOpenDetails] = useState(false);
  const [detailsUser, setDetailsUser] = useState<User | null>(null);
  const { token } = useAuthStore();

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUsers(token);
      setUsers(data);
    } catch {
      setError("Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const data = await getRoles(token);
      setRoles(data);
    } catch {
      // Error silencioso para roles
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const handleOpenCreate = () => {
    setEditMode(false);
    setCurrentUser(initialUser);
    setOpenDialog(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditMode(true);
    setCurrentUser(user);
    setOpenDialog(true);
  };

  const handleOpenDetails = (user: User) => {
    setDetailsUser(user);
    setOpenDetails(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setCurrentUser({ ...currentUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (editMode && currentUser.id) {
        await updateUser(currentUser.id, currentUser, token);
      } else {
        await createUser(currentUser, token);
      }
      fetchUsers();
      setOpenDialog(false);
    } catch {
      setError("Error al guardar el usuario");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;
    setLoading(true);
    setError(null);
    try {
      await deleteUser(id, token);
      fetchUsers();
    } catch {
      setError("Error al eliminar el usuario");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
        <h2 className="text-2xl font-bold text-white">Usuarios</h2>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <button
              className="bg-gradient-to-r from-[#E50914] via-[#FF3333] to-[#E50914] text-white font-bold px-6 py-2 rounded-lg shadow-md hover:scale-105 transition-all duration-200 border-2 border-[#E50914] hover:border-[#FF3333]"
              onClick={handleOpenCreate}
            >
              + Nuevo Usuario
            </button>
          </DialogTrigger>
          <DialogContent className="bg-[#181818] text-white rounded-2xl shadow-2xl border border-[#333]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-[#FFD700] mb-2">
                {editMode ? "Editar Usuario" : "Nuevo Usuario"}
              </DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-[#FFD700]">Nombre</Label>
                  <Input
                    className="bg-[#232323] text-white"
                    name="first_name"
                    value={currentUser.first_name || ""}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label className="text-[#FFD700]">Apellido</Label>
                  <Input
                    className="bg-[#232323] text-white"
                    name="last_name"
                    value={currentUser.last_name || ""}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label className="text-[#FFD700]">Email</Label>
                  <Input
                    className="bg-[#232323] text-white"
                    name="email"
                    type="email"
                    value={currentUser.email || ""}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label className="text-[#FFD700]">Rol</Label>
                  <select
                    name="role"
                    value={currentUser.role || ""}
                    onChange={handleChange}
                    className="w-full rounded-md border border-input bg-[#232323] text-white px-3 py-2 text-base shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FFD700]"
                    required
                  >
                    <option value="">Selecciona un rol</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.name}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>
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
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {/* Tabla para pantallas medianas y grandes */}
      <div className="hidden md:block rounded-lg shadow-inner">
        <table className="min-w-full bg-[#232323] rounded-lg">
          <thead>
            <tr className="text-[#FFD700] text-lg">
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Nombre</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Rol</th>
              <th className="py-3 px-4 text-left">Validado</th>
              <th className="py-3 px-4 text-left">Fecha Creación</th>
              <th className="py-3 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-[#333] hover:bg-[#292929] transition-all"
              >
                <td className="py-3 px-4 text-white font-semibold">
                  {user.id}
                </td>
                <td className="py-3 px-4 text-gray-300">{`${user.first_name} ${user.last_name}`}</td>
                <td className="py-3 px-4 text-gray-300">{user.email}</td>
                <td className="py-3 px-4 text-gray-300">{user.role}</td>
                <td className="py-3 px-4 text-gray-300">
                  {user.email_validated ? "Sí" : "No"}
                </td>
                <td className="py-3 px-4 text-gray-300">
                  {formatDate(user.created_at)}
                </td>
                <td className="py-3 px-4 text-center flex gap-2 justify-center">
                  <button
                    className="bg-blue-500 text-white font-bold px-4 py-1 rounded hover:bg-blue-600 transition-all"
                    onClick={() => handleOpenDetails(user)}
                  >
                    Ver detalles
                  </button>
                  <button
                    className="bg-[#FFD700] text-[#181818] font-bold px-4 py-1 rounded hover:bg-yellow-400 transition-all"
                    onClick={() => handleOpenEdit(user)}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-[#E50914] text-white font-bold px-4 py-1 rounded hover:bg-[#b0060f] transition-all"
                    onClick={() => handleDelete(user.id)}
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
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-[#232323] rounded-xl p-4 shadow flex flex-col gap-2"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#FFD700] font-bold">{`${user.first_name} ${user.last_name}`}</span>
              <span className="text-gray-400 text-sm">ID: {user.id}</span>
            </div>
            <div className="text-gray-300 mb-2">
              Email:{" "}
              <span className="font-semibold text-white">{user.email}</span>
            </div>
            <div className="text-gray-300 mb-2">
              Rol: <span className="font-semibold text-white">{user.role}</span>
            </div>
            <div className="text-gray-300 mb-2">
              Validado:{" "}
              <span className="font-semibold text-white">
                {user.email_validated ? "Sí" : "No"}
              </span>
            </div>
            <div className="text-gray-300 mb-2">
              Creación:{" "}
              <span className="font-semibold text-white">
                {formatDate(user.created_at)}
              </span>
            </div>
            <div className="flex gap-2 mt-2">
              <button
                className="flex-1 bg-blue-500 text-white font-bold py-2 rounded hover:bg-blue-600 transition-all"
                onClick={() => handleOpenDetails(user)}
              >
                Ver detalles
              </button>
              <button
                className="flex-1 bg-[#FFD700] text-[#181818] font-bold py-2 rounded hover:bg-yellow-400 transition-all"
                onClick={() => handleOpenEdit(user)}
              >
                Editar
              </button>
              <button
                className="flex-1 bg-[#E50914] text-white font-bold py-2 rounded hover:bg-[#b0060f] transition-all"
                onClick={() => handleDelete(user.id)}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Modal de detalles */}
      <Dialog open={openDetails} onOpenChange={setOpenDetails}>
        <DialogContent className="max-w-md bg-[#181818] text-white rounded-2xl shadow-2xl border border-[#333]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#FFD700] mb-2">
              Detalles del Usuario
            </DialogTitle>
          </DialogHeader>
          {detailsUser && (
            <div className="flex flex-col gap-4">
              <div className="bg-[#232323] rounded p-4">
                <p className="text-gray-200">
                  <span className="text-[#FFD700] font-semibold">ID:</span>{" "}
                  {detailsUser.id}
                </p>
                <p className="text-gray-200">
                  <span className="text-[#FFD700] font-semibold">Nombre:</span>{" "}
                  {`${detailsUser.first_name} ${detailsUser.last_name}`}
                </p>
                <p className="text-gray-200">
                  <span className="text-[#FFD700] font-semibold">Email:</span>{" "}
                  {detailsUser.email}
                </p>
                <p className="text-gray-200">
                  <span className="text-[#FFD700] font-semibold">Rol:</span>{" "}
                  {detailsUser.role}
                </p>
                <p className="text-gray-200">
                  <span className="text-[#FFD700] font-semibold">
                    Email Validado:
                  </span>{" "}
                  {detailsUser.email_validated ? "Sí" : "No"}
                </p>
                <p className="text-gray-200">
                  <span className="text-[#FFD700] font-semibold">
                    Fecha Creación:
                  </span>{" "}
                  {formatDate(detailsUser.created_at)}
                </p>
                <p className="text-gray-200">
                  <span className="text-[#FFD700] font-semibold">
                    Última Actualización:
                  </span>{" "}
                  {formatDate(detailsUser.updated_at)}
                </p>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  className="bg-[#FFD700] text-[#181818] font-bold px-4 py-1 rounded hover:bg-yellow-400 transition-all"
                  onClick={() => {
                    setOpenDetails(false);
                    handleOpenEdit(detailsUser);
                  }}
                >
                  Editar
                </button>
                <button
                  className="bg-[#E50914] text-white font-bold px-4 py-1 rounded hover:bg-[#b0060f] transition-all"
                  onClick={() => {
                    setOpenDetails(false);
                    handleDelete(detailsUser.id);
                  }}
                >
                  Eliminar
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}; 