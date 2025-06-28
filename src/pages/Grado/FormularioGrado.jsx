import React, { useEffect, useState } from "react";
import { gradoService } from "../../api/requestApi";

export default function FormularioGrado({ onExito, initialData }) {
  const [observacion, setObservacion] = useState("");
  const [form, setForm] = useState({
    nivel: "",
    anio: "",
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
    const nuevoValor = type === "checkbox" ? checked : value.trimStart();
    setForm((prev) => ({ ...prev, [name]: nuevoValor }));
  };

  const validarFormulario = () => {
    const { nivel, anio } = form;
    if (!nivel || !anio) return "Todos los campos son obligatorios";
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

    if (form.id_grado) {
      document.getElementById("modalObservacion").showModal(); // Mostrar modal
    } else {
      await enviarFormulario();
    }
  };

  const enviarFormulario = async () => {
    try {
      const datos = {
        ...form,
        nivel: String(form.nivel ?? "").trim(),
        anio: String(form.anio ?? "").trim(),
        estado: form.estado,
        observacion: observacion.trim(),
      }; 
      if (form.id_grado) {
        await gradoService.actualizar(form.id_grado, datos);
        setMensajeExito("Grado actualizado con éxito");
        onExito("Grado actualizado con éxito");
      } else {
        await gradoService.crear(datos);
        setMensajeExito("Grado registrado con éxito");
        onExito("Grado registrado con éxito");
      }

      setForm({ nivel: "", anio: "", estado: true });
      setObservacion("");
      document.getElementById("modalObservacion").close(); // Cerrar modal
    } catch (err) {
      setError("Error al guardar. Verifique que el grado no esté duplicado");
    }
  };

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
              <span className="label-text">Seleccione Nivel</span>
            </label>
            <select
              name="nivel"
              className="select select-bordered w-full"
              value={form.nivel}
              onChange={handleChange}
            >
              <option value="" disabled>Seleccione Nivel</option>
              <option value="inicial">Inicial</option>
              <option value="primaria">Primaria</option>
              <option value="secundaria">Secundaria</option>
            </select>
          </div>

          <div>
            <label className="label">
              <span className="label-text">Seleccione Año</span>
            </label>
            <select
              name="anio"
              className="select select-bordered w-full"
              value={form.anio}
              onChange={handleChange}
            >
              <option value="" disabled>Seleccione Año</option>
              <option value="1ro">1ro</option>
              <option value="2do">2do</option>
              <option value="3ro">3ro</option>
              <option value="4to">4to</option>
              <option value="5to">5to</option>
              <option value="6to">6to</option>
            </select>
          </div>

          {form.id_grado && (
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
            className={`btn ${form.id_grado ? "btn-warning" : "btn-success"}`}
          >
            {form.id_grado ? "Actualizar Grado" : "Registrar Grado"}
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