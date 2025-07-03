import React, { useEffect, useState, useCallback } from "react";
import Tabla from "../../components/Tabla";
import { empleadoService, periodoService } from "../../api/requestApi";
import Notificacion from "../../components/Notificacion";
import { useNavigate } from "react-router-dom"; 
import FormularioAsistencia from "./FormularioAsistencia";

export default function ListadoCursosAsistencia() {
  const [cursos, setCursos] = useState([]);
  const [mensaje, setMensaje] = useState(null);
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState("");
  const [periodosDisponibles, setPeriodosDisponibles] = useState([]);
  const [formData, setFormData] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const navigate = useNavigate();

  const id_usuario = localStorage.getItem("id_usuario");

  const cargarCursos = useCallback(async () => {
    if (!id_usuario || !periodoSeleccionado) return;

    try {
      const data = await empleadoService.obtenerCursosPorUsuario(
        id_usuario,
        periodoSeleccionado
      ); 
      setCursos(data);
    } catch (error) {
      setMensaje({ tipo: "error", texto: "Error al cargar los cursos: " + error });
    }
    }, [id_usuario, periodoSeleccionado]);

  const cargarPeriodos = async () => {
    try { 
     const data=await periodoService.obtener() 
      setPeriodosDisponibles(data); 
    } catch (error) {
      setMensaje({ tipo: "error", texto: "Error al cargar los periodo: " + error });
    }

  };

  useEffect(() => {
    cargarPeriodos();
  }, []);

  useEffect(() => {
    cargarCursos();
  }, [cargarCursos]);

  const handleExito = async (texto) => {
    setMensaje({ tipo: "success", texto });
    setFormData(null);
    setMostrarFormulario(false);
  };

  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => {
        setMensaje(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  const handleEditar = (curso) => {
    setFormData(curso);
    setMostrarFormulario(true);
  };
  const handleCancelar = () => {
    setFormData(null);
    setMostrarFormulario(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-4xl font-semibold mb-4">Asistencia de mis Alumnos por Curso</h1>

      <button onClick={() => navigate("/")} className="btn btn-secondary mb-4">
        ← Volver al Menú
      </button>

      <div className="mb-4">
        <label className="block text-lg font-medium mb-2">Selecciona un Periodo:</label>
        <select
          className="select select-bordered w-full max-w-xs"
          value={periodoSeleccionado}
          onChange={(e) => setPeriodoSeleccionado(e.target.value)}
        >
          <option value="">-- Selecciona un periodo --</option>
          {periodosDisponibles.map((p) => (
            <option key={p.id_periodo} value={p.id_periodo}>
              {p.anio} {p.descripcion}
            </option>
          ))}
        </select>
      </div>
           
      {mostrarFormulario && (
        <dialog id="modalNota" className="modal modal-open">
          <div className="modal-box w-11/12 max-w-4xl">
            <h3 className="font-bold text-lg mb-4">
              Asistencia del Curso - {formData?.nombre_curso}
            </h3>

            <FormularioAsistencia initialData={formData} onCerrar={handleCancelar} onExito={handleExito} />

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

      {periodoSeleccionado && (
        <Tabla
          columnas={[
            { key: "nombre_curso", label: "Curso" },
            { key: "numero_aula", label: "Aula" },
            { key: "seccion", label: "Sección" },
            { key: "grado", label: "Grado" },
            { key: "periodo", label: "Periodo" },
          ]}
         datos={cursos}
  onEditar={handleEditar}
  idKey="id_curso_seccion"
  mostrarAcciones={true}
  textoBotonAccion="Ingresar Asistencia"  
  soloBotonEditar={true}  
        />
      )}
    </div>
  );
}