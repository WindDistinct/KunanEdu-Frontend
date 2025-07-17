import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cursoSeccionService } from "../../api/requestApi";
import Tabla from "../../components/TablaAuditoria";
import FiltroTabla from "../../components/FiltroTabla";

export default function AuditoriaCursoSeccion() {
  const [auditorias, setAuditorias] = useState([]);
  const navigate = useNavigate();
  const [auditoriasFiltradas, setAuditoriasFiltradas] = useState([]);
  const [textoFiltro, setTextoFiltro] = useState("");                

  const cargarAuditorias = async () => {
    try {
      const data = await cursoSeccionService.auditar();
      setAuditorias(data);
      setAuditoriasFiltradas(data);
    } catch (error) {
      console.error("Error al cargar la auditoría de Curso-Sección:", error);
    }
  };

  useEffect(() => {
    cargarAuditorias();
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="text-4xl font-semibold mb-4">Auditoría de Curso-Sección</h1>

      <button onClick={() => {setTextoFiltro(""); navigate("/");}} className="btn btn-secondary mb-3">
        Volver al Menú
      </button>

      <br />
      <br />

      <FiltroTabla
                datos={auditorias}
                clavesFiltro={[
                  "curso_anterior",
                  "curso_nuevo",
                  "seccion_anterior",
                  "seccion_nuevo",
                  "docente_anterior",
                  "docente_nuevo",
                  "observacion"
                 ]}
                onFiltrar={setAuditoriasFiltradas}
                placeholder="Buscar cualquier dato..."
                texto={textoFiltro}
                setTexto={setTextoFiltro}
            />

      <Tabla
        columnas={[
          { key: "id_audit_curso_seccion", label: "ID Auditoría" },
          { key: "curso_anterior", label: "Curso Anterior" },
          { key: "curso_nuevo", label: "Curso Nuevo" },
          { key: "seccion_anterior", label: "Sección Anterior" },
          { key: "seccion_nuevo", label: "Sección Nueva" },
          { key: "docente_anterior", label: "Docente Anterior" },
          { key: "docente_nuevo", label: "Docente Nuevo" }, 
               { key: "observacion", label: "Observacion" },
          { key: "operacion", label: "Operación" },
          { key: "fecha_modificacion", label: "Fecha Modificación" },
          { key: "usuario_modificador", label: "Usuario Modificador" },
        ]}
        datos={auditoriasFiltradas}
        idKey="id_audit_curso_seccion"
      />
    </div>
  );
}