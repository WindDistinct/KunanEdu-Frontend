 

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cursoGradoService } from "../../api/requestApi";
import Tabla from "../../components/TablaAuditoria";

export default function AuditoriaCursoGrado() {
  const [auditorias, setAuditorias] = useState([]);
  const navigate = useNavigate();

  const cargarAuditorias = async () => {
    try {
      const data = await cursoGradoService.auditar();
      setAuditorias(data);
    } catch (error) {
      console.error("Error al cargar la auditoría de Curso-Grado:", error);
    }
  };

  useEffect(() => {
    cargarAuditorias();
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="text-4xl font-semibold mb-4">Auditoría de Curso-Grado</h1>

      <button onClick={() => navigate("/")} className="btn btn-secondary mb-3">
        Volver al Menú
      </button>

      <br />
      <br />

      <Tabla
        columnas={[
          { key: "id_audit_curso_grado", label: "ID Auditoría" },
         { key: "curso_nterior", label: "N° Curso Anterior" },
          { key: "curso_nuevo", label: "N° Curso Nuevo" },
          { key: "grado_anterior", label: "Grado Anterior" },
          { key: "grado_nuevo", label: "Grado Nuevo" }, 
          { key: "operacion", label: "Operación" },
          { key: "fecha_modificacion", label: "Fecha Modificación" },
          { key: "usuario_modificador", label: "Usuario Modificador" },
        ]}
        datos={auditorias}
        idKey="id_audit_curso_grado"
      />
    </div>
  );
}