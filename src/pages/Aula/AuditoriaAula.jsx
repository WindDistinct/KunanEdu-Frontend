import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { aulaService } from "../../api/requestApi"
import Tabla from "../../components/TablaAuditoria";
import FiltroTabla from "../../components/FiltroTabla";

export default function AuditoriaAula() {
  const [auditorias, setAuditorias] = useState([]);
  const navigate = useNavigate();

  const [auditoriasFiltradas, setAuditoriasFiltradas] = useState([]);
  const [textoFiltro, setTextoFiltro] = useState("");                

  const cargarAuditorias = async () => {
    const data = await aulaService.auditar();
    setAuditorias(data);
    setAuditoriasFiltradas(data);
  };

  useEffect(() => {
    cargarAuditorias();
  }, []);

  return (
    <div className="container mt-4">
    <h1 className="text-4xl font-semibold mb-4">Auditoría de Aulas</h1>
      <button onClick={() => {setTextoFiltro(""); navigate("/");}} className="btn btn-secondary mb-3">
        Volver al Menú
      </button>
      <br />
       <br />

       <FiltroTabla
                 datos={auditorias}
                 clavesFiltro={[
                   "numero_aula_anterior",
                   "numero_aula_nuevo",
                   "aforo_anterior",
                   "aforo_nuevo",
                   "ubicacion_anterior",
                   "ubicacion_nuevo",
                   "usuario_modificador",
                  ]}
                 onFiltrar={setAuditoriasFiltradas}
                 placeholder="Buscar cualquier dato..."
                 texto={textoFiltro}
                 setTexto={setTextoFiltro}
             />

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
            { key: "observacion", label: "Observacion" },
          { key: "operacion", label: "Operación" },
          { key: "fecha_modificacion", label: "Fecha Modificación" },
          { key: "usuario_modificador", label: "Usuario Modificador" },
        ]}
        datos={auditoriasFiltradas}
        idKey="id_audit_aula"
      />
    </div>
  );
}
