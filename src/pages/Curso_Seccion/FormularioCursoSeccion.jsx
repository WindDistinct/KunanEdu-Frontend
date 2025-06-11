import React, { useEffect, useState } from "react";
import {
  cursoGradoService,
  cursoSeccionService,
  empleadoService,
  periodoService,
  cursoService,
} from "../../api/requestApi";

export default function FormularioCursoSeccion({ onExito, initialData }) {
  const [periodos, setPeriodos] = useState([]);
  const [secciones, setSecciones] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [cursosDelGrado, setCursosDelGrado] = useState([]);
  const [cursoActual, setCursoActual] = useState(null);

  const [periodoSeleccionado, setPeriodoSeleccionado] = useState("");
  const [seccionSeleccionada, setSeccionSeleccionada] = useState("");
  const [gradoSeccion, setGradoSeccion] = useState("");

  const [seleccionDocentes, setSeleccionDocentes] = useState({});
  const [mensajeExito, setMensajeExito] = useState(null);
  const [error, setError] = useState(null);
  const esEdicion = !!initialData;

  useEffect(() => {
    const cargarIniciales = async () => {
      try {
        const docentesData = await empleadoService.obtenerDocentes();
        setDocentes(docentesData);
console.log(initialData)
        if (esEdicion) { 
           setCursoActual({
          id_curso: initialData.id_curso,
          nombre_curso: `Curso ID ${initialData.id_curso}` // puedes personalizarlo si tienes el nombre
           });
          setSeleccionDocentes({ [initialData.curso]: initialData.docente });
        } else {
          const periodosData = await periodoService.obtener();
          setPeriodos(periodosData);
        }
      } catch {
        setError("Error al cargar datos iniciales.");
      }
    };
    cargarIniciales();
  }, [esEdicion, initialData]);

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
    setSeccionSeleccionada(idSeccion);
    setSeleccionDocentes({});
    setError("");
    try {
      const seccion = secciones.find((s) => s.id_seccion === parseInt(idSeccion));
      setGradoSeccion(seccion.id_grado);

      const yaAsignados = await cursoSeccionService.verificarCursosAsignados(idSeccion);
      if (yaAsignados.asignados) {
        setCursosDelGrado([]);
         setSeleccionDocentes({});
        return setError("Esta sección ya tiene cursos asignados.");
      }

      const cursosData = await cursoGradoService.obtenerCursosPorGrado(seccion.id_grado);
      if (!cursosData.length) {
        setCursosDelGrado([]);
         setSeleccionDocentes({});
        return setError("No hay cursos asignados al grado correspondiente.");
      }

      setCursosDelGrado(cursosData);
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
    if (errorValidacion) return setError(errorValidacion);

    const payload = Object.entries(seleccionDocentes).map(([idCurso, idDocente]) => ({
      curso: parseInt(idCurso),
      seccion: esEdicion ? initialData.seccion : parseInt(seccionSeleccionada),
      docente: parseInt(idDocente),
    }));

    try {
      await cursoSeccionService.envioListaCursosYdocentes(payload);
      setMensajeExito("Registro exitoso.");
      onExito("Operación completada con éxito");
    } catch {
      setError("Error al registrar la información.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="alert alert-error">{error}</div>}
      {mensajeExito && <div className="alert alert-success">{mensajeExito}</div>}

      {!esEdicion && (
        <>
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
        </>
      )}

      {/* Cursos y docentes */}
      {esEdicion ? (
        <div className="flex items-center gap-4">
          <span className="font-semibold">{cursoActual?.nombre_curso}</span>
          <select
            className="select select-bordered"
            value={seleccionDocentes[initialData.curso] || ""}
            onChange={(e) => handleDocenteChange(initialData.curso, e.target.value)}
          >
            <option value="">Seleccionar Docente</option>
            {docentes.map((d) => (
              <option key={d.id_emp} value={d.id_emp}>
                {d.nombre_completo}
              </option>
            ))}
          </select>
        </div>
      ) : (
        cursosDelGrado.length > 0 && (
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
        )
      )}

      <button type="submit" className="btn btn-primary">
        {esEdicion ? "Guardar Cambios" : "Registrar"}
      </button>
    </form>
  );
}
