import React, { useEffect, useState } from "react";
import { alumnoService, asistenciaService } from "../../api/requestApi";

export default function FormularioAsistencia({ initialData, onCerrar, onExito }) {
  const [alumnos, setAlumnos] = useState([]);
  const [asistencias, setAsistencias] = useState({});
  const [fecha, setFecha] = useState("");
  const [error, setError] = useState(null);
  const [mensajeExito, setMensajeExito] = useState(null);

  const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sabado"];

  useEffect(() => {
    if (initialData) {
      cargarAlumnos(initialData);
    }
  }, [initialData]);

  const cargarAlumnos = async (curso) => {
    try {
      const response = await alumnoService.obtenerAlumnosPorAula(
        curso.numero_aula,
        curso.id_curso_seccion
      );
      setAlumnos(response);
    } catch (error) {
      setError("Error al cargar alumnos.");
    }
  };
 
  useEffect(() => {
    if (!fecha || alumnos.length === 0) return;
    cargarAsistenciasExistentes();
  }, [fecha, alumnos]);
 
  const obtenerNombreDia = (fechaTexto) => {
    const [year, month, day] = fechaTexto.split("-").map(Number);
    const fechaLocal = new Date(year, month - 1, day);
    return diasSemana[fechaLocal.getDay()];
  };

  const cargarAsistenciasExistentes = async () => {
    try {
      const response = await asistenciaService.obtenerPorFechaYCurso(
        initialData.id_curso_seccion,
        fecha
      ); 
 
      const asistenciasMap = {}; 
      response.forEach((a) => {
        asistenciasMap[a.id_matricula] = a.asistio;
      });
 
      alumnos.forEach((a) => {
        if (!(a.id_matricula in asistenciasMap)) {
          asistenciasMap[a.id_matricula] = false;
            console.log(asistenciasMap[a.id_matricula])
        }
      }); 
      setAsistencias(asistenciasMap);
    } catch (err) {
      console.error("Error al obtener asistencias existentes:", err);
      setError("Error al consultar asistencias registradas.");
    }
  };

  const toggleAsistencia = (id_matricula) => {
    setAsistencias((prev) => ({
      ...prev,
      [id_matricula]: !prev[id_matricula],
    }));
  };

  const handleGuardar = async () => {
    if (!fecha) return setError("Debes seleccionar una fecha.");
    const dia = obtenerNombreDia(fecha);

    try {
      const payload = alumnos.map((a) => ({
        id_matricula: a.id_matricula,
        id_curso_seccion: initialData.id_curso_seccion,
        fecha,
        dia,
        asistio: asistencias[a.id_matricula],
      })); 
      await asistenciaService.guardarListado(payload);
      setMensajeExito("Asistencia registrada correctamente.");
      onExito("Asistencia registrada.");
    } catch (err) {
      setError("Error al guardar la asistencia.");
    }
  };

  return (
    <div className="space-y-4">
      {error && <div className="alert alert-error">{error}</div>}
      {mensajeExito && <div className="alert alert-success">{mensajeExito}</div>}
 
      <div>
        <label className="label">Seleccionar fecha:</label>
        <input
          type="date"
          className="input input-bordered w-full max-w-xs"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />
      </div>
 
      <div>
        <h4 className="font-semibold mb-2">Alumnos:</h4>
        {alumnos.map((alumno) => (
          <div key={alumno.id_alumno} className="flex items-center gap-4 mb-2">
            <span className="w-1/2">{alumno.nombre_completo}</span>
            <input
              type="checkbox"
              className="checkbox checkbox-success"
              checked={asistencias[alumno.id_matricula] || false}
              onChange={() => toggleAsistencia(alumno.id_matricula)}
            />
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <button className="btn btn-success" onClick={handleGuardar}>
          Guardar Asistencia
        </button> 
      </div>
    </div>
  );
}