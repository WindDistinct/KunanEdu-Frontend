import React, { useEffect, useState } from "react";
import {
  cursoSeccionService,
  cursoService,
  seccionService,
  empleadoService,
  periodoService,
} from "../../api/requestApi";

export default function FormularioCursoSeccion({ onExito, initialData }) {
  const [form, setForm] = useState({
    curso: "",
    seccion: "",
    docente: "",
    estado: true,
  });

  const [cursos, setCursos] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [periodos, setPeriodos] = useState([]);
  const [secciones, setSecciones] = useState([]);
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState("");

  const [error, setError] = useState(null);
  const [mensajeExito, setMensajeExito] = useState(null);

  useEffect(() => {
     
    const cargarDatosIniciales = async () => {
      try {
        const [cursosData, docentesData, periodosData] = await Promise.all([
          cursoService.obtener(),
          empleadoService.obtenerDocentes(),
          periodoService.obtener(),
        ]);

        setCursos(cursosData);
        setDocentes(docentesData);
        setPeriodos(periodosData);

        if (initialData) {
             console.log("initialData recibido:", initialData);
          setForm({
            curso: initialData.curso,
            seccion: initialData.seccion,
            docente: initialData.docente,
            estado: initialData.estado,
          });

          for (const periodo of periodosData) {
            const seccionesData = await periodoService.obtenerSeccionesPeriodo(periodo.id_periodo);
            const seccionEncontrada = seccionesData.find(
              (s) => s.id_seccion === initialData.seccion
            );
            if (seccionEncontrada) {
              setPeriodoSeleccionado(periodo.id_periodo);
              setSecciones(seccionesData);
              break;
            }
          }
        }
      } catch {
        setError("Error al cargar los datos iniciales");
      }
    };

    cargarDatosIniciales();
  }, [initialData]);

  useEffect(() => {
    if (mensajeExito) {
      const timer = setTimeout(() => setMensajeExito(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [mensajeExito]);

  const handlePeriodoChange = async (e) => {
    const nuevoPeriodo = e.target.value;
    setPeriodoSeleccionado(nuevoPeriodo);
    setForm((prev) => ({ ...prev, seccion: "" }));

    try {
      const nuevasSecciones = await periodoService.obtenerSeccionesPeriodo(nuevoPeriodo);
      setSecciones(nuevasSecciones);
    } catch {
      setError("Error al cargar las secciones del período");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const nuevoValor = type === "checkbox" ? checked : value;
    setForm((prev) => ({ ...prev, [name]: nuevoValor }));
  };

  const validarFormulario = () => {
    const { curso, seccion, docente } = form;
    if (!curso || !seccion || !docente) {
      return "Todos los campos son obligatorios";
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

    const datos = {
      curso: parseInt(form.curso),
      seccion: parseInt(form.seccion),
      docente: parseInt(form.docente),
      ...(initialData && { estado: form.estado }),
    }; 
    try {
      if (initialData?.id_curso_seccion) {
        await cursoSeccionService.actualizar(initialData.id_curso_seccion, datos);
        setMensajeExito("Relación actualizada correctamente");
        onExito("Relación actualizada correctamente");
      } else {
        await cursoSeccionService.crear(datos);
        setMensajeExito("Relación registrada correctamente");
        onExito("Relación registrada correctamente");
      }

      setForm({
        curso: "",
        seccion: "",
        docente: "",
        estado: true,
      });
      setPeriodoSeleccionado("");
      setSecciones([]);
    } catch (err) {
      setError("Error al guardar. Verifique si ya existe esta relación.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="col-span-2 h-16 relative">
        {error && (
          <div className="alert alert-error absolute w-full">
            <span>{error}</span>
          </div>
        )}
        {mensajeExito && (
          <div className="alert alert-success absolute w-full">
            <span>{mensajeExito}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <select
          className="select select-bordered w-full"
          value={periodoSeleccionado}
          onChange={handlePeriodoChange}
        >
          <option value="" disabled>
            Seleccionar Periodo Escolar
          </option>
          {periodos.map((p) => (
            <option key={p.id_periodo} value={p.id_periodo}>
              {p.descripcion} {p.anio}
            </option>
          ))}
        </select>
 
        <select
          name="curso"
          className="select select-bordered w-full"
          value={form.curso}
          onChange={handleChange}
        >
          <option value="" disabled>
            Seleccionar Curso
          </option>
          {cursos.map((c) => (
            <option key={c.id_curso} value={c.id_curso}>
              {c.nombre_curso}
            </option>
          ))}
        </select>

        {/* Sección */}
        <select
          name="seccion"
          className="select select-bordered w-full"
          value={form.seccion}
          onChange={handleChange}
        >
          <option value="" disabled>
            {secciones.length > 0 ? "Seleccionar Sección" : "No hay secciones disponibles"}
          </option>
          {secciones.map((s) => (
            <option key={s.id_seccion} value={s.id_seccion}>
              {s.nombre} - {s.grado} - {s.aula}
            </option>
          ))}
        </select>
 
        <select
          name="docente"
          className="select select-bordered w-full"
          value={form.docente}
          onChange={handleChange}
        >
          <option value="" disabled>
            Seleccionar Docente
          </option>
          {docentes.map((d) => (
            <option key={d.id_emp} value={d.id_emp}>
              {d.nombre_completo} - {d.especialidad}
            </option>
          ))}
        </select>
 
        {initialData && (
          <label className="label cursor-pointer gap-4">
            <span className="label-text">Activo</span>
            <input
              type="checkbox"
              className="toggle toggle-success"
              name="estado"
              checked={!!form.estado}
              onChange={handleChange}
            />
          </label>
        )}
      </div>

      <div>
        <button type="submit" className="btn btn-success">
          {initialData ? "Actualizar" : "Registrar"} Curso Sección
        </button>
      </div>
    </form>
  );
}