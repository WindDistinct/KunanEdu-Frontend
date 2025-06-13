import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { usuarioService } from "../../api/requestApi";
import Tabla from "../../components/Tabla";
import FormularioUsuario from "./FormularioUsuario";
import Notificacion from "../../components/Notificacion";

export default function ListadoUsuario() {
  const [usuarios, setUsuarios] = useState([]);
  const [formData, setFormData] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const navigate = useNavigate();

  const [rol] = useState(() => localStorage.getItem("rol"));
  const puedeAdministrar = rol === "administrador";

  const cargarUsuarios = useCallback(async () => {
    try {
      const data =
        rol === "administrador"
          ? await usuarioService.obtenerTodos()
          : await usuarioService.obtener();

      const usuariosOrdenados = data.sort((a, b) => a.id_usuario - b.id_usuario);
      setUsuarios(usuariosOrdenados);
    } catch (error) {
      setMensaje({ tipo: "error", texto: "Error al cargar los usuarios: " + error });
    }
  }, [rol]);

  useEffect(() => {
    cargarUsuarios();
  }, [cargarUsuarios]);

  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => setMensaje(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  const handleEliminar = async (id) => {
    try {
      await usuarioService.eliminar(id);
      setMensaje({ tipo: "success", texto: "Usuario eliminado correctamente" });
      await cargarUsuarios();
    } catch (error) {
      setMensaje({ tipo: "error", texto: "Error al eliminar el usuario: " + error });
    }
  };

  const handleEditar = (usuario) => {
    setFormData(usuario);
    setMostrarFormulario(true);
  };

  const handleExito = async (texto) => {
    setMensaje({ tipo: "success", texto });
    setFormData(null);
    setMostrarFormulario(false);
    await cargarUsuarios();
  };

  const handleCancelar = () => {
    setFormData(null);
    setMostrarFormulario(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-4xl font-semibold mb-4">
        {puedeAdministrar ? "Gestión de Usuarios" : "Listado de Usuarios"}
      </h1>

      <button onClick={() => navigate("/")} className="btn btn-secondary mb-4">
        ← Volver al Menú
      </button>

      {puedeAdministrar && (
        <button
          onClick={() => setMostrarFormulario(true)}
          className="btn btn-primary mb-4"
        >
          ➕ Registrar nuevo Usuario
        </button>
      )}

      {mostrarFormulario && (
        <dialog id="modalUsuario" className="modal modal-open">
          <div className="modal-box w-11/12 max-w-3xl">
            <h3 className="font-bold text-lg mb-4">
              {formData ? "Editar Usuario" : "Registrar Nuevo Usuario"}
            </h3>
            <FormularioUsuario onExito={handleExito} initialData={formData} />

            <div className="modal-action">
              <button className="btn btn-error" onClick={handleCancelar}>
                Cancelar
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={handleCancelar}>Cerrar</button>
          </form>
        </dialog>
      )}

      <div className="h-12 mb-4">
        <Notificacion mensaje={mensaje?.texto} tipo={mensaje?.tipo} />
      </div>

      <Tabla
        columnas={[
          { key: "username", label: "Nombre de Usuario" },
          { key: "rol", label: "Rol" },
           { key: "empleado", label: "Id empleado" },
          ...(puedeAdministrar ? [{ key: "estado", label: "Estado" }] : []),
        ]}
        datos={usuarios}
        onEditar={handleEditar}
        onEliminar={handleEliminar}
        idKey="id_usuario"
        mostrarAcciones={puedeAdministrar}
      />
    </div>
  );
}