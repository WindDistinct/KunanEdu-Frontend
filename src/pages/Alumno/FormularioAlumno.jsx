import React, { useEffect, useState } from "react";
import { alumnoService } from "../../api/requestApi";

const fechaMaximaNacimiento = (() => {
  const fecha = new Date();
  fecha.setFullYear(fecha.getFullYear() - 5);
  return fecha.toISOString().split("T")[0];
})();

const inicialForm = {
  nombre: "",
  apellido_paterno: "",
  apellido_materno: "",
  dni: "",
  direccion: "",
  telefono: "",
  fecha_nacimiento: "",
  estado: true,
};

const validarTexto = (texto, minLen = 2) =>
  /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(texto) && texto.length >= minLen;

const validarNumeroExacto = (valor, digitos) =>
  /^\d+$/.test(valor) && valor.length === digitos;

export default function FormularioAlumno({ onExito, initialData }) {
  const [form, setForm] = useState(inicialForm);
  const [error, setError] = useState(null);
  const [mensajeExito, setMensajeExito] = useState(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        ...inicialForm,
        ...initialData,
        fecha_nacimiento: initialData.fecha_nacimiento
          ? initialData.fecha_nacimiento.split("T")[0]
          : "",
      });
    }
  }, [initialData]);

  useEffect(() => {
    if (mensajeExito) {
      const timer = setTimeout(() => setMensajeExito(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [mensajeExito]);

  const handleChange = ({ target: { name, value, type, checked } }) => {
    let newValue = type === "checkbox" ? checked : value;

    if (["dni", "telefono"].includes(name)) {
      newValue = newValue.replace(/\D/g, "");
    }

    if (["nombre", "apellido_paterno", "apellido_materno"].includes(name)) {
      newValue = newValue.replace(/[0-9]/g, "").trimStart();
    }

    if (name === "direccion") {
      newValue = newValue.trimStart();
    }

    setForm((prev) => ({ ...prev, [name]: newValue }));
  };

  const validarFormulario = () => {
    const {
      nombre,
      apellido_paterno,
      apellido_materno,
      dni,
      direccion,
      telefono,
      fecha_nacimiento,
    } = form;

    if (
      !nombre ||
      !apellido_paterno ||
      !apellido_materno ||
      !dni ||
      !direccion ||
      !telefono ||
      !fecha_nacimiento
    ) {
      return "Todos los campos son obligatorios";
    }

    if (!validarTexto(nombre, 3))
      return "El nombre debe tener al menos 3 letras y no contener números";
    if (!validarTexto(apellido_paterno))
      return "El apellido paterno debe tener al menos 2 letras y no contener números";
    if (!validarTexto(apellido_materno))
      return "El apellido materno debe tener al menos 2 letras y no contener números";
    if (!validarNumeroExacto(dni, 8))
      return "El DNI debe tener exactamente 8 dígitos numéricos";
    if (direccion.length < 5)
      return "La dirección debe tener al menos 5 caracteres";
    if (!validarNumeroExacto(telefono, 9))
      return "El teléfono debe tener exactamente 9 dígitos numéricos";
    if (new Date(fecha_nacimiento) > new Date(fechaMaximaNacimiento))
      return "El alumno debe tener al menos 5 años";

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

    try {
      if (initialData) {
        await alumnoService.actualizar(initialData.id_alumno, form);
        setMensajeExito("Alumno actualizado con éxito");
        onExito("Alumno actualizado con éxito");
      } else {
        await alumnoService.crear(form);
        setMensajeExito("Alumno registrado con éxito");
        onExito("Alumno registrado con éxito");
        setForm(inicialForm);
      }
    } catch {
      setError("Error al guardar. Verifique que el DNI no esté duplicado");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      <input
        name="nombre"
        placeholder="Nombres"
        className="input input-bordered w-full"
        value={form.nombre}
        onChange={handleChange}
      />

      <input
        name="apellido_paterno"
        placeholder="Apellido Paterno"
        className="input input-bordered w-full"
        value={form.apellido_paterno}
        onChange={handleChange}
      />

      <input
        name="apellido_materno"
        placeholder="Apellido Materno"
        className="input input-bordered w-full"
        value={form.apellido_materno}
        onChange={handleChange}
      />

      <input
        name="dni"
        placeholder="DNI"
        className="input input-bordered w-full"
        value={form.dni}
        onChange={handleChange}
        maxLength={8}
        inputMode="numeric"
        onKeyDown={(e) => e.key === " " && e.preventDefault()}
      />

      <input
        name="telefono"
        placeholder="Teléfono"
        className="input input-bordered w-full"
        value={form.telefono}
        onChange={handleChange}
        maxLength={9}
        inputMode="numeric"
        onKeyDown={(e) => e.key === " " && e.preventDefault()}
      />

      <input
        name="direccion"
        placeholder="Dirección"
        className="input input-bordered w-full"
        value={form.direccion}
        onChange={handleChange}
      />

      <input
        name="fecha_nacimiento"
        type="date"
        className="input input-bordered w-full"
        value={form.fecha_nacimiento}
        onChange={handleChange}
        max={fechaMaximaNacimiento}
      />

      {initialData && (
        <label className="label cursor-pointer w-full mt-1">
          <span className="label-text">Activo</span>
          <input
            type="checkbox"
            name="estado"
            className="toggle toggle-success"
            checked={!!form.estado}
            onChange={handleChange}
          />
        </label>
      )}

      <div className="col-span-2 mt-2">
        <button type="submit" className="btn btn-success">
          {initialData ? "Actualizar" : "Registrar"} Alumno
        </button>
      </div>
    </form>
  );
}