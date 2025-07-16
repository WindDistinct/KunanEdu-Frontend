import React, { useEffect, useState } from "react";
import { usuarioService, empleadoService } from "../../api/requestApi";

export default function FormularioUsuario({ onExito, initialData }) {
  const [observacion, setObservacion] = useState("");
  const [form, setForm] = useState({
    username: "",
    password: "",
    rol: "",
    empleado: "",
    estado: true,
  });

  const [empleados, setEmpleados] = useState([]);
  const [error, setError] = useState(null);
  const [mensajeExito, setMensajeExito] = useState(null);

  useEffect(() => {
    const cargarEmpleados = async () => {
      try {
        const data = await empleadoService.obtenerEmpleadoUsuarios();
        console.log(data);

        setEmpleados(data);
      } catch (e) {
        setError("Error al cargar los empleados");
      }
    };

    cargarEmpleados();
  }, []);

  useEffect(() => {
    if (initialData) {
      setForm({ ...initialData, password: "" });
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
    const nuevoValor = type === "checkbox" ? checked : value.trimStart();
    setForm((prev) => ({ ...prev, [name]: nuevoValor }));
  };

  const validarFormulario = () => {
    if (!form.username || !form.rol || !form.empleado || (!initialData && !form.password)) {
      return "Todos los campos son obligatorios";
    }
    if (/\d/.test(form.username)) {
      return "El nombre de usuario no debe contener números";
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

    if (form.id_usuario) {
      document.getElementById("modalObservacion").showModal();
    } else {
      await enviarFormulario();
    }

  };

  const enviarFormulario = async () => {

    try {

      const datos = {
        username: form.username.trim(),
        rol: form.rol,
        empleado: parseInt(form.empleado),
        estado: form.estado,
        observacion: observacion.trim(),
      };
      if (!initialData) {
        datos.password = form.password;
      }

      if (initialData) {
        await usuarioService.actualizar(initialData.id_usuario, datos);
        setMensajeExito("Usuario actualizado con éxito");
        onExito("Usuario actualizado con éxito");
      } else {
        await usuarioService.crear(datos);
        setMensajeExito("Usuario registrado con éxito");
        onExito("Usuario registrado con éxito");
      }

      setForm({
        username: "",
        password: "",
        rol: "",
        empleado: "",
        estado: true,
      });
      setObservacion("");
      document.getElementById("modalObservacion").close(); // Cerrar modal
    } catch (err) {
      setError("Error al guardar. Verifique que el número de aula no esté duplicado");
    }
  }

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
          <input
            name="username"
            placeholder="Usuario"
            className="input input-bordered w-full"
            value={form.username}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (/\d/.test(e.key) || e.key === " ") e.preventDefault();
            }}
          />

          {!initialData && (
            <input
              name="password"
              type="password"
              placeholder="Contraseña"
              className="input input-bordered w-full"
              value={form.password}
              onChange={handleChange}
              onKeyDown={(e) => {
                if (e.key === " ") e.preventDefault();
              }}
            />
          )}

          <select
            name="rol"
            className="select select-bordered w-full"
            value={form.rol}
            onChange={handleChange}
          >
            <option value="" disabled>Seleccione Rol</option>
            <option value="administrador">Administrador</option>
            <option value="usuario">Usuario</option>
            <option value="profesor">Profesor</option>
            <option value="auditor">Auditor</option>
          </select>

          <select
            name="empleado"
            className="select select-bordered w-full"
            value={form.empleado}
            onChange={handleChange}
          >
            <option value="" disabled>Seleccione Empleado</option>
            {empleados.map((emp) => (
              <option key={emp.id_emp} value={emp.id_emp}>
                {emp.nombre_completo}
              </option>
            ))}
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

        <div className="mt-4">
          <button
            type="submit"
            className={`btn ${initialData ? "btn-warning" : "btn-success"}`}
          >
            {initialData ? "Actualizar Usuario" : "Registrar Usuario"}
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