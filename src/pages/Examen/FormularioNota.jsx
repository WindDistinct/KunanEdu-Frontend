import React, { useEffect, useState } from "react";
import { alumnoService, examenService } from "../../api/requestApi";

export default function FormularioNota({ initialData, onCerrar, onExito }) {
  const [alumnos, setAlumnos] = useState([]);
  const [bimestre, setBimestre] = useState("");
  const [notas, setNotas] = useState({});
  const [notasCargadas, setNotasCargadas] = useState({});
  const [error, setError] = useState(null);
  const [mensajeExito, setMensajeExito] = useState(null);


  useEffect(() => {
    console.log(initialData)
    if (initialData) {
      cargarAlumnos(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    if (mensajeExito) {
      const timer = setTimeout(() => setMensajeExito(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [mensajeExito]);

  const cargarAlumnos = async (curso) => {
    try {
      const response = await alumnoService.obtenerAlumnosPorAula(
        curso.numero_aula,
        curso.id_curso_seccion
      );
      setAlumnos(response);
    } catch (error) {
      console.error("Error al cargar alumnos:", error);
    }
  };

  useEffect(() => {
    const cargarNotas = async () => {
      if (!bimestre || !initialData) return;

      try {
        const notasExistentes = await examenService.obtenerNotasBimestre(
          initialData.numero_aula,
          bimestre,
          initialData.id_curso_seccion
        );
        console.log(notasExistentes)
        const notasMap = {};
        notasExistentes.forEach((n) => {
          notasMap[n.id_alumno] = n.nota;
        });

        setNotasCargadas(notasMap);
        setNotas(notasMap);
      } catch (error) {
        console.error("Error al obtener notas existentes:", error);
      }
    };

    cargarNotas();
  }, [bimestre, initialData]);

  const handleNotaChange = (idAlumno, valor) => {
    const notaNumerica = parseFloat(valor);

    // Permitir limpiar
    if (valor === "") {
      setError(null);
      setNotas((prev) => ({
        ...prev,
        [idAlumno]: "",
      }));
      return;
    }

    // Validar rango
    if (isNaN(notaNumerica) || notaNumerica < 0 || notaNumerica > 20) {
      setError(`La nota para el alumno ${idAlumno} debe estar entre 0 y 20.`);
      return;
    }

    setError(null);
    setNotas((prev) => ({
      ...prev,
      [idAlumno]: valor,
    }));
  };
  const handleGuardar = async () => {
    try {

      if (!initialData || !initialData.id_examen) {
        console.error("❌ No se puede guardar porque falta el ID del examen.");
        setError("Error interno: examen no definido.");
        return;
      }

      const payload = alumnos
        .filter((alumno) => !notasCargadas.hasOwnProperty(alumno.id_alumno))
        .filter(
          (alumno) =>
            notas[alumno.id_alumno] !== undefined &&
            notas[alumno.id_alumno] !== ""
        )
        .map((alumno) => ({
          id_examen: initialData.id_examen,
          id_matricula: alumno.id_matricula,
          nota: parseFloat(notas[alumno.id_alumno]),
        }));

      console.log("Payload a enviar:", payload);

      if (payload.length === 0) {
        setMensajeExito("No se ha ingresado una nota");
        onExito("No se ha ingresado una nota");
        onCerrar();
        return
      }
      await examenService.registrarNotas(payload);
      onCerrar();
      setMensajeExito("Nota ingresada con éxito");
      onExito("Nota ingresada con éxito");
    } catch (error) {
      console.error("Error al insertar nota:", error.message, error.stack);
      throw error; // esto es lo que provoca el 500
    }
  };

  // 🔍 Verifica si hay al menos un alumno sin nota registrada
  const hayCamposDisponibles =
    bimestre &&
    alumnos.some((a) => !notasCargadas.hasOwnProperty(a.id_alumno));

  return (
    <div className="space-y-4">
      {error && <div className="alert alert-error">{error}</div>}
      <div>
        <label className="block font-semibold mb-1">Bimestre:</label>
        <select
          className="select select-bordered w-full"
          value={bimestre}
          onChange={(e) => setBimestre(e.target.value)}
        >
          <option value="">Seleccione un bimestre</option>
          <option value="Primer Bimestre">1° Bimestre</option>
          <option value="Segundo Bimestre">2° Bimestre</option>
          <option value="Tercer Bimestres">3° Bimestre</option>
          <option value="Cuarto Bimestre">4° Bimestre</option>
        </select>
      </div>

      <div>
        <h4 className="font-semibold mb-2">Alumnos:</h4>
        {alumnos.map((alumno) => (
          <div key={alumno.id_alumno} className="flex items-center gap-4 mb-2">
            <span className="w-1/3">{alumno.nombre_completo}</span>
            <input
              type="number"
              min="0"
              max="20"
              step="0.1"
              className="input input-bordered w-24"
              value={notas[alumno.id_alumno] ?? ""}
              onChange={(e) =>
                handleNotaChange(alumno.id_alumno, e.target.value)
              }
              disabled={
                !bimestre ||
                notasCargadas.hasOwnProperty(alumno.id_alumno)
              }
            />
          </div>
        ))}
      </div>

      <button
        className="btn btn-success"
        onClick={handleGuardar}
        disabled={!hayCamposDisponibles}
      >
        Guardar Notas
      </button>
    </div>
  );
}