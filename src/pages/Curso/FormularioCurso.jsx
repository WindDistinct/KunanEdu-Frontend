import React, { useEffect, useState } from "react";
import { cursoService } from "../../api/requestApi";

export default function FormularioCurso({ onExito, initialData }) {
  const [observacion, setObservacion] = useState("");
  const [form, setForm] = useState({
    nombre_curso: "",
    estado: true,
  });

  const [error, setError] = useState(null);
  const [mensajeExito, setMensajeExito] = useState(null);

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
    let nuevoValor = value;

    if (type === "checkbox") {
      nuevoValor = checked;
    } else {
      nuevoValor = value.trimStart();
    }

    setForm((prev) => ({ ...prev, [name]: nuevoValor }));
  };

  const validarFormulario = () => {
    const { nombre_curso } = form;

    if (!nombre_curso) return "Todos los campos son obligatorios";

    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,}$/.test(nombre_curso.trim())) {
      return "El nombre del curso debe tener al menos 3 letras y sin números";
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

    if (form.id_curso) {
      document.getElementById("modalObservacion").showModal(); 
    } else {
      await enviarFormulario();
    }
   
  };

   const enviarFormulario = async () => { 
    try {

      const datos = {
      ...form,
      nombre_curso: form.nombre_curso.trim(),
      estado: form.estado,
      observacion: observacion.trim(),
      };
      if (form.id_curso) {
        await cursoService.actualizar(form.id_curso, datos);
        setMensajeExito("Curso actualizado con éxito");
        onExito("Curso actualizado con éxito");
      } else {
        await cursoService.crear(datos);
        setMensajeExito("Curso registrado con éxito");
        onExito("Curso registrado con éxito");
      }
      setForm({ nombre_curso: "", estado: true });
      setObservacion("");
      document.getElementById("modalObservacion").close(); 
    } catch (err) {
      setError("Error al guardar. Verifique que el nombre de curso no esté duplicado");
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

        <div>
          <label className="label">
            <span className="label-text">Nombre Curso</span>
          </label>
          <input
            name="nombre_curso"
            className="input input-bordered w-full"
            value={form.nombre_curso}
            onChange={handleChange}
            maxLength={50}
            onKeyDown={(e) => e.key === " " && e.target.selectionStart === 0 && e.preventDefault()}
          />
        </div>

        
        {initialData && (
          <div className="col-span-2 mt-2">
            <label className="label cursor-pointer w-full">
              <span className="label-text">
                Estado:{" "}
                <span className={`font-semibold ml-2 ${form.estado ? "text-green-600" : "text-red-600"}`}>
                  {form.estado ? "Activo" : "Inactivo"}
                </span>
              </span>
              <input
                type="checkbox"
                name="estado"
                className="toggle toggle-success ml-4"
                checked={!!form.estado}
                onChange={handleChange}
              />
            </label>
          </div>
        )}
        
      </div>
      <div className="mt-4">
        <button
          type="submit"
          className={`btn ${form.id_curso ? "btn-warning" : "btn-success"}`}
        >
          {form.id_curso ? "Actualizar " : "Registrar "} Curso
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