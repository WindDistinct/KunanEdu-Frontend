import React, { useEffect, useState } from "react";
import { asistenciaService, periodoService, seccionService, cursoSeccionService, cursoService } from "../../api/requestApi";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


export default function ReporteAsistencia() {
  const [periodos, setPeriodos] = useState([]);
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState("");
  const [secciones, setSecciones] = useState([]);
  const [seccionSeleccionada, setSeccionSeleccionada] = useState("");
  const [cursos, setCursos] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState("");
  const [mesSeleccionado, setMesSeleccionado] = useState("");
  const [datosAsistencia, setDatosAsistencia] = useState([]);

  const meses = [
    { nombre: "Enero", numero: 1 },
    { nombre: "Febrero", numero: 2 },
    { nombre: "Marzo", numero: 3 },
    { nombre: "Abril", numero: 4 },
    { nombre: "Mayo", numero: 5 },
    { nombre: "Junio", numero: 6 },
    { nombre: "Julio", numero: 7 },
    { nombre: "Agosto", numero: 8 },
    { nombre: "Septiembre", numero: 9 },
    { nombre: "Octubre", numero: 10 },
    { nombre: "Noviembre", numero: 11 },
    { nombre: "Diciembre", numero: 12 },
  ];

  useEffect(() => {
    const fetchPeriodos = async () => {
      const data = await periodoService.obtener();
      setPeriodos(data);
    };
    fetchPeriodos();
  }, []);

  useEffect(() => {
    if (!periodoSeleccionado) return;
    const fetchSecciones = async () => {
      const data = await seccionService.obtenerPorPeriodo(periodoSeleccionado);
      setSecciones(data);
      setSeccionSeleccionada("");
      setCursos([]);
      setCursoSeleccionado("");
      setDatosAsistencia([]);
    };
    fetchSecciones();
  }, [periodoSeleccionado]);

  useEffect(() => {
    if (!seccionSeleccionada) return; 
    const fetchCursos = async () => {
      const data = await cursoService.obtenerPorSeccion(seccionSeleccionada);
      setCursos(data);
      setCursoSeleccionado("");
      setDatosAsistencia([]);
    };
    fetchCursos();
  }, [seccionSeleccionada]);

  useEffect(() => {
    const cargarAsistencia = async () => {
      if (!cursoSeleccionado || !periodoSeleccionado || !mesSeleccionado) return;
      try {
        const data = await asistenciaService.reporteAsistencia({
               cursoSeccion: cursoSeleccionado,
               periodo: periodoSeleccionado,
               mes: mesSeleccionado,
             });
          setDatosAsistencia(data);
        console.log(data)
      } catch (error) {
        console.error("Error al obtener asistencia:", error);
      }
    };
    cargarAsistencia();
  }, [cursoSeleccionado, periodoSeleccionado, mesSeleccionado]);

  const generarPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Reporte de asistencia admin", 14, 20);
 
    const seccion = secciones.find((s) => s.id_seccion == seccionSeleccionada);
    const nombreSeccion = seccion ? ` ${seccion.seccion}` : "";

    const curso = cursos.find((c) => c.id_curso_seccion == cursoSeleccionado);
    const nombreCurso = curso ? curso.nombre_curso : "";
 
    doc.setFontSize(12);
    doc.text(`Sección: ${nombreSeccion}`, 14, 30);
    doc.text(`Curso: ${nombreCurso}`, 14, 38);
 

    const columnas = ["Fecha", "Día", "Asistió", "Alumno"];
    const filas = datosAsistencia.map((d) => [
      new Date(d.fecha).toLocaleDateString("es-PE"),
      d.dia,
      d.asistio  === true ? "Activo" : "Inactivo",
      d.alumno
    ]);

    autoTable(doc, {
      startY: 48,
      head: [columnas],
      body: filas,
    });

    doc.save("reporte_asistencia_admin.pdf");
  
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Reporte de Asistencia (Administrador)</h1>
     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
 
        <div className="mb-4">
            <label className="label">Seleccionar periodo:</label>
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
 
        <div className="mb-4">
            <label className="label">Seleccionar sección:</label>
            <select
                className="select select-bordered w-full max-w-xs"
                value={seccionSeleccionada}
                onChange={(e) => setSeccionSeleccionada(e.target.value)}
                disabled={!periodoSeleccionado}
            >
                <option value="">-- Selecciona una sección --</option>
                {secciones.map((s) => (
                <option key={s.id_seccion} value={s.id_seccion}>
                    {s.nombre} {s.seccion}
                </option>
                ))}
            </select>
        </div>
 
        <div className="mb-4">
            <label className="label">Seleccionar curso:</label>
            <select
                className="select select-bordered w-full max-w-xs"
                value={cursoSeleccionado}
                onChange={(e) => setCursoSeleccionado(e.target.value)}
                disabled={!seccionSeleccionada}
            >
                <option value="">-- Selecciona un curso --</option>
                {cursos.map((c) => (
                <option key={c.id_curso_seccion} value={c.id_curso_seccion}>
                    {c.nombre_curso}
                </option>
                ))}
            </select>
        </div>
 
        <div className="mb-4">
            <label className="label">Seleccionar mes:</label>
            <select
                className="select select-bordered w-full max-w-xs"
                value={mesSeleccionado}
                onChange={(e) => setMesSeleccionado(e.target.value)}
                disabled={!cursoSeleccionado}
            >
                <option value="">-- Selecciona un mes --</option>
                {meses.map((m) => (
                <option key={m.numero} value={m.numero}>
                    {m.nombre}
                </option>
                ))}
            </select>
        </div>
 </div>
       
      <button
        className="btn btn-primary"
        disabled={datosAsistencia.length === 0}
        onClick={generarPDF}
      >
        Exportar PDF
      </button>
    </div>
  );
}