import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gradoService } from "../../api/requestApi";
import Tabla from "../../components/TablaAuditoria";
import FiltroTabla from "../../components/FiltroTabla"; 

export default function AuditoriaGrado() {
  const [auditorias, setAuditorias] = useState([]);
  const navigate = useNavigate();
  const [auditoriasFiltradas, setAuditoriasFiltradas] = useState([]);
  const [textoFiltro, setTextoFiltro] = useState("");                

  const cargarAuditorias = async () => {
    const data = await gradoService.auditar();
    setAuditorias(data);
    setAuditoriasFiltradas(data);
  };

  useEffect(() => {
    cargarAuditorias();
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="text-4xl font-semibold mb-4">Auditoría de Grados</h1>

      <button onClick={() => {setTextoFiltro(""); navigate("/");}} className="btn btn-secondary mb-3">
        Volver al Menú
      </button>
      <br />
      <br />

      <FiltroTabla
                datos={auditorias}
                clavesFiltro={[
                  "nivel_anterior",
                  "nivel_nuevo",
                  "anio_anterior",
                  "anio_nuevo",
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
          { key: "id_audit_grado", label: "ID Auditoría" },
          { key: "id_grado", label: "ID Grado" },
          { key: "nivel_anterior", label: "Nivel Anterior" },
          { key: "nivel_nuevo", label: "Nivel Nuevo" },
          { key: "anio_anterior", label: "Año Anterior" },
          { key: "anio_nuevo", label: "Año Nuevo" },
           { key: "observacion", label: "Observacion" },
          { key: "operacion", label: "Operación" },
          { key: "fecha_modificacion", label: "Fecha Modificación" },
          { key: "usuario_modificador", label: "Usuario Modificador" }
        ]}
        datos={auditoriasFiltradas}
        idKey="id_audit_grado"
      />
    </div>
  );
}
