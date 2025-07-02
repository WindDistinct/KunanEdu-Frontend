import React, { useEffect, useState } from "react";
import { seccionService, periodoService, aulaService, gradoService } from "../../api/requestApi";

export default function FormularioSeccion({ onExito, initialData }) {
   const [observacion, setObservacion] = useState("");
  const [form, setForm] = useState({
    nombre: "",
    aula: "",
    grado: "",
    periodo: "",
    estado: true,
  });

  const [aulas, setAulas] = useState([]);
  const [grados, setGrados] = useState([]);
  const [periodos, setPeriodos] = useState([]);
  const [error, setError] = useState(null);
  const [mensajeExito, setMensajeExito] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [aulasData, gradosData, periodosData] = await Promise.all([
          aulaService.obtener(),
          gradoService.obtener(),
          periodoService.obtener(),
        ]);
        setAulas(aulasData);
        setGrados(gradosData);
        setPeriodos(periodosData);
      } catch (e) {
        setError("Error al cargar datos para el formulario");
      }
    };
    cargarDatos();
  }, []);

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  useEffect(() => {
    if (mensajeExito) {
      const timer = setTimeout(() => setMensajeExito(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [mensajeExito]);

    useEffect(() => {
    const asignarNombreSeccion = async () => {
      if (!form.grado || !form.periodo || initialData) return;

      try {
        const existentes = await seccionService.obtenerPorGradoYPeriodo(form.grado, form.periodo);
        const nombresDisponibles = ["Sección A", "Sección B", "Sección C"];
        const usados = existentes.map((s) => s.nombre);
        const nombreDisponible = nombresDisponibles.find((n) => !usados.includes(n));

        if (nombreDisponible) {
          setForm((prev) => ({ ...prev, nombre: nombreDisponible }));
          setError(null);
        } else {
          setForm((prev) => ({ ...prev, nombre: "" }));
          setError("Ya se han registrado todas las secciones posibles para ese grado y periodo.");
        }
      } catch (e) {
        setError("Error al verificar secciones existentes.");
      }
    };

    asignarNombreSeccion();
  }, [form.grado, form.periodo, initialData]);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const nuevoValor = type === "checkbox" ? checked : value.trimStart();
    setForm((prev) => ({ ...prev, [name]: nuevoValor }));
  };

  const validarFormulario = () => {
    const { nombre, aula, grado, periodo } = form;
    if (!nombre || !aula || !grado || !periodo) {
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

    if (form.id_seccion) {
      document.getElementById("modalObservacion").showModal(); 
    } else {
      await enviarFormulario();
    }
 
  };

    const enviarFormulario = async () => {
  
      try {

      const datos = {
      nombre: form.nombre.trim(),
      aula: parseInt(form.aula),
      grado: parseInt(form.grado),
      periodo: parseInt(form.periodo),
      ...(initialData && { estado: form.estado }), 
        observacion: observacion.trim()
      };

      const seccionesExistentes = await seccionService.obtenerPorGradoYPeriodo(datos.grado, datos.periodo);
      const duplicado = seccionesExistentes.find(
        (s) =>
          s.nombre === datos.nombre &&
          s.estado === true &&
          s.id_seccion !== form.id_seccion
      );

      if (duplicado) {
        setError(`Ya existe una sección activa con el nombre ${datos.nombre} para ese grado y periodo.`);
        return;
      }

   
      if (form.id_seccion) {
        await seccionService.actualizar(form.id_seccion, datos);
        setMensajeExito("Sección actualizada con éxito");
        onExito("Sección actualizada con éxito");
      } else {
        await seccionService.crear(datos);
        setMensajeExito("Sección registrada con éxito");
        onExito("Sección registrada con éxito");
      }

      setForm({
        nombre: "",
        aula: "",
        grado: "",
        periodo: "",
        estado: true,
      });
        setObservacion("");
        document.getElementById("modalObservacion").close(); // Cerrar modal
      } catch (err) {
        setError("Error al guardar. Verifique que el número de aula no esté duplicado");
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
             <input
          name="nombre"
          placeholder="Nombre de la sección"
          className="input input-bordered w-full"
          value={form.nombre}
          readOnly
        />

        <select
          name="aula"
          className="select select-bordered w-full"
          value={form.aula}
          onChange={handleChange}
        >
          <option value="" disabled>
            Seleccionar Aula
          </option>
          {aulas.map((a) => (
            <option key={a.id_aula} value={a.id_aula}>
              Aula {a.numero_aula}
            </option>
          ))}
        </select>

        <select
          name="grado"
          className="select select-bordered w-full"
          value={form.grado}
          onChange={handleChange}
        >
          <option value="" disabled>
            Seleccionar Grado
          </option>
          {grados.map((g) => (
            <option key={g.id_grado} value={g.id_grado}>
              {g.nivel} - {g.anio}
            </option>
          ))}
        </select>

        <select
          name="periodo"
          className="select select-bordered w-full"
          value={form.periodo}
          onChange={handleChange}
        >
          <option value="" disabled>
            Seleccionar Periodo
          </option>
          {periodos.map((p) => (
            <option key={p.id_periodo} value={p.id_periodo}>
              {p.anio} - {p.descripcion}
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
       <div className="mt-4">
          <button
            type="submit"
            className={`btn ${form.id_seccion ? "btn-warning" : "btn-success"}`}
          >
            {form.id_seccion ? "Actualizar" : "Registrar"} Sección
          </button>
        </div>  
    </form>
       <dialog id="modalObservacion" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Justifique su edición</h3>
            <textarea
              name="observacion"
              className="textarea textarea-bordered w-full mt-4"
              placeholder="Escriba la justificación"
              value={observacion}
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