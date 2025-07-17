import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { seccionService } from "../../api/requestApi"
import Tabla from "../../components/TablaAuditoria";
import "../../styles/Botones.css";
import FiltroTabla from "../../components/FiltroTabla"; 

export default function AuditoriaSeccion() {
  const [auditorias, setAuditorias] = useState([]);
  const navigate = useNavigate();
  const [auditoriasFiltradas, setAuditoriasFiltradas] = useState([]);
  const [textoFiltro, setTextoFiltro] = useState("");                

  const cargarAuditorias = async () => {
    const data = await seccionService.auditar();
    setAuditorias(data);
    setAuditoriasFiltradas(data);
  };

  useEffect(() => {
    cargarAuditorias();
  }, []);

  return (
    <div className="container mt-4">
    <h1 className="text-4xl font-semibold mb-4">Auditoría de Secciones</h1>
      <button onClick={() => {setTextoFiltro(""); navigate("/");}} className="btn btn-secondary mb-3">
        Volver al Menú
      </button>
      <br />
      <FiltroTabla
                datos={auditorias}
                clavesFiltro={[
                  "aula_anterior",
                  "aula_nuevo",
                  "grado_anterior",
                  "grado_nuevo",
                  "nombre_anterior",
                  "nombre_nuevo",
                  "periodo_anterior",
                  "periodo_nuevo",
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
          { key: "id_audit_seccion", label: "ID Auditoría" },
          { key: "id_seccion", label: "ID Sección" },
          { key: "aula_anterior", label: "Aula Anterior" },
          { key: "aula_nuevo", label: "Aula Nuevo" },
          { key: "grado_anterior", label: "Grado Anterior" },
          { key: "grado_nuevo", label: "Grado Nuevo" },
          { key: "nombre_anterior", label: "Nombre Anterior" },
          { key: "nombre_nuevo", label: "Nombre Nuevo" },
          { key: "periodo_anterior", label: "Periodo Anterior" },
          { key: "periodo_nuevo", label: "Periodo Nuevo" },
          { key: "operacion", label: "Operación" },
             { key: "observacion", label: "Observacion" },
          { key: "fecha_modificacion", label: "Fecha Modificación" },
          { key: "usuario_modificador", label: "Usuario Modificador" },
        ]}
        datos={auditoriasFiltradas}
        idKey="id_audit_seccion"
      />
    </div>
  );
}
