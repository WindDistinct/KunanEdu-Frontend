import React, { useEffect, useState, useCallback } from "react";
import Tabla from "../../components/Tabla";
import { empleadoService, periodoService, examenService } from "../../api/requestApi";
import Notificacion from "../../components/Notificacion";
import { useNavigate } from "react-router-dom";
import FormularioNotaCurso from "./FormularioNotaCurso";

export default function ListadoNotasPorCurso() {
    const [formData, setFormData] = useState(null);
     const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [periodos, setPeriodos] = useState([]);
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState("");
  const [cursos, setCursos] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState("");
  const [notas, setNotas] = useState([]);
  const [mensaje, setMensaje] = useState(null);
  const navigate = useNavigate();

  const id_usuario = localStorage.getItem("id_usuario");

  const cargarPeriodos = async () => {
    try {
      const data = await periodoService.obtener();
      setPeriodos(data);
    } catch (error) {
      setMensaje({ tipo: "error", texto: "Error al cargar los periodos: " + error });
    }
  };

  const cargarCursos = useCallback(async () => {
    if (!id_usuario || !periodoSeleccionado) return;

    try {
      const data = await empleadoService.obtenerCursosPorUsuario(id_usuario, periodoSeleccionado);
      setCursos(data);
      setCursoSeleccionado(""); // Reinicia selección anterior
      setNotas([]);
    } catch (error) {
      setMensaje({ tipo: "error", texto: "Error al cargar cursos: " + error });
    }
  }, [id_usuario, periodoSeleccionado]);

  const cargarNotas = useCallback(async () => { 
    if (!cursoSeleccionado) return;

    try {
      const data = await examenService.obtenerNotasCurso(id_usuario,periodoSeleccionado,cursoSeleccionado);
      
       const examenOrdenadas = data.sort((a, b) => a.id_examen - b.id_examen);
       setNotas(examenOrdenadas);
    } catch (error) {
      setMensaje({ tipo: "error", texto: "Error al cargar notas: " + error });
    }
  }, [cursoSeleccionado]);

  useEffect(() => {
    cargarPeriodos();
  }, []);

  useEffect(() => {
    cargarCursos();
  }, [cargarCursos]);

  useEffect(() => {
    cargarNotas();
  }, [cargarNotas]);

  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => setMensaje(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  const handleEditar = (nota) => {
  setFormData(nota);
  setMostrarFormulario(true);
  };

  const handleEliminar = async (id_examen) => {
    try {
      await examenService.eliminar(id_examen);
      setMensaje({ tipo: "success", texto: "Nota eliminada correctamente" });
      await cargarNotas();
    } catch (error) {
      setMensaje({ tipo: "error", texto: "Error al eliminar la nota: " + error });
    }
  };

  const handleExito = async (texto) => {
  setMensaje({ tipo: "success", texto });
  setFormData(null);
  setMostrarFormulario(false);
  await cargarNotas();
  };

  const handleCancelar = () => {
  setFormData(null);
  setMostrarFormulario(false);
  };


  return (
    <div className="p-4">
      <h1 className="text-4xl font-semibold mb-4">Notas por Curso</h1>

      <button onClick={() => navigate("/")} className="btn btn-secondary mb-4">
        ← Volver al Menú
      </button>

      {mostrarFormulario && (
      <dialog id="modalNota" className="modal modal-open">
        <div className="modal-box w-11/12 max-w-2xl">
          <h3 className="font-bold text-lg mb-4">
            {formData ? "Editar Nota" : "Registrar Nota"}
          </h3>

          <FormularioNotaCurso initialData={formData} onExito={handleExito} />

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
 

      <div className="mb-4">
        <label className="block text-lg font-medium mb-2">Selecciona un Periodo:</label>
        <select
          className="select select-bordered w-full max-w-xs"
          value={periodoSeleccionado}
          onChange={(e) => setPeriodoSeleccionado(e.target.value)}
        >
          <option value="">-- Selecciona un periodo --</option>
          {periodos.map((p) => (
            <option key={p.id_periodo} value={p.id_periodo}>
              {p.anio} {p.descripcion}
            </option>
          ))}
        </select>
      </div>

      {cursos.length > 0 && (
        <div className="mb-6">
          <label className="block text-lg font-medium mb-2">Selecciona un Curso:</label>
          <select
            className="select select-bordered w-full max-w-xs"
            value={cursoSeleccionado}
            onChange={(e) => setCursoSeleccionado(e.target.value)}
          >
            <option value="">-- Selecciona un curso --</option>
            {cursos.map((c) => (
              <option key={c.id_curso_seccion} value={c.id_curso_seccion}>
                {c.nombre_curso} - {c.seccion}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="h-12 mb-4">
        <Notificacion mensaje={mensaje?.texto} tipo={mensaje?.tipo} />
      </div>

      {cursoSeleccionado && (
        <Tabla
          columnas={[
            { key: "nombre_completo", label: "Alumno" },
              { key: "numero_aula", label: "Aula" },
              { key: "seccion", label: "Seccion" },
            { key: "bimestre", label: "Bimestre" },
            { key: "nota", label: "Nota" },
            { key: "estado", label: "Estado" }
          ]}
          datos={notas}
          onEditar={handleEditar}
          onEliminar={handleEliminar}
          mostrarAcciones={true}
          idKey="id_examen"
        />
      )}
    </div>
  );
}