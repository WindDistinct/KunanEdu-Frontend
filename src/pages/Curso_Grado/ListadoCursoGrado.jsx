import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { cursoGradoService } from "../../api/requestApi";
import Tabla from "../../components/Tabla";
import FormularioCursoGrado from "./FormularioCursoGrado";
import Notificacion from "../../components/Notificacion";
import FiltroTabla from "../../components/FiltroTabla"; 

export default function ListadoCursoGrado() {
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
          ? await cursoGradoService.obtenerTodos()
          : await cursoGradoService.obtener(); 
      const ordenados = datos.sort((a, b) => a.id_curso_grado - b.id_curso_grado);
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
      await cursoGradoService.eliminar(id);
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
    grado: item.id_grado,
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
        {puedeAdministrar ? "Plan Curricular por grado" : "Listado Curso-Grado"}
      </h1>

      <button onClick={() => {setTextoFiltro(""); navigate("/");}} className="btn btn-secondary mb-4">
        ← Volver al Menú
      </button>

      {puedeAdministrar && (
        <button
          onClick={() => setMostrarFormulario(true)}
          className="btn btn-primary mb-4"
        >
          ➕ Registrar nueva Relación
        </button>
      )}

      {mostrarFormulario && (
        <dialog id="modalCG" className="modal modal-open">
          <div className="modal-box w-11/12 max-w-3xl">
            <h3 className="font-bold text-lg mb-4">
              {formData ? "Editar Relación Curso-Grado" : "Registrar Nueva Relación"}
            </h3>
            <FormularioCursoGrado onExito={handleExito} initialData={formData} />

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
              clavesFiltro={["curso", "grado"]}
              onFiltrar={setDatosFiltrados}
              placeholder="Buscar cualquier dato..."
              texto={textoFiltro}
              setTexto={setTextoFiltro}
            />

      <Tabla
        columnas={[
          { key: "curso", label: "Curso" },
          { key: "grado", label: "Grado" },
          ...(puedeAdministrar ? [{ key: "estado", label: "Estado" }] : []),
        ]}
        datos={datosFiltrados}
        onEditar={handleEditar}
        onEliminar={handleEliminar}
        idKey="id_curso_grado"
        mostrarAcciones={puedeAdministrar}
      />
    </div>
  );
}