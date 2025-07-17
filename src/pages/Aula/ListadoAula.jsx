import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { aulaService } from "../../api/requestApi";
import Tabla from "../../components/Tabla";
import FormularioAula from "./FormularioAula";
import Notificacion from "../../components/Notificacion";
import FiltroTabla from "../../components/FiltroTabla";

export default function ListadoAula() {
  const [aulas, setAulas] = useState([]);
  const [formData, setFormData] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const navigate = useNavigate();

  const [rol] = useState(() => localStorage.getItem("rol"));
  const puedeAdministrar = rol === "administrador";

  const [datosFiltrados, setDatosFiltrados] = useState([]);
  const [textoFiltro, setTextoFiltro] = useState("");      

  const cargarAulas = useCallback(async () => {
    try {
      const data =
        rol === "administrador"
          ? await aulaService.obtenerTodos()
          : await aulaService.obtener();

      const aulasOrdenadas = data.sort((a, b) => a.id_aula - b.id_aula);
      setAulas(aulasOrdenadas);
      setDatosFiltrados(aulasOrdenadas); 
    } catch (error) {
      setMensaje({ tipo: "error", texto: "Error al cargar las aulas: " + error });
    }
  }, [rol]);

  useEffect(() => {
    cargarAulas();
  }, [cargarAulas]);

  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => {
        setMensaje(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  const handleEliminar = async (id) => {
    try {
      await aulaService.eliminar(id);
      setMensaje({ tipo: "success", texto: "Aula eliminada correctamente" });
      await cargarAulas();
    } catch (error) {
      setMensaje({ tipo: "error", texto: "Error al eliminar el aula: " + error });
    }
  };

  const handleEditar = (aula) => {
    setFormData(aula);
    setMostrarFormulario(true);
  };

  const handleExito = async (texto) => {
    setMensaje({ tipo: "success", texto });
    setFormData(null);
    setMostrarFormulario(false);
    await cargarAulas();
  };

  const handleCancelar = () => {
    setFormData(null);
    setMostrarFormulario(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-4xl font-semibold mb-4">
        {puedeAdministrar ? "Gestión de Aulas" : "Listado de Aulas"}
      </h1>

      <button onClick={() => {setTextoFiltro(""); navigate("/");}} className="btn btn-secondary mb-4">
        ← Volver al Menú
      </button>

      {puedeAdministrar && (
        <button
          onClick={() => setMostrarFormulario(true)}
          className="btn btn-primary mb-4"
        >
          ➕ Registrar nueva Aula
        </button>
      )}

      {mostrarFormulario && (
        <dialog id="modalAula" className="modal modal-open">
          <div className="modal-box w-11/12 max-w-3xl">
            <h3 className="font-bold text-lg mb-4">
              {formData ? "Editar Aula" : "Registrar Nueva Aula"}
            </h3>
            <FormularioAula onExito={handleExito} initialData={formData} />

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
              datos={aulas}
              clavesFiltro={["numero_aula", "aforo", "ubicacion"]}
              onFiltrar={setDatosFiltrados}
              placeholder="Buscar cualquier dato..."
              texto={textoFiltro}
              setTexto={setTextoFiltro}
            />

      <Tabla
        columnas={[
          { key: "numero_aula", label: "N° Aula" },
          { key: "aforo", label: "Aforo" },
          { key: "ubicacion", label: "Ubicación" },
          ...(puedeAdministrar ? [{ key: "estado", label: "Estado" }] : []),
        ]}
        datos={datosFiltrados}
        onEditar={handleEditar}
        onEliminar={handleEliminar}
        idKey="id_aula"
        mostrarAcciones={puedeAdministrar}
      />
    </div>
  );
}