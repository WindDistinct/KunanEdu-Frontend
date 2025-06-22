import React, { useEffect, useState } from "react";
import { notaService } from "../../api/requestApi";

export default function FormularioNotaCurso({ onExito, initialData }) {
  const [form, setForm] = useState({
    id_examen: "",
    id_nota: "",
    nota: "",
    estado: true,
    nombre_completo: "",
    nombre_curso: "",
    bimestre: "",
    id_matricula: "",
    id_curso_seccion: ""
  });
  const [error, setError] = useState(null);
  const [mensajeExito, setMensajeExito] = useState(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        id_examen: initialData.id_examen ?? "",
        id_nota: initialData.id_nota ?? "",
        nota: initialData.nota?.toString() ?? "",
        estado: initialData.estado ?? true,
        nombre_completo: initialData.nombre_completo ?? "",
        nombre_curso: initialData.nombre_curso ?? "",
        bimestre: initialData.bimestre ?? "",
        id_matricula: initialData.id_matricula ?? "",
        id_curso_seccion: initialData.id_curso_seccion ?? ""
      });
    }
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
    } else if (name === "nota") {
      nuevoValor = value.replace(/\D/g, "");
    } else {
      nuevoValor = value.trimStart();
    }

    setForm((prev) => ({ ...prev, [name]: nuevoValor }));
  };

  const validarFormulario = () => {
    const { bimestre, nota } = form;
    if (!bimestre || !nota) {
      return "Todos los campos son obligatorios";
    }
    if (!/^\d+$/.test(nota) || parseInt(nota) < 0 || parseInt(nota) > 20) {
      return "La nota debe ser un número entre 0 y 20";
    }
    if (nota < 0) {
      return "La nota no puede ser menor que 0";
    }
    if (nota > 20) {
      return "La nota no puede ser mayor que 20";
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
      id_nota: form.id_nota,
      matricula: form.id_matricula,
      nota: parseInt(form.nota),
      estado: form.estado,
    };

    try {
      console.log(datos);

      await notaService.actualizar(form.id_nota, datos);
      setMensajeExito("Nota actualizada con éxito");
      onExito("Nota actualizada con éxito");

    } catch (err) {
      setError("Error al guardar la nota. Intenta nuevamente.");
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
          name="nombre_completo"
          placeholder="ID Alumno"
          className="input input-bordered w-full"
          value={form.nombre_completo}
          onChange={handleChange}
          inputMode="numeric"
          disabled
        />

        <input
          name="nombre_curso"
          placeholder="Curso"
          className="input input-bordered w-full"
          value={form.nombre_curso}
          onChange={handleChange}
          inputMode="numeric"
          disabled
        />

        <input
          name="bimestre"
          placeholder="Bimestre"
          className="input input-bordered w-full"
          value={form.bimestre}
          disabled
        />

        <input
          name="nota"
          placeholder="Nota (0-20)"
          className="input input-bordered w-full"
          value={form.nota}
          onChange={handleChange}
          maxLength={2}
          inputMode="numeric"
          onKeyDown={(e) => e.key === " " && e.preventDefault()}
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
          {form.id_examen ? "Actualizar" : "Registrar"} Nota
        </button>
      </div>
    </form>
  );
}