import React, { useEffect, useState } from "react";
import { aulaService } from "../../api/requestApi";

export default function FormularioAula({ onExito, initialData }) {
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

    const datos = {
      ...form,
      numero_aula: String(form.numero_aula ?? "").trim(),
      aforo: String(form.aforo ?? "").trim(),
      ubicacion: String(form.ubicacion ?? "").trim(),
      estado: form.estado,
    };

    try {
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
    } catch (err) {
      setError("Error al guardar. Verifique que el número de aula no esté duplicado");
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
          name="numero_aula"
          placeholder="Número de Aula"
          className="input input-bordered w-full"
          value={form.numero_aula}
          onChange={handleChange}
          maxLength={3}
          inputMode="numeric"
          onKeyDown={(e) => e.key === " " && e.preventDefault()}
        />

        <input
          name="aforo"
          placeholder="Aforo"
          className="input input-bordered w-full"
          value={form.aforo}
          onChange={handleChange}
          maxLength={3}
          inputMode="numeric"
          onKeyDown={(e) => e.key === " " && e.preventDefault()}
        />

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
          {form.id_aula ? "Actualizar" : "Registrar"} Aula
        </button>
      </div>
    </form>
  );
}