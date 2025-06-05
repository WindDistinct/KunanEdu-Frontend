import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auditoriaGrado } from "../../api/gradoService";
import Tabla from "../../components/TablaAuditoria";
import "../../styles/Botones.css";

export default function AuditoriaGrado() {
  const [auditorias, setAuditorias] = useState([]);
  const navigate = useNavigate();

  const cargarAuditorias = async () => {
      const data = await auditoriaGrado();
      setAuditorias(data);
  };

  useEffect(() => {
    cargarAuditorias();
  }, []);

  return (
    <div>
      <div>
        <h1>Auditoría de Grados</h1>
        <button onClick={() => navigate("/")} className="menu-button">
          Volver al Menú
        </button>
      </div>
      <br />
      <Tabla
        columnas={[
            { key: "id_audit_grado", label: "ID Auditoría" },
            { key: "id_grado", label: "ID Grado" },
            { key: "nivel_anterior", label: "Nivel Anterior" },
            { key: "nivel_nuevo", label: "Nivel Nuevo" },
            { key: "anio_anterior", label: "Año Anterior" },
            { key: "anio_nuevo", label: "Año Nuevo" },
            { key: "cupos_totales_anterior", label: "Cupos Totales Anterior" },
            { key: "cupos_totales_nuevo", label: "Cupos Totales Nuevo" },
            { key: "cupos_disponibles_anterior", label: "Cupos Disponibles Anterior" },
            { key: "cupos_disponibles_nuevo", label: "Cupos Disponibles Nuevo" },
            /*{ key: "estado_anterior", label: "Estado Anterior" },
            { key: "estado_nuevo", label: "Estado Nuevo" },*/
            { key: "operacion", label: "Operación" },
            { key: "fecha_modificacion", label: "Fecha Modificación" },
            { key: "usuario_modificador", label: "Usuario Modificador" }
            ]}
        datos={auditorias}
        idKey="id_audit_grado"
      />
    </div>
  );
}
