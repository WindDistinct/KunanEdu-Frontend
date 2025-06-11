import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cursoSeccionService } from "../../api/requestApi"; // Asegúrate de tener este servicio implementado
import Tabla from "../../components/TablaAuditoria";

export default function AuditoriaCursoSeccion() {
  const [auditorias, setAuditorias] = useState([]);
  const navigate = useNavigate();

  const cargarAuditorias = async () => {
    try {
      const data = await cursoSeccionService.auditar();
      setAuditorias(data);
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

      <button onClick={() => navigate("/")} className="btn btn-secondary mb-3">
        Volver al Menú
      </button>

      <br />
      <br />

      <Tabla
        columnas={[
          { key: "id_audit_curso_seccion", label: "ID Auditoría" },
          { key: "curso_anterior", label: "Curso Anterior" },
          { key: "curso_nuevo", label: "Curso Nuevo" },
          { key: "seccion_anterior", label: "Sección Anterior" },
          { key: "seccion_nuevo", label: "Sección Nueva" },
          { key: "docente_anterior", label: "Docente Anterior" },
          { key: "docente_nuevo", label: "Docente Nuevo" }, 
          { key: "operacion", label: "Operación" },
          { key: "fecha_modificacion", label: "Fecha Modificación" },
          { key: "usuario_modificador", label: "Usuario Modificador" },
        ]}
        datos={auditorias}
        idKey="id_audit_curso_seccion"
      />
    </div>
  );
}