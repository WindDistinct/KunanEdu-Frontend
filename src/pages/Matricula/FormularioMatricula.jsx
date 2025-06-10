import React, { useEffect, useState } from "react";
import { alumnoService, seccionService, matriculaService } from "../../api/requestApi";

export default function FormularioMatricula({ onExito, initialData }) {
  const [form, setForm] = useState({
    alumno: "",
    seccion: "",
     condicion: "",
    estado: true,
  });

  const [alumnos, setAlumnos] = useState([]);
  const [secciones, setSecciones] = useState([]);
  const [error, setError] = useState(null);
  const [mensajeExito, setMensajeExito] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [alumnosData, seccionesData] = await Promise.all([
          alumnoService.obtener(),
          seccionService.obtener(),
        ]);
        console.log(alumnosData)
        console.log(seccionesData)

        setAlumnos(alumnosData);
        setSecciones(seccionesData);
      } catch (e) {
        setError("Error al cargar datos para el formulario");
      }
    };
    cargarDatos();
  }, []);

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
    const { alumno, seccion ,condicion} = form;
    if (!alumno || !seccion  || !condicion) {
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
      alumno: parseInt(form.alumno),
      seccion: parseInt(form.seccion),
      condicion: form.condicion,
      ...(initialData && { estado: form.estado }),
    };

    try {
      if (form.id_matricula) {
        await matriculaService.actualizar(form.id_matricula, datos);
        setMensajeExito("Matrícula actualizada con éxito");
        onExito("Matrícula actualizada con éxito");
      } else {
        await matriculaService.crear(datos);
        setMensajeExito("Matrícula registrada con éxito");
        onExito("Matrícula registrada con éxito");
      }

      setForm({
        alumno: "",
        seccion: "",
        estado: true,
      });
    } catch (err) {
      setError("Error al guardar. Verifique que la matrícula no esté duplicada");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="col-span-2 h-16 relative">
        {error && <div className="alert alert-error absolute w-full"><span>{error}</span></div>}
        {mensajeExito && <div className="alert alert-success absolute w-full"><span>{mensajeExito}</span></div>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select
          name="alumno"
          className="select select-bordered w-full"
          value={form.alumno}
          onChange={handleChange}
        >
          <option value="" disabled>Seleccionar Alumno</option>
          {alumnos.map((a) => (
            <option key={a.id_alumno} value={a.id_alumno}>
              {a.nombre} {a.apellido_paterno} {a.apellido_materno}
            </option>
          ))}
        </select>

        <select
          name="seccion"
          className="select select-bordered w-full"
          value={form.seccion}
          onChange={handleChange}
        >
          <option value="" disabled>Seleccionar Sección</option>
          {secciones.map((s) => (
            <option key={s.id_seccion} value={s.id_seccion}>
              {s.nombre} {s.grado}
            </option>
          ))}
        </select>

        <select
            name="condicion"
            className="select select-bordered w-full"
            value={form.condicion}
            onChange={handleChange}
            >
            <option value="" disabled>Seleccionar Condición</option>
            <option value="Reservado">Reservado</option>
            <option value="Matriculado">Matriculado</option>
            <option value="Por cancelar">Por cancelar</option>
            <option value="Retirado">Retirado</option>
            <option value="Condicional">Condicional</option>
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
          {form.id_matricula ? "Actualizar" : "Registrar"} Matrícula
        </button>
      </div>
    </form>
  );
}