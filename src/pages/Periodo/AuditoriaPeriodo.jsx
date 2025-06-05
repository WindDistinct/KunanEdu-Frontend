import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auditoriaPeriodo } from "../../api/periodoService";
import Tabla from "../../components/TablaAuditoria";
import "../../styles/Botones.css";

export default function AuditoriaPeriodo() {
  const [auditorias, setAuditorias] = useState([]);
  const navigate = useNavigate();

  const cargarAuditorias = async () => {
      const data = await auditoriaPeriodo();
      setAuditorias(data);
  };

  useEffect(() => {
    cargarAuditorias();
  }, []);

  return (
    <div>
      <div>
        <h1>Auditoría de Periodos</h1>
        <button onClick={() => navigate("/")} className="menu-button">
          Volver al Menú
        </button>
      </div>
      <br />
      <Tabla
        columnas={[
            { key: "id_audit_periodo", label: "ID Auditoría" },
            { key: "id_periodo", label: "ID Período" },
            { key: "anio_anterior", label: "Año Anterior" },
            { key: "anio_nuevo", label: "Año Nuevo" },
            { key: "descripcion_anterior", label: "Descripción Anterior" },
            { key: "descripcion_nuevo", label: "Descripción Nueva" },
            { key: "progreso_anterior", label: "Progreso Anterior" },
            { key: "progreso_nuevo", label: "Progreso Nuevo" },
            /*{ key: "estado_anterior", label: "Estado Anterior" },
            { key: "estado_nuevo", label: "Estado Nuevo" },*/
            { key: "operacion", label: "Operación" },
            { key: "fecha_modificacion", label: "Fecha Modificación" },
            { key: "usuario_modificador", label: "Usuario Modificador" }
            ]}
        datos={auditorias}
        idKey="id_audit_periodo"
      />
    </div>
  );
}
