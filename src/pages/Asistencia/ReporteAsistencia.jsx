import React, { useEffect, useState } from "react";
import { asistenciaService, periodoService, empleadoService } from "../../api/requestApi";
import Tabla from "../../components/Tabla";
import Notificacion from "../../components/Notificacion";

import { useNavigate } from "react-router-dom"; 

const MESES = [
  { nombre: "Enero", valor: 1 },
  { nombre: "Febrero", valor: 2 },
  { nombre: "Marzo", valor: 3 },
  { nombre: "Abril", valor: 4 },
  { nombre: "Mayo", valor: 5 },
  { nombre: "Junio", valor: 6 },
  { nombre: "Julio", valor: 7 },
  { nombre: "Agosto", valor: 8 },
  { nombre: "Septiembre", valor: 9 },
  { nombre: "Octubre", valor: 10 },
  { nombre: "Noviembre", valor: 11 },
  { nombre: "Diciembre", valor: 12 },
];

export default function ReporteAsistenciaAlumno() {
const navigate = useNavigate();
  const [periodos, setPeriodos] = useState([]);
  const [secciones, setSecciones] = useState([]);
  const [resultados, setResultados] = useState([]);
  const [mensaje, setMensaje] = useState(null);

  const [periodoSeleccionado, setPeriodoSeleccionado] = useState("");
  const [cursoSeccionSeleccionado, setCursoSeccionSeleccionado] = useState("");
  const [mesSeleccionado, setMesSeleccionado] = useState("");

  const id_usuario = localStorage.getItem("id_usuario");

  // Obtener periodos y cursos al iniciar
  useEffect(() => {
    const cargarDatosIniciales = async () => {
      try {
        const periodosResp = await periodoService.obtener();
        setPeriodos(periodosResp);

        const cursosResp = await empleadoService.obtenerCursosPorUsuario(id_usuario, periodosResp[0]?.id_periodo);
        setSecciones(cursosResp);
      } catch (error) {
        setMensaje({ tipo: "error", texto: "Error al cargar los datos iniciales" });
      }
    };
    cargarDatosIniciales();
  }, [id_usuario]);

  // Cuando cambia el periodo, actualiza las secciones
  useEffect(() => {
    const cargarSecciones = async () => {
      if (!periodoSeleccionado) return;
      try {
        const cursosResp = await empleadoService.obtenerCursosPorUsuario(id_usuario, periodoSeleccionado);
        setSecciones(cursosResp);
      } catch (error) {
        setMensaje({ tipo: "error", texto: "Error al cargar cursos" });
      }
    };
    cargarSecciones();
  }, [periodoSeleccionado, id_usuario]);

  const buscarAsistencia = async () => {
    try {
      const data = await asistenciaService.reporteAsistencia({
        cursoSeccion: cursoSeccionSeleccionado,
        periodo: periodoSeleccionado,
        mes: mesSeleccionado,
      });
      setResultados(data);
    } catch (error) {
      setMensaje({ tipo: "error", texto: "Error al obtener asistencias" });
    }
  };

  return (
    <div className="container mt-4">
        <h1 className="text-3xl font-bold mb-4">Reporte de Asistencia</h1>
        <button onClick={() => navigate("/")} className="btn btn-secondary mb-3">
            Volver al Menú
        </button>
      <br />
      <br />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block font-medium">Periodo:</label>
          <select
            className="select select-bordered w-full"
            value={periodoSeleccionado}
            onChange={(e) => setPeriodoSeleccionado(e.target.value)}
          >
            <option value="">-- Selecciona --</option>
            {periodos.map((p) => (
              <option key={p.id_periodo} value={p.id_periodo}>
                {p.anio} {p.descripcion}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium">Curso - Sección:</label>
          <select
            className="select select-bordered w-full"
            value={cursoSeccionSeleccionado}
            onChange={(e) => setCursoSeccionSeleccionado(e.target.value)}
          >
            <option value="">-- Selecciona --</option>
            {secciones.map((s) => (
              <option key={s.id_curso_seccion} value={s.id_curso_seccion}>
                {s.nombre_curso} - {s.numero_aula} - {s.seccion}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium">Mes:</label>
          <select
            className="select select-bordered w-full"
            value={mesSeleccionado}
            onChange={(e) => setMesSeleccionado(e.target.value)}
          >
            <option value="">-- Selecciona --</option>
            {MESES.map((m) => (
              <option key={m.valor} value={m.valor}>{m.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      <button className="btn btn-primary mb-4" onClick={buscarAsistencia}>
        Buscar
      </button>

      {mensaje && <Notificacion tipo={mensaje.tipo} mensaje={mensaje.texto} />}

      {resultados.length > 0 && (
        <Tabla
          columnas={[
            { key: "fecha", label: "Fecha" },
            { key: "dia", label: "Día" },
            { key: "asistio", label: "Asistió" },
            { key: "alumno", label: "Alumno" },
            { key: "nombre_curso", label: "Curso" },
            { key: "periodo", label: "Periodo" },
          ]}
          datos={resultados}
          idKey="id_asistencia"
          mostrarAcciones={false}
        />
      )}
    </div>
  );
}