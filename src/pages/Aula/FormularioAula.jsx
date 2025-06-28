import React, { useEffect, useState } from "react";
import { aulaService } from "../../api/requestApi";

export default function FormularioAula({ onExito, initialData }) {
   const [observacion, setObservacion] = useState("");
  const [form, setForm] = useState({
    numero_aula: "",
    aforo: "",
    ubicacion: "",
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
    } else if (name === "numero_aula" || name === "aforo") {
      nuevoValor = value.replace(/\D/g, "");
    } else {
      nuevoValor = value.trimStart();
    }
    setForm((prev) => ({ ...prev, [name]: nuevoValor }));
  };

  const validarFormulario = () => {
    const { numero_aula, aforo, ubicacion } = form;
    if (!numero_aula || !aforo || !ubicacion) {
      return "Todos los campos son obligatorios";
    }
    if (!/^\d+$/.test(numero_aula)) {
      return "Introduce un número válido para el número de aula";
    }
    if (!/^\d+$/.test(aforo)) {
      return "Introduce un número válido para el aforo";
    }
    if (parseInt(aforo, 10) <= 20) {
      return "El aforo debe ser mayor a 20";
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

    if (form.id_aula) {
      document.getElementById("modalObservacion").showModal(); 
    } else {
      await enviarFormulario();
    }
 
  };
    const enviarFormulario = async () => {

     

    try {

      const datos = {
      ...form,
      numero_aula: String(form.numero_aula ?? "").trim(),
      aforo: String(form.aforo ?? "").trim(),
      ubicacion: String(form.ubicacion ?? "").trim(),
      estado: form.estado,
      observacion: observacion.trim(),
      };
      if (form.id_aula) { 
        await aulaService.actualizar(form.id_aula, datos);
      
        setMensajeExito("Aula actualizada con éxito");
        onExito("Aula actualizada con éxito");
      } else {
        await aulaService.crear(datos);
        setMensajeExito("Aula registrada con éxito");
        onExito("Aula registrada con éxito");
      }
      setForm({
        numero_aula: "",
        aforo: "",
        ubicacion: "",
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
          <div>
            <label className="label">
              <span className="label-text">Numero Aula</span>
            </label>
            <input
              name="numero_aula"
              className="input input-bordered w-full"
              value={form.numero_aula}
              onChange={handleChange}
              maxLength={3}
              inputMode="numeric"
              onKeyDown={(e) => e.key === " " && e.preventDefault()}
            />
          </div>
          <div>
            <label className="label">
              <span className="label-text">Aforo</span>
            </label>
            <input
              name="aforo"
              className="input input-bordered w-full"
              value={form.aforo}
              onChange={handleChange}
              maxLength={3}
              inputMode="numeric"
              onKeyDown={(e) => e.key === " " && e.preventDefault()}
            />
          </div>
          <div>
            <label className="label">
              <span className="label-text">Seleccione Ubicación</span>
            </label>
            <select
              name="ubicacion"
              className="select select-bordered w-full"
              value={form.ubicacion}
              onChange={handleChange}
            >
              <option value="" disabled>
                Ubicación
              </option>
              <option value="Primer Piso">Primer Piso</option>
              <option value="Segundo Piso">Segundo Piso</option>
              <option value="Tercer Piso">Tercer Piso</option>
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
            className={`btn ${form.id_aula ? "btn-warning" : "btn-success"}`}
          >
            {form.id_aula ? "Actualizar Grado" : "Registrar Grado"}
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