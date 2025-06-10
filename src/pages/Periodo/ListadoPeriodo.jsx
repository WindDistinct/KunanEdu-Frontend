import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { periodoService } from "../../api/requestApi";
import Tabla from "../../components/Tabla";
import FormularioPeriodo from "./FormularioPeriodo";
import Notificacion from "../../components/Notificacion";

export default function ListadoPeriodo() {
  const [periodos, setPeriodos] = useState([]);
  const [formData, setFormData] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const navigate = useNavigate();

  const [rol] = useState(() => localStorage.getItem("rol"));
  const puedeAdministrar = rol === "administrador";

  const cargarPeriodos = useCallback(async () => {
    try {
      const data = puedeAdministrar
        ? await periodoService.obtenerTodos()
        : await periodoService.obtener();

      const ordenados = data.sort((a, b) => a.anio - b.anio);
      setPeriodos(ordenados);
    } catch (error) {
      setMensaje({
        tipo: "error",
        texto: "Error al cargar los periodos: " + error,
      });
    }
  }, [puedeAdministrar]);

  useEffect(() => {
    cargarPeriodos();
  }, [cargarPeriodos]);

  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => setMensaje(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  const handleEliminar = async (id) => {
    try {
      console.log(id)
      await periodoService.eliminar(id);
      setMensaje({ tipo: "success", texto: "Periodo eliminado correctamente" });
      await cargarPeriodos();
    } catch (error) {
      setMensaje({
        tipo: "error",
        texto: "Error al eliminar el periodo: " + error,
      });
    }
  };

  const handleEditar = (periodo) => {
    setFormData(periodo);
    setMostrarFormulario(true);
  };

  const handleExito = async (texto) => {
    setMensaje({ tipo: "success", texto });
    setFormData(null);
    setMostrarFormulario(false);
    await cargarPeriodos();
  };

  const handleCancelar = () => {
    setFormData(null);
    setMostrarFormulario(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-4xl font-semibold mb-4">
        {puedeAdministrar ? "Gestión de Periodos" : "Listado de Periodos"}
      </h1>

      <button onClick={() => navigate("/")} className="btn btn-secondary mb-4">
        ← Volver al Menú
      </button>

      {puedeAdministrar && (
        <button
          onClick={() => setMostrarFormulario(true)}
          className="btn btn-primary mb-4"
        >
          ➕ Registrar nuevo Periodo
        </button>
      )}

      {mostrarFormulario && (
        <dialog id="modalPeriodo" className="modal modal-open">
          <div className="modal-box w-11/12 max-w-3xl">
            <h3 className="font-bold text-lg mb-4">
              {formData ? "Editar Periodo" : "Registrar Nuevo Periodo"}
            </h3>
            <FormularioPeriodo onExito={handleExito} initialData={formData} />

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
          { key: "anio", label: "Año" },
          { key: "descripcion", label: "Descripción" },
          { key: "progreso", label: "Progreso" },
          ...(puedeAdministrar ? [{ key: "estado", label: "Estado" }] : []),
        ]}
        datos={periodos}
        onEditar={handleEditar}
        onEliminar={handleEliminar}
        idKey="id_periodo"
        mostrarAcciones={puedeAdministrar}
      />
    </div>
  );
}