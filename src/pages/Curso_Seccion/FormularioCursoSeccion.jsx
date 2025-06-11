import React, { useEffect, useState } from "react";
import {
  cursoGradoService,
  cursoSeccionService,
  empleadoService,
  periodoService,
} from "../../api/requestApi";

export default function FormularioCursoSeccion({ onExito }) {
  const [periodos, setPeriodos] = useState([]);
  const [secciones, setSecciones] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [cursosDelGrado, setCursosDelGrado] = useState([]);

  const [periodoSeleccionado, setPeriodoSeleccionado] = useState("");
  const [seccionSeleccionada, setSeccionSeleccionada] = useState("");
  const [gradoSeccion, setGradoSeccion] = useState("");

  const [seleccionDocentes, setSeleccionDocentes] = useState({});
  const [mensajeExito, setMensajeExito] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarIniciales = async () => {
      try {
        const [periodosData, docentesData] = await Promise.all([
          periodoService.obtener(),
          empleadoService.obtenerDocentes(),
        ]);
        setPeriodos(periodosData);
        setDocentes(docentesData);
      } catch {
        setError("Error al cargar datos iniciales.");
      }
    };
    cargarIniciales();
  }, []);

  const handlePeriodoChange = async (e) => {
    const idPeriodo = e.target.value;
    setPeriodoSeleccionado(idPeriodo);
    setSeccionSeleccionada("");
    setCursosDelGrado([]);
    setSeleccionDocentes({});
    try {
      const seccionesData = await periodoService.obtenerSeccionesPeriodo(idPeriodo);
      setSecciones(seccionesData);
    } catch {
      setError("Error al cargar secciones del periodo.");
    }
  };

  const handleSeccionChange = async (e) => {
    const idSeccion = e.target.value;
    setError("");
    setSeccionSeleccionada(idSeccion);
    setSeleccionDocentes({});
    try {
      const seccion = secciones.find((s) => s.id_seccion === parseInt(idSeccion));
      setGradoSeccion(seccion.id_grado); 
      const cursosData = await cursoGradoService.obtenerCursosPorGrado(seccion.id_grado); // debe ser tu método para traer cursos de un grado
      if (!cursosData.length) {
        setCursosDelGrado([]);
        setSeleccionDocentes({});
        return setError("No hay cursos asignados al grado al que pertenece esta sección.");
      }   
    setCursosDelGrado(cursosData); 
      // inicializamos el estado de selección de docentes
      const inicialDocentes = {};
      cursosData.forEach((c) => {
        inicialDocentes[c.id_curso] = "";
      });
      setSeleccionDocentes(inicialDocentes);
    } catch {
      setError("Error al obtener cursos por grado.");
    }
  };

  const handleDocenteChange = (idCurso, idDocente) => {
    setSeleccionDocentes((prev) => ({
      ...prev,
      [idCurso]: idDocente,
    }));
  };

  const validarFormulario = () => {
    for (const idCurso of Object.keys(seleccionDocentes)) {
      if (!seleccionDocentes[idCurso]) {
        return "Debe seleccionar un docente para cada curso.";
      }
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const errorValidacion = validarFormulario();
    if (errorValidacion) {
      setError(errorValidacion);
      return;
    }

    const payload = Object.entries(seleccionDocentes).map(([idCurso, idDocente]) => ({
      curso: parseInt(idCurso),
      seccion: parseInt(seccionSeleccionada),
      docente: parseInt(idDocente),
    }));

    try {
      console.log(payload)
      await cursoSeccionService.envioListaCursosYdocentes(payload);
      setMensajeExito("Cursos asignados correctamente.");
      setSeleccionDocentes({});
      setCursosDelGrado([]);
      setSeccionSeleccionada("");
    } catch {
      setError("Error al registrar las asignaciones. Verifique duplicados.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="alert alert-error">{error}</div>}
      {mensajeExito && <div className="alert alert-success">{mensajeExito}</div>}

      {/* Periodo */}
      <select
        className="select select-bordered w-full"
        value={periodoSeleccionado}
        onChange={handlePeriodoChange}
      >
        <option value="" disabled>Seleccionar Periodo Escolar</option>
        {periodos.map((p) => (
          <option key={p.id_periodo} value={p.id_periodo}>
            {p.descripcion} {p.anio}
          </option>
        ))}
      </select>

      {/* Sección */}
      <select
        className="select select-bordered w-full"
        value={seccionSeleccionada}
        onChange={handleSeccionChange}
        disabled={!periodoSeleccionado}
      >
        <option value="" disabled>Seleccionar Sección</option>
        {secciones.map((s) => (
          <option key={s.id_seccion} value={s.id_seccion}>
            {s.nombre} - {s.grado} - {s.aula}
          </option>
        ))}
      </select>

      {/* Cursos del grado con select de docentes */}
      {cursosDelGrado.length > 0 && (
        <div className="grid gap-4">
          {cursosDelGrado.map((curso) => (
            <div key={curso.id_curso} className="flex items-center gap-4">
              <span className="w-1/2">{curso.curso}</span>
              <select
                className="select select-bordered w-1/2"
                value={seleccionDocentes[curso.id_curso] || ""}
                onChange={(e) => handleDocenteChange(curso.id_curso, e.target.value)}
              >
                <option value="">Seleccionar Docente</option>
                {docentes.map((d) => (
                  <option key={d.id_emp} value={d.id_emp}>
                    {d.nombre_completo} - {d.especialidad}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

      <button
        type="submit"
        className="btn btn-success mt-4"
        disabled={cursosDelGrado.length === 0}
      >
        Registrar Asignación
      </button>
    </form>
  );
}