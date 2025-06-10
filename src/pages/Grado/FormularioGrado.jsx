import React, { useEffect, useState } from "react";
import { gradoService } from "../../api/requestApi";

export default function FormularioGrado({ onExito, initialData }) {
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
    if (!nivel || !anio) {
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
      ...form,
      nivel: String(form.nivel ?? "").trim(),
      anio: String(form.anio ?? "").trim(),
      estado: form.estado,
    };

    try {
      if (form.id_grado) {
        console.log(datos)
        await gradoService.actualizar(form.id_grado, datos);
        setMensajeExito("Grado actualizado con éxito");
        onExito("Grado actualizado con éxito");
      } else {
        await gradoService.crear(datos);
        setMensajeExito("Grado registrado con éxito");
        onExito("Grado registrado con éxito");
      }

      setForm({
        nivel: "",
        anio: "",
        estado: true,
      });
    } catch (err) {
      setError("Error al guardar. Verifique que el grado no esté duplicado");
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
          {form.id_grado ? "Actualizar" : "Registrar"} Grado
        </button>
      </div>
    </form>
  );
}