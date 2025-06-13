import React, { useEffect, useState } from "react";
import { empleadoService, usuarioService } from "../../api/requestApi";

export default function FormularioEmpleado({ onExito, initialData }) {
  const [form, setForm] = useState({
    nombre_emp: "",
    ape_pat_emp: "",
    ape_mat_emp: "",
    fec_nac: "",
    dni: "",
    telefono: "",
    especialidad: "",
    cargo: "",
    observacion: "", 
    estado: true,
  });

  const [error, setError] = useState(null);
  const [mensajeExito, setMensajeExito] = useState(null); 
 
  useEffect(() => {
    if (initialData) {
      const fechaFormateada = initialData.fec_nac
        ? initialData.fec_nac.split("T")[0]
        : "";
      setForm({
        ...initialData,
        fec_nac: fechaFormateada,
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
    let nuevoValor = type === "checkbox" ? checked : value;

    if (["dni", "telefono"].includes(name)) {
      nuevoValor = value.replace(/\D/g, "");
    }

    if (["nombre_emp", "ape_pat_emp", "ape_mat_emp"].includes(name)) {
      nuevoValor = value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, "");
    } 
      setForm((prev) => ({ ...prev, [name]: nuevoValor })); 
  };

  const obtenerFechaMaximaNacimiento = () => {
    const hoy = new Date();
    hoy.setFullYear(hoy.getFullYear() - 18);
    return hoy.toISOString().split("T")[0];
  };

  const esTextoValido = (texto) =>
    /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(texto.trim());

  const esNumeroExacto = (numero, longitud) =>
    new RegExp(`^\\d{${longitud}}$`).test(numero.trim());

  const validarFormulario = () => {
    const camposObligatorios = [
      "nombre_emp",
      "ape_pat_emp",
      "ape_mat_emp",
      "fec_nac",
      "dni",
      "telefono",
      "especialidad",
      "cargo"
    ]; 
    for (const campo of camposObligatorios) {
      if (!form[campo]) {
        return "Todos los campos obligatorios deben estar completos";
      }
    }
    if (!esTextoValido(form.nombre_emp)) {
      return "El nombre solo debe contener letras y espacios";
    }
    if (!esTextoValido(form.ape_pat_emp)) {
      return "El apellido paterno solo debe contener letras y espacios";
    }
    if (!esTextoValido(form.ape_mat_emp)) {
      return "El apellido materno solo debe contener letras y espacios";
    }
    if (!esTextoValido(form.especialidad)) {
      return "La especialidad solo debe contener letras y espacios";
    }
     
    if (!esNumeroExacto(form.dni, 8)) {
      return "El DNI debe contener exactamente 8 dígitos numéricos";
    }
    if (!esNumeroExacto(form.telefono, 9)) {
      return "El teléfono debe contener exactamente 9 dígitos numéricos";
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

    try {
      if (form.id_emp) { 
        await empleadoService.actualizar(form.id_emp, form);
        setMensajeExito("Empleado actualizado con éxito");
        onExito && onExito("Empleado actualizado con éxito");
      } else {
        await empleadoService.crear(form);
        setMensajeExito("Empleado registrado con éxito");
        onExito && onExito("Empleado registrado con éxito");
      }
      setForm({
        nombre_emp: "",
        ape_pat_emp: "",
        ape_mat_emp: "",
        fec_nac: "",
        dni: "",
        telefono: "",
        especialidad: "",
        cargo: "",
        observacion: "", 
        estado: true,
      });
    } catch (err) {
      setError("Error al guardar. Verifique que los datos sean correctos y no estén duplicados.");
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
        name="nombre_emp"
        placeholder="Nombres"
        className="input input-bordered w-full"
        value={form.nombre_emp}
        onChange={handleChange}
      />

      <input
        name="ape_pat_emp"
        placeholder="Apellido Paterno"
        className="input input-bordered w-full"
        value={form.ape_pat_emp}
        onChange={handleChange}
      />

      <input
        name="ape_mat_emp"
        placeholder="Apellido Materno"
        className="input input-bordered w-full"
        value={form.ape_mat_emp}
        onChange={handleChange}
      />

      <input
        name="fec_nac"
        type="date"
        className="input input-bordered w-full"
        value={form.fec_nac}
        onChange={handleChange}
        max={obtenerFechaMaximaNacimiento()}
      />

      <input
        name="dni"
        placeholder="DNI"
        className="input input-bordered w-full"
        maxLength={8}
        value={form.dni}
        onChange={handleChange}
        inputMode="numeric"
      />

      <input
        name="telefono"
        placeholder="Teléfono"
        className="input input-bordered w-full"
        maxLength={9}
        value={form.telefono}
        onChange={handleChange}
        inputMode="numeric"
      />


      <select
        name="especialidad"
        className="select select-bordered w-full"
        value={form.especialidad}
        onChange={handleChange}
      >
        <option value="" disabled>Seleccione Especialidad</option>
        <option value="ciencias">ciencias</option>
        <option value="letras">letras</option>
        <option value="matematicas">matematicas</option>
        <option value="mixto">mixto</option>
        <option value="aseo">aseo</option>
        <option value="supervisor">supervisor</option>
      </select>
 

      <select
        name="cargo"
        className="select select-bordered w-full"
        value={form.cargo}
        onChange={handleChange}
      >
        <option value="" disabled>Seleccione cargo</option>
        <option value="docente">Docente</option>
        <option value="tutor">Tutor</option>
        <option value="director">Director</option>
        <option value="consultor">Consultor</option>
        <option value="almacen">Almacén</option>
        <option value="limpieza">Limpieza</option>
      </select>

      
      <input
        name="observacion"
        placeholder="Observación"
        className="input input-bordered w-full"
        value={form.observacion}
        onChange={handleChange}
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

      <div className="col-span-2">
        <button type="submit" className="btn btn-success">
          {form.id_emp ? "Actualizar" : "Registrar"} Empleado
        </button>
      </div>
    </form>
  );
}