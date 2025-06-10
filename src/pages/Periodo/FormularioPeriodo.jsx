import React, { useEffect, useState } from "react";
import { periodoService } from "../../api/requestApi";

export default function FormularioPeriodo({ onExito, initialData }) {
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

    const datos = {
      ...form,
      anio: String(form.anio ?? "").trim(),
      descripcion: String(form.descripcion ?? "").trim(),
      progreso: String(form.progreso ?? "").trim(),
      estado: form.estado,
    };

    try {
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
    } catch (err) {
      setError("Error al guardar. Verifique que el año no esté duplicado.");
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
        <input
          name="anio"
          placeholder="Año"
          className="input input-bordered w-full"
          value={form.anio}
          onChange={handleChange}
          maxLength={4}
          inputMode="numeric"
          onKeyDown={(e) => e.key === " " && e.preventDefault()}
        />

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
          {form.id_periodo ? "Actualizar" : "Registrar"} Periodo
        </button>
      </div>
    </form>
  );
}