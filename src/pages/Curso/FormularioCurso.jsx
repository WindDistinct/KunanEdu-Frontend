import React, { useEffect, useState } from "react";
import { cursoService } from "../../api/requestApi";

export default function FormularioCurso({ onExito, initialData }) {
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

    const datos = {
      nombre_curso: form.nombre_curso.trim(),
      estado: form.estado,
    };

    try {
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
    } catch (err) {
      setError("Error al guardar. Verifique que el nombre no esté duplicado");
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
          name="nombre_curso"
          placeholder="Nombre del Curso"
          className="input input-bordered w-full"
          value={form.nombre_curso}
          onChange={handleChange}
          maxLength={50}
          onKeyDown={(e) => e.key === " " && e.target.selectionStart === 0 && e.preventDefault()}
        />

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
          {form.id_curso ? "Actualizar" : "Registrar"} Curso
        </button>
      </div>
    </form>
  );
}