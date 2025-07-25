import React, { useEffect, useState } from "react";
import { cursoGradoService, cursoService, gradoService } from "../../api/requestApi";

export default function FormularioCursoGrado({ onExito, initialData }) {
   const [observacion, setObservacion] = useState("");
  const [form, setForm] = useState({
    curso: "",
    grado: "",
    estado: true,
  });

  const [cursos, setCursos] = useState([]);
  const [grados, setGrados] = useState([]);
  const [error, setError] = useState(null);
  const [mensajeExito, setMensajeExito] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [cursosData, gradosData] = await Promise.all([
          cursoService.obtener(),
          gradoService.obtener(),
        ]);
        setCursos(cursosData);
        setGrados(gradosData);
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const nuevoValor = type === "checkbox" ? checked : value.trimStart();
    setForm((prev) => ({ ...prev, [name]: nuevoValor }));
  };

  const validarFormulario = () => {
    const { curso, grado } = form;
    if (!curso || !grado) {
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

    if (form.id_curso_grado) {
      document.getElementById("modalObservacion").showModal(); 
    } else {
      await enviarFormulario();
    }
 
  };

   const enviarFormulario = async () => {
 
    try {

       const datos = {
      curso: parseInt(form.curso),
      grado: parseInt(form.grado),
      ...(initialData && { estado: form.estado }),
       observacion: observacion.trim()
    };

        
     if (form.id_curso_grado) {  
        await cursoGradoService.actualizar(form.id_curso_grado, datos);
        setMensajeExito("Curso-Grado actualizado con éxito");
        onExito("Curso-Grado actualizado con éxito");
      } else {
        await cursoGradoService.crear(datos);
        setMensajeExito("Curso-Grado registrado con éxito");
        onExito("Curso-Grado registrado con éxito");
      }

      setForm({
        curso: "",
        grado: "",
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
          className={`btn ${form.id_curso_grado ? "btn-warning" : "btn-success"}`}
        >
          {form.id_curso_grado ? "Actualizar " : "Registrar "} Curso_Grado
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