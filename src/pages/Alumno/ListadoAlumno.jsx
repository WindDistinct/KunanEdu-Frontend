import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { alumnoService } from "../../api/requestApi";
import Tabla from "../../components/Tabla";
import FormularioAlumno from "./FormularioAlumno";
import Notificacion from "../../components/Notificacion";

export default function ListadoAlumno() {
  const [alumnos, setAlumnos] = useState([]);
  const [formData, setFormData] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const navigate = useNavigate();

  const [rol] = useState(() => localStorage.getItem("rol"));
  const puedeAdministrar = rol === "administrador";

  const cargarAlumnos = useCallback(async () => {
    try {
      const data =
        rol === "administrador"
          ? await alumnoService.obtenerTodos()
          : await alumnoService.obtener();

      const alumnosFormateados = data
        .map((alumno) => ({
          ...alumno,
          fecha_nacimiento: alumno.fecha_nacimiento
            ? alumno.fecha_nacimiento.split("T")[0]
            : "",
        }))
        .sort((a, b) => a.id_alumno - b.id_alumno);

      setAlumnos(alumnosFormateados);
    } catch (error) {
      setMensaje({ tipo: "error", texto: "Error al cargar los alumnos" });
    }
  }, [rol]);

  useEffect(() => {
    cargarAlumnos();
  }, [cargarAlumnos]);

  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => setMensaje(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  const handleEliminar = async (id) => {
    try {
      await alumnoService.eliminar(id);
      setMensaje({ tipo: "success", texto: "Alumno eliminado correctamente" });
      await cargarAlumnos();
    } catch (error) {
      setMensaje({ tipo: "error", texto: "Error al eliminar el alumno" });
    }
  };

  const handleEditar = (alumno) => {
    setFormData(alumno);
    setMostrarFormulario(true);
  };

  const handleExito = async (texto) => {
    setMensaje({ tipo: "success", texto });
    setFormData(null);
    setMostrarFormulario(false);
    await cargarAlumnos();
  };

  const handleCancelar = () => {
    setFormData(null);
    setMostrarFormulario(false);
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-4xl font-semibold mb-4">
        {puedeAdministrar ? "Gestión de Alumno" : "Listado de Alumnos"}
      </h1>

      <button onClick={() => navigate("/")} className="btn btn-secondary mb-4">
        ← Volver al Menú
      </button>

      {puedeAdministrar && (
        <button
          onClick={() => setMostrarFormulario(true)}
          className="btn btn-primary mb-4"
        >
          ➕ Registrar nuevo Alumno
        </button>
      )}

      {/* Notificación con espacio reservado fijo */}
      <div className="h-12 mb-4">
        <Notificacion mensaje={mensaje?.texto} tipo={mensaje?.tipo} />
      </div>

      {/* Modal de formulario */}
      {mostrarFormulario && (
        <dialog id="modalAlumno" className="modal modal-open">
          <div className="modal-box w-11/12 max-w-3xl">
            <h3 className="font-bold text-lg mb-4">
              {formData ? "Editar Alumno" : "Registrar Nuevo Alumno"}
            </h3>
            <FormularioAlumno onExito={handleExito} initialData={formData} />

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

      {/* Tabla */}
      <Tabla
        columnas={[
          { key: "nombre", label: "Nombres" },
          { key: "apellido_paterno", label: "Apellido Paterno" },
          { key: "apellido_materno", label: "Apellido Materno" },
          { key: "dni", label: "DNI" },
          { key: "direccion", label: "Dirección" },
          { key: "telefono", label: "Teléfono" },
          { key: "fecha_nacimiento", label: "Fecha Nacimiento" },
          ...(puedeAdministrar ? [{ key: "estado", label: "Estado" }] : []),
        ]}
        datos={alumnos}
        onEditar={handleEditar}
        onEliminar={handleEliminar}
        idKey="id_alumno"
        mostrarAcciones={puedeAdministrar}
      />
    </div>
  );
}
