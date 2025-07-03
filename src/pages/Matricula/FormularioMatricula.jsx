import React, { useEffect, useState } from "react";
import {
  alumnoService,
  seccionService,
  matriculaService,
  periodoService,
} from "../../api/requestApi";

export default function FormularioMatricula({ onExito, initialData }) {
  const [obs, setObservacion] = useState("");
  const [form, setForm] = useState({
    alumno: "",
    seccion: "",
    condicion: "",
    observacion: "",
    estado: true,
  });

  const [alumnos, setAlumnos] = useState([]);
  const [secciones, setSecciones] = useState([]);
  const [periodos, setPeriodos] = useState([]);
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState("");
  const [error, setError] = useState(null);
  const [mensajeExito, setMensajeExito] = useState(null);

  useEffect(() => {
    const cargarDatosIniciales = async () => {
      try {
        const alumnosData = await alumnoService.obtener();
        const periodosData = await periodoService.obtener();
        setAlumnos(alumnosData);
        setPeriodos(periodosData);

        if (initialData) {
          setForm(initialData);

          // Encontrar el periodo al que pertenece la sección actual
          for (const periodo of periodosData) {
            const seccionesData = await periodoService.obtenerSeccionesPeriodo(
              periodo.id_periodo
            );
            const seccionEncontrada = seccionesData.find(
              (s) => s.id_seccion === initialData.seccion
            );
            if (seccionEncontrada) {
              setPeriodoSeleccionado(periodo.id_periodo);
              setSecciones([seccionEncontrada]); // Solo la sección actual
              break;
            }
          }
        }
      } catch (e) {
        setError("Error al cargar datos del formulario");
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const nuevoValor = type === "checkbox" ? checked : value.trimStart();
    setForm((prev) => ({ ...prev, [name]: nuevoValor }));
  };

  const handlePeriodoChange = async (e) => {
    const nuevoPeriodo = e.target.value;
    setPeriodoSeleccionado(nuevoPeriodo);
    setForm((prev) => ({ ...prev, seccion: "" }));

    try {
      const nuevasSecciones = await periodoService.obtenerSeccionesPeriodo(nuevoPeriodo);
      setSecciones(nuevasSecciones);
    } catch {
      setError("Error al cargar secciones del periodo");
    }
  };

  const validarFormulario = () => {
    const { alumno, seccion, condicion } = form;
    if (!alumno || !seccion || !condicion) {
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

    if (form.id_matricula) {
      document.getElementById("modalObservacion").showModal(); 
    } else {
      await enviarFormulario();
    }
  
 
 
  };

    const enviarFormulario = async () => { 
    try { 

      const datos = {
      alumno: parseInt(form.alumno),
      seccion: form.seccion ? parseInt(form.seccion) : null,
      condicion: form.condicion,
      observacion: form.observacion || null,
      ...(initialData && { estado: form.estado }),
       obs: obs.trim()
    };

       
      if (form.id_matricula) {
        await matriculaService.actualizar(form.id_matricula, datos);
        setMensajeExito("Matrícula actualizada con éxito");
        onExito("Matrícula actualizada con éxito");
      } else {
        await matriculaService.crear(datos);
        setMensajeExito("Matrícula registrada con éxito");
        onExito("Matrícula registrada con éxito");
      }

      
      setForm({
        alumno: "",
        seccion: "",
        condicion: "",
        observacion: "",
        estado: true,
      });
      setPeriodoSeleccionado("");
      setSecciones([]);
      setObservacion("");
      document.getElementById("modalObservacion").close(); 
    } catch (err) {
      setError("Error al guardar. Verifique que el alumno no este matriculado en la misma seccion o en el mismo periodo");
    }
    }

  return (
       <>
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
        {/* Selección de periodo visible SIEMPRE */}
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

        {/* Alumno */}
        <select
          name="alumno"
          className="select select-bordered w-full"
          value={form.alumno}
          onChange={handleChange}
        >
          <option value="" disabled>
            Seleccionar Alumno
          </option>
          {alumnos.map((a) => (
            <option key={a.id_alumno} value={a.id_alumno}>
              {a.nombre} {a.apellido_paterno} {a.apellido_materno}
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
            {secciones.length > 0 ? "Elige una sección" : "No hay secciones disponibles"}
          </option>
          {secciones.map((s) => (
            <option key={s.id_seccion} value={s.id_seccion}>
              {s.nombre} - {s.grado} - {s.aula}
            </option>
          ))}
        </select>

        {/* Condición */}
        <select
          name="condicion"
          className="select select-bordered w-full"
          value={form.condicion}
          onChange={handleChange}
        >
          <option value="" disabled>
            Seleccionar Condición
          </option>
          <option value="Reservado">Reservado</option>
          <option value="Matriculado">Matriculado</option>
          <option value="Por cancelar">Por cancelar</option>
          <option value="Retirado">Retirado</option>
          <option value="Condicional">Condicional</option>
        </select>

        {/* Estado */}
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
 {!initialData && (
         <div>
            <label className="label">
              <span className="label-text">Observación</span>
            </label>
            <textarea
              name="observacion"
              className="textarea textarea-bordered w-full"
              rows={3}
              placeholder="Observación (opcional)"
              value={form.observacion || ""}
              onChange={handleChange} 
            />
      </div>
      )}
      

      <div className="mt-4">
        <button
          type="submit"
          className={`btn ${form.id_matricula ? "btn-warning" : "btn-success"}`}
        >
          {form.id_matricula ? "Actualizar " : "Registrar "} Matrícula
        </button>
      </div> 
      
    </form>

       <dialog id="modalObservacion" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Justifique su edición</h3>
            <textarea
              name="obs"
              className="textarea textarea-bordered w-full mt-4"
              placeholder="Escriba la justificación"
              value={obs}
              onChange={(e) => setObservacion(e.target.value)}
              required
            />
            <div className="modal-action">
              <button
                type="button"
                className="btn"
                onClick={() => document.getElementById("modalObservacion").close()}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={enviarFormulario}
              >
                Confirmar Actualización
              </button>
            </div>
          </div>
        </dialog>
  </>
   
  );
}