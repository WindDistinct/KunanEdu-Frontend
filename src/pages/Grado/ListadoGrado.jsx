 
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { gradoService } from "../../api/requestApi";
import Tabla from "../../components/Tabla";
import FormularioGrado from "./FormularioGrado";
import Notificacion from "../../components/Notificacion";

export default function ListadoGrado() {
  const [grados, setGrados] = useState([]);
  const [formData, setFormData] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const navigate = useNavigate();

  const [rol] = useState(() => localStorage.getItem("rol"));
  const puedeAdministrar = rol === "administrador";

  const cargarGrados = useCallback(async () => {
    try {
      const data =
        rol === "administrador"
          ? await gradoService.obtenerTodos()
          : await gradoService.obtener();
 
      setGrados(data);
    } catch (error) {
      setMensaje({
        tipo: "error",
        texto: "Error al cargar los grados: " + error,
      });
    }
  }, [rol]);

  useEffect(() => {
    cargarGrados();
  }, [cargarGrados]);

  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => {
        setMensaje(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  const handleEliminar = async (id) => {
    try {
      await gradoService.eliminar(id);
      setMensaje({ tipo: "success", texto: "Grado eliminado correctamente" });
      await cargarGrados();
    } catch (error) {
      setMensaje({
        tipo: "error",
        texto: "Error al eliminar el grado: " + error,
      });
    }
  };

  const handleEditar = (grado) => {
    setFormData(grado);
    setMostrarFormulario(true);
  };

  const handleExito = async (texto) => {
    setMensaje({ tipo: "success", texto });
    setFormData(null);
    setMostrarFormulario(false);
    await cargarGrados();
  };

  const handleCancelar = () => {
    setFormData(null);
    setMostrarFormulario(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-4xl font-semibold mb-4">
        {puedeAdministrar ? "Gestión de Grados" : "Listado de Grados"}
      </h1>

      <button onClick={() => navigate("/")} className="btn btn-secondary mb-4">
        ← Volver al Menú
      </button>

      {puedeAdministrar && (
        <button
          onClick={() => setMostrarFormulario(true)}
          className="btn btn-primary mb-4"
        >
          ➕ Registrar nuevo Grado
        </button>
      )}

      {mostrarFormulario && (
        <dialog id="modalGrado" className="modal modal-open">
          <div className="modal-box w-11/12 max-w-3xl">
            <h3 className="font-bold text-lg mb-4">
              {formData ? "Editar Grado" : "Registrar Nuevo Grado"}
            </h3>
            <FormularioGrado onExito={handleExito} initialData={formData} />

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
          { key: "nivel", label: "Nivel del Grado" },
          { key: "anio", label: "Año" },
          ...(puedeAdministrar
            ? [
                {
                  key: "estado",
                  label: "Estado",
                  render: (valor) => (valor ? "Activo" : "Inactivo"),
                },
              ]
            : []),
        ]}
        datos={grados}
        onEditar={handleEditar}
        onEliminar={handleEliminar}
        idKey="id_grado"
        mostrarAcciones={puedeAdministrar}
      />
    </div>
  );
}