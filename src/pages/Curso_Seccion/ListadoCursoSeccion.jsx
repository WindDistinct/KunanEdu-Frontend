import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { cursoSeccionService } from "../../api/requestApi";
import Tabla from "../../components/Tabla";
import FormularioCursoSeccion from "./FormularioCursoSeccion";
import Notificacion from "../../components/Notificacion";
import FiltroTabla from "../../components/FiltroTabla";

export default function ListadoCursoSeccion() {
  const [lista, setLista] = useState([]);
  const [formData, setFormData] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const navigate = useNavigate();

  const [datosFiltrados, setDatosFiltrados] = useState([]);
  const [textoFiltro, setTextoFiltro] = useState("");      

  const [rol] = useState(() => localStorage.getItem("rol"));
  const puedeAdministrar = rol === "administrador";

  const cargarDatos = useCallback(async () => {
    try {
      const datos =
        rol === "administrador"
          ? await cursoSeccionService.obtenerTodos()
          : await cursoSeccionService.obtener();
      const ordenados = datos.sort((a, b) => a.id_curso_seccion - b.id_curso_seccion);
      setLista(ordenados);
      setDatosFiltrados(ordenados);
    } catch (error) {
      setMensaje({ tipo: "error", texto: "Error al cargar los datos: " + error });
    }
  }, [rol]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => setMensaje(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  const handleEliminar = async (id) => {
    try {
      await cursoSeccionService.eliminar(id);
      setMensaje({ tipo: "success", texto: "Registro eliminado correctamente" });
      await cargarDatos();
    } catch (error) {
      setMensaje({ tipo: "error", texto: "Error al eliminar el registro: " + error });
    }
  };

  const handleEditar = (item) => {
    const formateado = {
      ...item,
      curso: item.id_curso,
      nombre_curso:item.curso,
      seccion: item.id_seccion,
      estado:item.estado,
      docente: item.id_emp,
    };
    setFormData(formateado);
    setMostrarFormulario(true); 
  };

  const handleExito = async (texto) => {
    setMensaje({ tipo: "success", texto });
    setFormData(null);
    setMostrarFormulario(false);
    await cargarDatos();
  };

  const handleCancelar = () => {
    setFormData(null);
    setMostrarFormulario(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-4xl font-semibold mb-4">
        {puedeAdministrar ? "Gestión Curso-Sección" : "Listado Curso-Sección"}
      </h1>

      <button onClick={() => {setTextoFiltro(""); navigate("/");}} className="btn btn-secondary mb-4">
        ← Volver al Menú
      </button>

      {puedeAdministrar && (
        <button
          onClick={() => setMostrarFormulario(true)}
          className="btn btn-primary mb-4"
        >
          ➕ Registrar Curso Seccion
        </button>
      )}

      {mostrarFormulario && (
        <dialog id="modalCS" className="modal modal-open">
          <div className="modal-box w-11/12 max-w-3xl">
            <h3 className="font-bold text-lg mb-4">
              {formData ? "Editar Profesor" : "Asignar docente a la sección"}
            </h3>
            <FormularioCursoSeccion onExito={handleExito} initialData={formData} />

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
              datos={lista}
              clavesFiltro={["curso", "seccion", "docente"]}
              onFiltrar={setDatosFiltrados}
              placeholder="Buscar cualquier dato..."
              texto={textoFiltro}
              setTexto={setTextoFiltro}
            />

      <Tabla
        columnas={[
          { key: "curso", label: "Curso" },
          { key: "seccion", label: "Sección" },
          { key: "docente", label: "Docente" },
          ...(puedeAdministrar ? [{ key: "estado", label: "Estado" }] : []),
        ]}
        datos={datosFiltrados}
        onEditar={handleEditar}
        onEliminar={handleEliminar}
        idKey="id_curso_seccion"
        mostrarAcciones={puedeAdministrar}
      />
    </div>
  );
}