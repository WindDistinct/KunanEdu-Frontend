import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { matriculaService } from "../../api/requestApi";
import Tabla from "../../components/TablaAuditoria";

export default function AuditoriaMatricula() {
  const [auditorias, setAuditorias] = useState([]);
  const navigate = useNavigate();

  const cargarAuditorias = async () => {
    const data = await matriculaService.auditar();   
    setAuditorias(data);
  };

  useEffect(() => {
    cargarAuditorias();
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="text-4xl font-semibold mb-4">Auditoría de Matrículas</h1>
      <button onClick={() => navigate("/")} className="btn btn-secondary mb-3">
        Volver al Menú
      </button>
      <br />
      <br />
      <Tabla
        columnas={[
          { key: "id_audit_matricula", label: "ID Auditoría" },
          { key: "id_matricula", label: "ID Matrícula" },
          
          { key: "observacion_anterior", label: "Observación Anterior" },
          { key: "observacion_nuevo", label: "Observación Nuevo" },
          { key: "alumno_anterior", label: "Alumno Anterior (ID)" },
          { key: "alumno_nuevo", label: "Alumno Nuevo (ID)" },
          { key: "condicion_anterior", label: "Condición Anterior" },
          { key: "condicion_nuevo", label: "Condición Nuevo" }, 
          { key: "seccion_anterior", label: "Sección Anterior (ID)" },
          { key: "seccion_nuevo", label: "Sección Nuevo (ID)" },
          { key: "operacion", label: "Operación" },
          { key: "fecha_modificacion", label: "Fecha Modificación" },
          { key: "usuario_modificador", label: "Usuario Modificador" },
        ]}
        datos={auditorias}
        idKey="id_audit_matricula"
      />
    </div>
  );
}