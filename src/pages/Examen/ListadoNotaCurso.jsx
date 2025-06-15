import React, { useEffect, useState, useCallback } from "react";
import Tabla from "../../components/Tabla";
import { empleadoService, periodoService, examenService } from "../../api/requestApi";
import Notificacion from "../../components/Notificacion";
import { useNavigate } from "react-router-dom";

export default function ListadoNotasPorCurso() {
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
    console.log(cursoSeleccionado)
    console.log(periodoSeleccionado)
    if (!cursoSeleccionado) return;

    try {
      const data = await examenService.obtenerNotasCurso(id_usuario,periodoSeleccionado,cursoSeleccionado);
      setNotas(data);
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

  return (
    <div className="p-4">
      <h1 className="text-4xl font-semibold mb-4">Notas por Curso</h1>

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
          ]}
          datos={notas}
          idKey="id_examen"
        />
      )}
    </div>
  );
}