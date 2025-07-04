import React, { useEffect, useState } from "react";
import { periodoService } from "../../api/requestApi";

export default function FormularioPeriodo({ onExito, initialData }) {
   const [observacion, setObservacion] = useState("");
  const [form, setForm] = useState({
    anio: "",
    descripcion: "",
    progreso: "",
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
    } else if (name === "anio") {
      nuevoValor = value.replace(/\D/g, "");
    } else {
      nuevoValor = value.trimStart();
    }

    setForm((prev) => ({ ...prev, [name]: nuevoValor }));
  };

  const validarFormulario = () => {
    const { anio, descripcion, progreso } = form;
    if (!anio || !descripcion || !progreso) {
      return "Todos los campos son obligatorios";
    }
    if (!/^\d{4}$/.test(anio)) {
      return "Introduce un año válido de 4 dígitos";
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

     if (form.id_periodo) {
      document.getElementById("modalObservacion").showModal(); 
    } else {
      await enviarFormulario();
    }
 
  };

  const enviarFormulario = async () => { 
    try {

      const datos = {
      ...form,
      anio: String(form.anio ?? "").trim(),
      descripcion: String(form.descripcion ?? "").trim(),
      progreso: String(form.progreso ?? "").trim(),
      estado: form.estado,
      observacion: observacion.trim(),
      };
      if (form.id_periodo) {
        await periodoService.actualizar(form.id_periodo, datos);
        setMensajeExito("Periodo actualizado con éxito");
        onExito("Periodo actualizado con éxito");
      } else {
        await periodoService.crear(datos);
        setMensajeExito("Periodo registrado con éxito");
        onExito("Periodo registrado con éxito");
      }
      setForm({
        anio: "",
        descripcion: "",
        progreso: "",
        estado: true,
      });
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
              <span className="label-text">Año</span>
            </label>
            <input
              name="anio"
              className="input input-bordered w-full"
              value={form.anio}
              onChange={handleChange}
              maxLength={4}
              inputMode="numeric"
              onKeyDown={(e) => e.key === " " && e.preventDefault()}
            />
        </div> 
         <div>
          <label className="label">
            <span className="label-text">Seleccione Descripción</span>
          </label>
          <select
            name="descripcion"
            className="select select-bordered w-full"
            value={form.descripcion}
            onChange={handleChange}
          >
            <option value="" disabled>
              Descripción
            </option>
            <option value="Año escolar">Año Escolar</option>
            <option value="Vacacional">Vacacional</option>
          </select>
        </div>

        <div>
          <label className="label">
            <span className="label-text">Seleccione progreso</span>
          </label>
          <select
            name="progreso"
            className="select select-bordered w-full"
            value={form.progreso}
            onChange={handleChange}
          >
            <option value="" disabled>
              Progreso
            </option>
            <option value="En curso">En Curso</option>
            <option value="Finalizado">Finalizado</option>
          </select>
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
          className={`btn ${form.id_periodo ? "btn-warning" : "btn-success"}`}
        >
          {form.id_periodo ? "Actualizar " : "Registrar "} Periodo
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