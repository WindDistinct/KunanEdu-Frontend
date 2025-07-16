import React, { useEffect, useState } from "react";
import { periodoService, alumnoService, notaService } from "../../api/requestApi";
import { useNavigate } from "react-router-dom";
import Notificacion from "../../components/Notificacion";
import * as XLSX from "xlsx";

export default function ListadoNotasPorCurso() {
  const [periodos, setPeriodos] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState("");
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState("");
  const [reporte, setReporte] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [infoAlumno, setInfoAlumno] = useState(null);
  const [infoPeriodo, setInfoPeriodo] = useState(null);
  const navigate = useNavigate();

  // Cargar periodos
  const cargarPeriodos = async () => {
    try {
      const data = await periodoService.obtener();
      setPeriodos(data);
    } catch {
      setMensaje({ tipo: "error", texto: "Error al cargar periodos" });
    }
  };

  // Cargar alumnos según periodo
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

  // Generar el reporte en pantalla
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

  const exportarAExcel = () => {
  if (!reporte) return;

  const rows = [];

  // Info del alumno y periodo
  rows.push([
    "Alumno",
    `${infoAlumno?.nombre} ${infoAlumno?.apellido_paterno} ${infoAlumno?.apellido_materno}`,
    "Periodo",
    `${infoPeriodo?.anio} ${infoPeriodo?.descripcion}`,
    "Fecha",
    new Date().toLocaleDateString()
  ]);

  rows.push([]); // línea vacía

  // Cabecera de tabla
  rows.push(["Curso", "Bimestre", "Nota", "Promedio Curso", "Estado"]);

  // Datos
  Object.entries(reporte.Curso).forEach(([curso, datos]) => {
    Object.entries(datos.Notas).forEach(([bim, nota], idx) => {
      rows.push([
        idx === 0 ? curso : "",
        bim,
        nota,
        idx === 0 ? datos.Promedio : "",
        idx === 0 ? datos.Estado : ""
      ]);
    });
  });

  rows.push([]); // línea vacía

  // Promedios Generales
  rows.push(["Promedios Generales por Bimestre"]);
  Object.entries(reporte["Promedios Generales"]["Por Bimestre"]).forEach(([b, p]) => {
    rows.push([b, p]);
  });

  rows.push(["Promedio Total", reporte["Promedios Generales"]["Promedio Total"]]);

  // Crear hoja
  const worksheet = XLSX.utils.aoa_to_sheet(rows);

  // AUTOAJUSTAR columnas (auto width)
  const colWidths = rows.reduce((widths, row) => {
    row.forEach((cell, i) => {
      const cellLength = cell ? cell.toString().length : 10;
      widths[i] = Math.max(widths[i] || 10, cellLength);
    });
    return widths;
  }, []);
  worksheet['!cols'] = colWidths.map(w => ({ wch: w + 5 }));

  // Crear libro
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "ReporteNotas");

  // Descargar
  XLSX.writeFile(workbook, `ReporteNotas_${infoAlumno?.nombre}_${new Date().toLocaleDateString()}.xlsx`);
};

  // Effects
  useEffect(() => { cargarPeriodos(); }, []);
  useEffect(() => {
    if (periodoSeleccionado) cargarAlumnos(periodoSeleccionado);
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
      <button onClick={() => navigate("/")} className="btn btn-secondary mb-4">
        ← Volver al Menú
      </button>

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
              <>
                <button className="btn btn-outline" onClick={() => window.print()}>
                  Exportar a PDF
                </button>
                <button className="btn btn-success" onClick={exportarAExcel}>
                  Exportar a Excel
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="mb-4 h-12">
        <Notificacion mensaje={mensaje?.texto} tipo={mensaje?.tipo} />
      </div>

      {reporte && (
        <div className="border p-6 rounded-lg bg-white print-area">
          <h2 className="text-xl font-semibold mb-4 text-center">Resultado Académico</h2>

          <div className="mb-4 text-sm text-center">
            <p><strong>Alumno:</strong> {infoAlumno?.nombre} {infoAlumno?.apellido_paterno} {infoAlumno?.apellido_materno}</p>
            <p><strong>Periodo:</strong> {infoPeriodo?.anio} {infoPeriodo?.descripcion}</p>
            <p><strong>Fecha:</strong> {new Date().toLocaleDateString()}</p>
          </div>

          <table className="min-w-full border-collapse border border-gray-400 mb-6 text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="border border-gray-400 px-4 py-2">Curso</th>
                <th className="border border-gray-400 px-4 py-2">Bimestre</th>
                <th className="border border-gray-400 px-4 py-2">Nota</th>
                <th className="border border-gray-400 px-4 py-2">Promedio Curso</th>
                <th className="border border-gray-400 px-4 py-2">Estado</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(reporte.Curso).map(([curso, datos]) =>
                Object.entries(datos.Notas).map(([bim, nota], idx) => (
                  <tr key={`${curso}-${bim}`} className="hover:bg-gray-50">
                    <td className="border border-gray-400 px-4 py-2">
                      {idx === 0 ? curso : ""}
                    </td>
                    <td className="border border-gray-400 px-4 py-2">{bim}</td>
                    <td className="border border-gray-400 px-4 py-2">{nota}</td>
                    <td className="border border-gray-400 px-4 py-2">
                      {idx === 0 ? datos.Promedio : ""}
                    </td>
                    <td className="border border-gray-400 px-4 py-2">
                      {idx === 0 ? datos.Estado : ""}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              <tr className="bg-gray-100 font-semibold">
                <td className="border border-gray-400 px-4 py-2" colSpan="2">
                  Promedios Generales
                </td>
                <td className="border border-gray-400 px-4 py-2" colSpan="3">
                  {Object.entries(reporte["Promedios Generales"]["Por Bimestre"]).map(([b, p]) => (
                    <span key={b} className="mr-4">{b}: {p}</span>
                  ))}
                </td>
              </tr>
              <tr className="bg-gray-300 font-bold">
                <td className="border border-gray-400 px-4 py-2" colSpan="4">Promedio Total</td>
                <td className="border border-gray-400 px-4 py-2">
                  {reporte["Promedios Generales"]["Promedio Total"]}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}
