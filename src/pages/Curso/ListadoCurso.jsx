import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { cursoService } from "../../api/requestApi";
import Tabla from "../../components/Tabla";
import FormularioCurso from "./FormularioCurso";
import Notificacion from "../../components/Notificacion";

export default function ListadoCurso() {
  const [cursos, setCursos] = useState([]);
  const [formData, setFormData] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const navigate = useNavigate();

  const [rol] = useState(() => localStorage.getItem("rol"));
  const puedeAdministrar = rol === "administrador";

  const cargarCursos = useCallback(async () => {
    try {
      const data =
        rol === "administrador"
          ? await cursoService.obtenerTodos()
          : await cursoService.obtener();

      const cursosOrdenados = data.sort((a, b) => a.id_curso - b.id_curso);
      setCursos(cursosOrdenados);
    } catch (error) {
      setMensaje({ tipo: "error", texto: "Error al cargar los cursos: " + error });
    }
  }, [rol]);

  useEffect(() => {
    cargarCursos();
  }, [cargarCursos]);

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
      await cursoService.eliminar(id);
      setMensaje({ tipo: "success", texto: "Curso eliminado correctamente" });
      await cargarCursos();
    } catch (error) {
      setMensaje({ tipo: "error", texto: "Error al eliminar el curso: " + error });
    }
  };

  const handleEditar = (curso) => {
    setFormData(curso);
    setMostrarFormulario(true);
  };

  const handleExito = async (texto) => {
    setMensaje({ tipo: "success", texto });
    setFormData(null);
    setMostrarFormulario(false);
    await cargarCursos();
  };

  const handleCancelar = () => {
    setFormData(null);
    setMostrarFormulario(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-4xl font-semibold mb-4">
        {puedeAdministrar ? "Gestión de Cursos" : "Listado de Cursos"}
      </h1>

      <button onClick={() => navigate("/")} className="btn btn-secondary mb-4">
        ← Volver al Menú
      </button>

      {puedeAdministrar && (
        <button
          onClick={() => setMostrarFormulario(true)}
          className="btn btn-primary mb-4"
        >
          ➕ Registrar nuevo Curso
        </button>
      )}

      {mostrarFormulario && (
        <dialog id="modalCurso" className="modal modal-open">
          <div className="modal-box w-11/12 max-w-3xl">
            <h3 className="font-bold text-lg mb-4">
              {formData ? "Editar Curso" : "Registrar Nuevo Curso"}
            </h3>
            <FormularioCurso onExito={handleExito} initialData={formData} />

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
          { key: "nombre_curso", label: "Nombre del Curso" },
          ...(puedeAdministrar ? [{ key: "estado", label: "Estado" }] : []),
        ]}
        datos={cursos}
        onEditar={handleEditar}
        onEliminar={handleEliminar}
        idKey="id_curso"
        mostrarAcciones={puedeAdministrar}
      />
    </div>
  );
}