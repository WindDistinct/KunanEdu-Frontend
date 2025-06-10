import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { matriculaService } from "../../api/requestApi";
import Tabla from "../../components/Tabla";
import FormularioMatricula from "./FormularioMatricula";
import Notificacion from "../../components/Notificacion";

export default function ListadoMatricula() {
  const [lista, setLista] = useState([]);
  const [formData, setFormData] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const navigate = useNavigate();

  const [rol] = useState(() => localStorage.getItem("rol"));
  const puedeAdministrar = rol === "administrador";

  const cargarDatos = useCallback(async () => {
    try {
      const datos = puedeAdministrar
        ? await matriculaService.obtenerTodos()
        : await matriculaService.obtener();

        const ordenados = datos
        .map((matricula) => ({
          ...matricula,
          fecha_matricula: matricula.fecha_matricula ? matricula.fecha_matricula.split("T")[0] : "",
        }))
        .sort((a, b) => a.id_matricula - b.id_matricula);
 
      setLista(ordenados);
    } catch (error) {
      setMensaje({ tipo: "error", texto: "Error al cargar los datos: " + error });
    }
  }, [puedeAdministrar]);

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
      await matriculaService.eliminar(id);
      setMensaje({ tipo: "success", texto: "Matrícula eliminada correctamente" });
      await cargarDatos();
    } catch (error) {
      setMensaje({ tipo: "error", texto: "Error al eliminar la matrícula: " + error });
    }
  };

  const handleEditar = (item) => {
    const formateado = {
      ...item,
      alumno: item.id_alumno,
      seccion: item.id_seccion,
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
        {puedeAdministrar ? "Gestión Matrículas" : "Listado de Matrículas"}
      </h1>

      <button onClick={() => navigate("/")} className="btn btn-secondary mb-4">
        ← Volver al Menú
      </button>

      {puedeAdministrar && (
        <button
          onClick={() => setMostrarFormulario(true)}
          className="btn btn-primary mb-4"
        >
          ➕ Registrar nueva Matrícula
        </button>
      )}

      {mostrarFormulario && (
        <dialog className="modal modal-open">
          <div className="modal-box w-11/12 max-w-3xl">
            <h3 className="font-bold text-lg mb-4">
              {formData ? "Editar Matrícula" : "Registrar Nueva Matrícula"}
            </h3>
            <FormularioMatricula onExito={handleExito} initialData={formData} />
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

      <Tabla
        columnas={[
          { key: "alumno", label: "Alumno" },
          { key: "seccion", label: "Sección" },
           { key: "fecha_matricula", label: "Fecha Matricula" },
            { key: "condicion", label: "Condición" },
          { key: "observacion", label: "Observacion" },

          ...(puedeAdministrar ? [{ key: "estado", label: "Estado" }] : []),
        ]}
        datos={lista}
        onEditar={handleEditar}
        onEliminar={handleEliminar}
        idKey="id_matricula"
        mostrarAcciones={puedeAdministrar}
      />
    </div>
  );
}