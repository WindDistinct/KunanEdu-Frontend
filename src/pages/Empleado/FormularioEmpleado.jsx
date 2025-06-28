import React, { useEffect, useState } from "react";
import { empleadoService, usuarioService } from "../../api/requestApi";

export default function FormularioEmpleado({ onExito, initialData }) {
    const [obs, setObservacion] = useState("");
  const [form, setForm] = useState({
    nombre_emp: "",
    ape_pat_emp: "",
    ape_mat_emp: "",
    fec_nac: "",
   tipo_documento: "",
  numero_documento: "",
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

    if (["numero_documento", "telefono"].includes(name)) {
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
      "tipo_documento",
      "numero_documento",
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
    if (!form.tipo_documento)
      return "Debe seleccionar un tipo de documento";
    if (!form.numero_documento)
      return "Debe ingresar el número de documento";
    if (form.tipo_documento === "DNI" && !esNumeroExacto(form.numero_documento, 8))
      return "El DNI debe tener exactamente 8 dígitos numéricos";
    if (form.tipo_documento === "CARNET" && form.numero_documento.length < 9)
      return "El Carnet debe tener al menos 9 caracteres";
    if (form.tipo_documento === "PASAPORTE" && form.numero_documento.length < 9)
      return "El pasaporte debe tener al menos 9 caracteres";
 
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

    if (form.id_emp) {
      document.getElementById("modalObservacion").showModal(); 
    } else {
      await enviarFormulario();
    }
  
  };

   const enviarFormulario = async () => { 
    try { 

       const datos = {
      ...form,
      obs: obs.trim(),
      };

      if (form.id_emp) {  
        await empleadoService.actualizar(form.id_emp, datos);
        setMensajeExito("Empleado actualizado con éxito");
        onExito && onExito("Empleado actualizado con éxito");
      } else {
        await empleadoService.crear(datos);
        setMensajeExito("Empleado registrado con éxito");
        onExito && onExito("Empleado registrado con éxito");
      }
      setForm({
        nombre_emp: "",
        ape_pat_emp: "",
        ape_mat_emp: "",
        fec_nac: "",
        tipo_documento: "",
        numero_documento: "", 
        telefono: "",
        especialidad: "",
        cargo: "", 
        observacion: "", 
        estado: true,
      });
      setObservacion("");
      document.getElementById("modalObservacion").close(); 
    } catch (err) {
      setError("Error al guardar. Verifique que el nombre de empleado no esté duplicado");
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
        <div>
            <label className="label">
              <span className="label-text">Nombres</span>
            </label>
            <input
              name="nombre_emp"
              className="input input-bordered w-full"
              value={form.nombre_emp}
              onChange={handleChange}
            />
        </div>
             <div>
            <label className="label">
              <span className="label-text">Apellido Paterno</span>
            </label>
            <input
              name="ape_pat_emp"
              className="input input-bordered w-full"
              value={form.ape_pat_emp}
              onChange={handleChange}
            />
      </div> 

     <div>
          <label className="label">
            <span className="label-text">Apellido Materno</span>
          </label>
          <input
            name="ape_mat_emp"
            className="input input-bordered w-full"
            value={form.ape_mat_emp}
            onChange={handleChange}
          />
      </div>
      <div>
        <label className="label">
          <span className="label-text">Fecha de Nacimiento</span>
        </label>
        <input
          name="fec_nac"
          type="date"
          className="input input-bordered w-full"
          value={form.fec_nac}
          onChange={handleChange}
         max={obtenerFechaMaximaNacimiento()}
        />
      </div>
      
      <div>
          <label className="label">
            <span className="label-text">Tipo de Documento</span>
          </label>
          <select
            name="tipo_documento"
            className="select select-bordered w-full"
            value={form.tipo_documento}
            onChange={handleChange}
          >
            <option value="">Elija un tipo de documento</option>
            <option value="DNI">DNI</option>
            <option value="CARNET">Carnet de extranjería</option>
            <option value="PASAPORTE">Pasaporte</option>
          </select>
      </div>

       <div>
          <label className="label">
            <span className="label-text">Número de Documento</span>
          </label>
          <input
            name="numero_documento"
            className="input input-bordered w-full"
            value={form.numero_documento}
            onChange={handleChange}
            maxLength={form.tipo_documento === "DNI" ? 8 : 12}
            inputMode="numeric"
            onKeyDown={(e) => e.key === " " && e.preventDefault()}
          />
      </div>
      <div>
            <label className="label">
              <span className="label-text">Teléfono</span>
            </label>
            <input
              name="telefono"
              className="input input-bordered w-full"
              value={form.telefono}
              onChange={handleChange}
              maxLength={9}
              inputMode="numeric"
              onKeyDown={(e) => e.key === " " && e.preventDefault()}
            />
      </div>
       
       
        <div>
          <label className="label">
            <span className="label-text">Especialidad</span>
          </label>
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
      </div>

      <div>
          <label className="label">
            <span className="label-text">Cargo</span>
          </label>
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
      </div> 

  {!initialData && (
         <div>
            <label className="label">
              <span className="label-text">Observación</span>
            </label>
            <input
              name="observacion"
              className="input input-bordered w-full"
              value={form.observacion}
              onChange={handleChange}
              
            />
      </div>
      )}

        {initialData && (
          <div className="col-span-2 mt-2">
            <label className="label cursor-pointer w-full">
              <span className="label-text">
                Estado:{" "}
                <span className={`font-semibold ml-2 ${form.estado ? "text-green-600" : "text-red-600"}`}>
                  {form.estado ? "Activo" : "Inactivo"}
                </span>
              </span>
              <input
                type="checkbox"
                name="estado"
                className="toggle toggle-success ml-4"
                checked={!!form.estado}
                onChange={handleChange}
              />
            </label>
          </div>
        )} 
      </div>
      <div className="mt-4">
        <button
          type="submit"
          className={`btn ${form.id_emp ? "btn-warning" : "btn-success"}`}
        >
          {form.id_emp ? "Actualizar " : "Registrar "} Empleado
        </button>
      </div>   
        
    </form>

      <dialog id="modalObservacion" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Justifique su edición</h3>
            <textarea
              name="obs"
              className="textarea textarea-bordered w-full mt-4"
              placeholder="Escriba la justificación"
              value={obs}
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