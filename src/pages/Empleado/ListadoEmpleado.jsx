import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { empleadoService } from "../../api/requestApi";
import Tabla from "../../components/Tabla";
import FormularioEmpleado from "./FormularioEmpleado";
import Notificacion from "../../components/Notificacion";
import FiltroTabla from "../../components/FiltroTabla";

export default function ListadoEmpleado() {
  const [empleados, setEmpleados] = useState([]);
  const [formData, setFormData] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const navigate = useNavigate();
  const [datosFiltrados, setDatosFiltrados] = useState([]);
  const [textoFiltro, setTextoFiltro] = useState("");      

  const [rol] = useState(() => localStorage.getItem("rol"));
  const puedeAdministrar = rol === "administrador";

  const cargarEmpleados = useCallback(async () => {
    try {
      const data =
        rol === "administrador"
          ? await empleadoService.obtenerTodos()
          : await empleadoService.obtener();

      const empleadosFormateados = data
        .map((empleado) => ({
          ...empleado,
          fec_nac: empleado.fec_nac ? empleado.fec_nac.split("T")[0] : "",
        }))
        .sort((a, b) => a.id_emp - b.id_emp); 
      setEmpleados(empleadosFormateados);
      setDatosFiltrados(empleadosFormateados);
    } catch (error) {
      setMensaje({ tipo: "error", texto: "Error al cargar los empleados" });
    }
  }, [rol]);

  useEffect(() => {
    cargarEmpleados();
  }, [cargarEmpleados]);

  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => setMensaje(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  const handleEliminar = async (id) => {
    try {
      await empleadoService.eliminar(id);
      setMensaje({ tipo: "success", texto: "Empleado eliminado correctamente" });
      await cargarEmpleados();
    } catch (error) {
      setMensaje({ tipo: "error", texto: "Error al eliminar el empleado" });
    }
  };

  const handleEditar = (empleado) => {
    setFormData(empleado);
    setMostrarFormulario(true);
  };

  const handleExito = async (texto) => {
    setMensaje({ tipo: "success", texto });
    setFormData(null);
    setMostrarFormulario(false);
    await cargarEmpleados();
  };

  const handleCancelar = () => {
    setFormData(null);
    setMostrarFormulario(false);
  };

  return (
    <div className="p-4">
    <h1 className="text-4xl font-semibold mb-4">
        {puedeAdministrar ? "Gestión de Empleado" : "Listado de Empleado"}
      </h1>

      <button onClick={() => {setTextoFiltro(""); navigate("/");}} className="btn btn-secondary mb-4">
        ← Volver al Menú
      </button>
  {puedeAdministrar && (
  <button
    onClick={() => setMostrarFormulario(true)}
    className="btn btn-primary mb-4"
  >
    ➕ Registrar nuevo Empleado
  </button>
)}

{mostrarFormulario && (
  <dialog id="modalEmpleado" className="modal modal-open">
    <div className="modal-box w-11/12 max-w-3xl">
      <h3 className="font-bold text-lg mb-4">
        {formData ? "Editar Empleado" : "Registrar Nuevo Empleado"}
      </h3>
      <FormularioEmpleado onExito={handleExito} initialData={formData} />

      <div className="modal-action">
        <button
          className="btn btn-error"
          onClick={handleCancelar}
        >
          Cancelar
        </button>
      </div>
    </div>
    <form method="dialog" className="modal-backdrop">
      <button onClick={handleCancelar}>Cerrar</button>
    </form>
  </dialog>
)}
    <div className="h-12 mb-4">
      <Notificacion mensaje={mensaje?.texto} tipo={mensaje?.tipo} />
    </div>
    {/* Filtro */}        
          <FiltroTabla
            datos={empleados}
            clavesFiltro={["nombre_emp", "ape_pat_emp", "ape_mat_emp", "numero_documento"]}
            onFiltrar={setDatosFiltrados}
            placeholder="Buscar por nombre, apellido o número de documento..."
            texto={textoFiltro}
            setTexto={setTextoFiltro}
          />
      <Tabla
        columnas={[
          { key: "nombre_emp", label: "Nombre" },
          { key: "ape_pat_emp", label: "Apellido Paterno" },
          { key: "ape_mat_emp", label: "Apellido Materno" },
          { key: "fec_nac", label: "Fecha de Nacimiento" },
           { key: "tipo_documento", label: "Tipo Documento" },
          { key: "numero_documento", label: "Numero Documento" },
          { key: "telefono", label: "Teléfono" },
          { key: "especialidad", label: "Especialidad" },
          { key: "cargo", label: "Cargo" },
          { key: "observacion", label: "Observación" },
          ...(puedeAdministrar ? [{ key: "estado", label: "Estado" }] : []),
        ]}
        datos={datosFiltrados}  
        onEditar={handleEditar}
        onEliminar={handleEliminar}
        idKey="id_emp"
        mostrarAcciones={puedeAdministrar}
      />
    </div>
  );
}