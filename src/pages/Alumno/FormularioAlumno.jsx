import React, { useEffect, useState } from "react";
import { crearAlumno, actualizarAlumno } from "../../api/alumnoService";
import "../../styles/Botones.css";
import "../../styles/inputs.css";
import "../../styles/Notificacion.css";

const fechaMaximaNacimiento = (() => {
  const fecha = new Date();
  fecha.setFullYear(fecha.getFullYear() - 5);
  return fecha.toISOString().split("T")[0];
})();

const inicialForm = {
  nombre: "",apellido_paterno: "",apellido_materno: "",dni: "",direccion: "",
  telefono: "",fecha_nacimiento: "",estado: true,
};

const validarTexto = (texto, minLen = 2) =>
  /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(texto) && texto.length >= minLen;

const validarNumeroExacto = (valor, digitos) =>
  /^\d+$/.test(valor) && valor.length === digitos;

export default function FormularioAlumno({ onExito, initialData }) {
	const [form, setForm] = useState(inicialForm);
	const [error, setError] = useState(null);

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

    const handleChange = ({ target: { name, value, type, checked } }) => {
		let newValue = type === "checkbox" ? checked : value;
		if (["dni", "telefono"].includes(name)) {
			newValue = newValue.replace(/\s/g, "").replace(/\D/g, "");  
		}
		if (["nombre", "apellido_paterno", "apellido_materno"].includes(name)) {
			newValue = newValue.replace(/[0-9]/g, ""); 
		}
		setForm((f) => ({ ...f, [name]: newValue }));
	};

	const resetForm = () => {
		setForm(inicialForm);
		onExito(null);
	};

  const validarFormulario = () => {
    const {
      nombre,apellido_paterno,apellido_materno,dni,direccion,telefono,fecha_nacimiento,
    } = form;

    if (
      !nombre || !apellido_paterno || !apellido_materno || !dni ||
      !direccion || !telefono ||  !fecha_nacimiento
    ) {return "Todos los campos son obligatorios"}
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
    if (new Date(form.fecha_nacimiento) > new Date(fechaMaximaNacimiento))
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
      if (form.id_alumno) {
        await actualizarAlumno(form.id_alumno, form);
        onExito("Alumno actualizado con éxito");
      } else {
        await crearAlumno(form);
        onExito("Alumno registrado con éxito");
      }
      resetForm();
    } catch {
      setError("Error al guardar. Verifique que el DNI no esté duplicado");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      {error && <div className="error grid2">{error}</div>}

      <input
        name="nombre"
        placeholder="Nombres"
        className="input-form"
        value={form.nombre}
        onChange={handleChange}
      />
      <input
        name="apellido_paterno"
        placeholder="Apellido Paterno"
        className="input-form"
        value={form.apellido_paterno}
        onChange={handleChange}
      />
      <input
        name="apellido_materno"
        placeholder="Apellido Materno"
        className="input-form"
        value={form.apellido_materno}
        onChange={handleChange}
      />
     <input
		name="dni"
		placeholder="DNI"
		className="input-form"
		value={form.dni}
		onChange={handleChange}
		maxLength={8}
		inputMode="numeric"
		onKeyDown={(e) => e.key === " " && e.preventDefault()}
		/>

		<input
		name="telefono"
		placeholder="Teléfono"
		className="input-form"
		value={form.telefono}
		onChange={handleChange}
		maxLength={9}
		inputMode="numeric"
		onKeyDown={(e) => e.key === " " && e.preventDefault()}
		/>
      <input
        name="direccion"
        placeholder="Dirección"
        className="input-form"
        value={form.direccion}
        onChange={handleChange}
      />
      
      <input
        name="fecha_nacimiento"
        type="date"
        className="input-form"
        value={form.fecha_nacimiento}
        onChange={handleChange}
        max={fechaMaximaNacimiento}
      />

      <label className="checkbox-label">
        <input
          type="checkbox"
          name="estado"
          checked={!!form.estado}
          onChange={handleChange}
        />
        Activo
      </label>

      <div className="grid2">
        <button type="submit" className="aceptar-button">
          {form.id_alumno ? "Actualizar" : "Registrar"} Alumno
        </button>
     
      </div>
    </form>
  );
}