import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auditoriaAula } from "../../api/aulaService";
import Tabla from "../../components/TablaAuditoria";
import Notificacion from "../../components/Notificacion";
import "../../styles/Botones.css";

export default function AuditoriaAula() {
  const [auditorias, setAuditorias] = useState([]);
  const [mensaje, setMensaje] = useState(null);
  const navigate = useNavigate();

  const cargarAuditorias = async () => {
      const data = await auditoriaAula();
      setAuditorias(data);
  };

  useEffect(() => {
    cargarAuditorias();
  }, []);

  return (
    <div>
      <div>
        <h1>Auditoría de Aulas</h1>
        <button onClick={() => navigate("/")} className="menu-button">
          Volver al Menú
        </button>
      </div>
      <br />
      <Notificacion mensaje={mensaje?.texto} tipo={mensaje?.tipo} />
      <br />
      <Tabla
        columnas={[
          { key: "id_audit_aula", label: "ID Auditoría" },
          { key: "id_aula", label: "ID Aula" },
          { key: "numero_aula_anterior", label: "N° Aula Anterior" },
          { key: "numero_aula_nuevo", label: "N° Aula Nuevo" },
          { key: "aforo_anterior", label: "Aforo Anterior" },
          { key: "aforo_nuevo", label: "Aforo Nuevo" },
          { key: "ubicacion_anterior", label: "Ubicación Anterior" },
          { key: "ubicacion_nuevo", label: "Ubicación Nuevo" },
          { key: "estado_anterior", label: "Estado Anterior" },
          { key: "estado_nuevo", label: "Estado Nuevo" },
          { key: "operacion", label: "Operación" },
          { key: "fecha_modificacion", label: "Fecha Modificación" },
          { key: "usuario_modificador", label: "Usuario Modificador" },
        ]}
        datos={auditorias}
        idKey="id_audit_aula"
      />
    </div>
  );
}
