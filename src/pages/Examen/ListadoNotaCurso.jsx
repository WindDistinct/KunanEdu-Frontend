import React, { useEffect, useState } from "react";
import { periodoService, alumnoService, notaService } from "../../api/requestApi";
import Notificacion from "../../components/Notificacion";

export default function ListadoNotasPorCurso() {
  const [periodos, setPeriodos] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState("");
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState("");
  const [reporte, setReporte] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [infoAlumno, setInfoAlumno] = useState(null);
  const [infoPeriodo, setInfoPeriodo] = useState(null);

  const cargarPeriodos = async () => {
    try {
      const data = await periodoService.obtener();
      setPeriodos(data);
    } catch {
      setMensaje({ tipo: "error", texto: "Error al cargar periodos" });
    }
  };

  const cargarAlumnos = async (periodoId) => {
    try {
      const data = await alumnoService.obtenerPorPeriodo(periodoId);
      setAlumnos(data);
      setAlumnoSeleccionado("");
      setReporte(null);
    } catch (error) {
      console.error("Error detallado:", error);
      setMensaje({ tipo: "error", texto: "Error al cargar alumnos" });
    }
  };

  const handleGenerarReporte = async () => {
    try {
      const data = await notaService.generarReporte(periodoSeleccionado, alumnoSeleccionado);
      setReporte(data);

      const alumno = alumnos.find((a) => a.id_alumno === parseInt(alumnoSeleccionado));
      const periodo = periodos.find((p) => p.id_periodo === parseInt(periodoSeleccionado));
      setInfoAlumno(alumno);
      setInfoPeriodo(periodo);
    } catch (error) {
      console.error("Error al generar reporte:", error);
      setMensaje({ tipo: "error", texto: "Error al generar reporte" });
    }
  };

  useEffect(() => {
    cargarPeriodos();
  }, []);

  useEffect(() => {
    if (periodoSeleccionado) {
      cargarAlumnos(periodoSeleccionado);
    }
  }, [periodoSeleccionado]);

  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => setMensaje(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  return (
    <div className="p-6">
      {/* CSS para impresión */}
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }

            .print-area, .print-area * {
              visibility: visible;
            }

            .print-area {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              padding: 20px;
            }

            button, select {
              display: none !important;
            }
          }
        `}
      </style>

      <h1 className="text-3xl font-bold mb-6">Reporte de Notas por Alumno</h1>

      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="block font-medium mb-1">Periodo</label>
          <select
            className="select select-bordered"
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

        {alumnos.length > 0 && (
          <div>
            <label className="block font-medium mb-1">Alumno</label>
            <select
              className="select select-bordered"
              value={alumnoSeleccionado}
              onChange={(e) => setAlumnoSeleccionado(e.target.value)}
            >
              <option value="">-- Selecciona un alumno --</option>
              {alumnos.map((a) => (
                <option key={a.id_alumno} value={a.id_alumno}>
                  {a.nombre} {a.apellido_paterno} {a.apellido_materno}
                </option>
              ))}
            </select>
          </div>
        )}

        {alumnoSeleccionado && (
          <div className="flex items-end gap-2">
            <button className="btn btn-primary" onClick={handleGenerarReporte}>
              Generar Reporte
            </button>
            {reporte && (
              <button className="btn btn-outline" onClick={() => window.print()}>
                Exportar a PDF
              </button>
            )}
          </div>
        )}
      </div>

      <div className="mb-4 h-12">
        <Notificacion mensaje={mensaje?.texto} tipo={mensaje?.tipo} />
      </div>

      {reporte && (
        <div className="border p-6 rounded-lg bg-white print-area">
          <h2 className="text-xl font-semibold mb-4">Resultado Académico</h2>

          <div className="mb-4 text-sm">
            <p><strong>Alumno:</strong> {infoAlumno?.nombre} {infoAlumno?.apellido_paterno} {infoAlumno?.apellido_materno}</p>
            <p><strong>Periodo:</strong> {infoPeriodo?.anio} {infoPeriodo?.descripcion}</p>
            <p><strong>Fecha:</strong> {new Date().toLocaleDateString()}</p>
          </div>

          {Object.entries(reporte.Curso).map(([curso, datos]) => (
            <div key={curso} className="mb-4 border-b pb-2">
              <h3 className="font-bold">{curso}</h3>
              <ul className="ml-4">
                {Object.entries(datos.Notas).map(([bim, nota]) => (
                  <li key={bim}>{bim}: {nota}</li>
                ))}
                <li><strong>Promedio:</strong> {datos.Promedio}</li>
                <li><strong>Estado:</strong> {datos.Estado}</li>
              </ul>
            </div>
          ))}

          <div className="mt-6">
            <h3 className="font-semibold">Promedios Generales</h3>
            <ul>
              {Object.entries(reporte["Promedios Generales"]["Por Bimestre"]).map(([b, p]) => (
                <li key={b}>{b}: {p}</li>
              ))}
              <li className="font-bold mt-2">
                Promedio Total: {reporte["Promedios Generales"]["Promedio Total"]}
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
