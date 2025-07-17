import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { periodoService } from "../../api/requestApi"
import Tabla from "../../components/TablaAuditoria";
import "../../styles/Botones.css";
import FiltroTabla from "../../components/FiltroTabla";

export default function AuditoriaPeriodo() {
  const [auditorias, setAuditorias] = useState([]);
  const navigate = useNavigate();
  const [auditoriasFiltradas, setAuditoriasFiltradas] = useState([]);
  const [textoFiltro, setTextoFiltro] = useState("");                

  const cargarAuditorias = async () => {
    const data = await periodoService.auditar();
    setAuditorias(data);
    setAuditoriasFiltradas(data);
  };

  useEffect(() => {
    cargarAuditorias();
  }, []);

  return (
     <div className="container mt-4">
    <h1 className="text-4xl font-semibold mb-4">Auditoría de Periodos</h1>
      <button onClick={() => {setTextoFiltro(""); navigate("/");}} className="btn btn-secondary mb-3">
        Volver al Menú
      </button>
      <br />
      <FiltroTabla
                datos={auditorias}
                clavesFiltro={[
                  "anio_anterior",
                  "anio_anterior",
                  "descripcion_anterior",
                  "descripcion_nuevo",
                  "progreso_anterior",
                  "progreso_nuevo",
                  "usuario_modificador",
                  "observacion"
                 ]}
                onFiltrar={setAuditoriasFiltradas}
                placeholder="Buscar cualquier dato..."
                texto={textoFiltro}
                setTexto={setTextoFiltro}
            />
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
             { key: "observacion", label: "Observacion" },
          { key: "operacion", label: "Operación" },
          { key: "fecha_modificacion", label: "Fecha Modificación" },
          { key: "usuario_modificador", label: "Usuario Modificador" }
        ]}
        datos={auditoriasFiltradas}
        idKey="id_audit_periodo"
      />
    </div>
  );
}
