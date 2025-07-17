import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { seccionService } from "../../api/requestApi";
import Tabla from "../../components/Tabla";
import FormularioSeccion from "./FormularioSeccion";
import Notificacion from "../../components/Notificacion";
import FiltroTabla from "../../components/FiltroTabla"; 

export default function ListadoSeccion() {
  const [secciones, setSecciones] = useState([]);
  const [formData, setFormData] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const navigate = useNavigate();
  const [datosFiltrados, setDatosFiltrados] = useState([]);
  const [textoFiltro, setTextoFiltro] = useState("");      

  const [rol] = useState(() => localStorage.getItem("rol"));
  const puedeAdministrar = rol === "administrador";

  const cargarSecciones = useCallback(async () => {
    try {
      const data =
        rol === "administrador"
          ? await seccionService.obtenerTodos()
          : await seccionService.obtener();

      const ordenadas = data.sort((a, b) => a.id_seccion - b.id_seccion);
      setSecciones(data);
      setDatosFiltrados(data);
    } catch (err) {
      setMensaje({ tipo: "error", texto: "Error al cargar las secciones: " + err });
    }
  }, [rol]);

  useEffect(() => {
    cargarSecciones();
  }, [cargarSecciones]);

  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => setMensaje(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  const handleEliminar = async (id) => {
    try {
      await seccionService.eliminar(id);
      setMensaje({ tipo: "success", texto: "Sección eliminada correctamente" });
      await cargarSecciones();
    } catch (error) {
      setMensaje({ tipo: "error", texto: "Error al eliminar la sección: " + error });
    }
  };

  const handleEditar = (seccion) => {
    const formateado = {
      ...seccion,
      aula: seccion.id_aula,
      grado: seccion.id_grado,
      periodo: seccion.id_periodo,
    };
    setFormData(formateado);
    setMostrarFormulario(true);
  };

  const handleExito = async (texto) => {
    setMensaje({ tipo: "success", texto });
    setFormData(null);
    setMostrarFormulario(false);
    await cargarSecciones();
  };

  const handleCancelar = () => {
    setFormData(null);
    setMostrarFormulario(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-4xl font-semibold mb-4">
        {puedeAdministrar ? "Gestión de Secciones" : "Listado de Secciones"}
      </h1>

      <button onClick={() => {setTextoFiltro(""); navigate("/");}} className="btn btn-secondary mb-4">
        ← Volver al Menú
      </button>

      {puedeAdministrar && (
        <button
          onClick={() => setMostrarFormulario(true)}
          className="btn btn-primary mb-4"
        >
          ➕ Registrar nueva Sección
        </button>
      )}

      {mostrarFormulario && (
        <dialog id="modalSeccion" className="modal modal-open">
          <div className="modal-box w-11/12 max-w-3xl">
            <h3 className="font-bold text-lg mb-4">
              {formData ? "Editar Sección" : "Registrar Nueva Sección"}
            </h3>
            <FormularioSeccion onExito={handleExito} initialData={formData} />

            <div className="modal-action">
              <button className="btn btn-error" onClick={handleCancelar}>
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
              datos={secciones}
              clavesFiltro={["nombre", "grado", "aula", "periodo"]}
              onFiltrar={setDatosFiltrados}
              placeholder="Buscar cualquier dato..."
              texto={textoFiltro}
              setTexto={setTextoFiltro}
            />

      <Tabla
        columnas={[
          { key: "nombre", label: "Nombre" },
          { key: "grado", label: "Grado" },
          { key: "aula", label: "Aula" },
          { key: "periodo", label: "Periodo" },
          ...(puedeAdministrar ? [{ key: "estado", label: "Estado" }] : []),
        ]}
        datos={datosFiltrados}
        onEditar={handleEditar}
        onEliminar={handleEliminar}
        idKey="id_seccion"
        mostrarAcciones={puedeAdministrar}
      />
    </div>
  );
}
