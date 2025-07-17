import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { asistenciaService } from "../../api/requestApi";
import Tabla from "../../components/TablaAuditoria";
import FiltroTabla from "../../components/FiltroTabla";

export default function AuditoriaAsistencia() {
  const [auditorias, setAuditorias] = useState([]);
  const navigate = useNavigate();
  const [auditoriasFiltradas, setAuditoriasFiltradas] = useState([]);
  const [textoFiltro, setTextoFiltro] = useState("");

  const cargarAuditorias = async () => {
    const data = await asistenciaService.auditar(); // Debes tener este endpoint
    console.log(data)
    setAuditorias(data);
    setAuditoriasFiltradas(data);
  };

  useEffect(() => {
    cargarAuditorias();
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="text-4xl font-semibold mb-4">Auditoría de Asistencias</h1>
      <button onClick={() => {setTextoFiltro(""); navigate("/");}} className="btn btn-secondary mb-3">
        Volver al Menú
      </button>
      <br />
      <br />

      <FiltroTabla
                datos={auditorias}
                clavesFiltro={[
                  "dia",
                  "fecha",
                  "usuario_modificador",
                 ]}
                onFiltrar={setAuditoriasFiltradas}
                placeholder="Buscar por día, fecha o usuario..."
                texto={textoFiltro}
                setTexto={setTextoFiltro}
            />

      <Tabla
        columnas={[
          { key: "id_audit_asistencia", label: "ID Auditoría" },
          { key: "id_asistencia", label: "ID Asistencia" },
          { key: "id_matricula", label: "ID Matrícula" },
          { key: "fecha", label: "Fecha" },
          { key: "dia", label: "Día" },
          { key: "asistio_anterior", label: "¿Asistió Antes?" },
          { key: "asistio_nuevo", label: "¿Asistió Nuevo?" },
          { key: "estado_anterior", label: "Estado Anterior" },
          { key: "estado_nuevo", label: "Estado Nuevo" },
          { key: "id_curso_seccion", label: "Curso-Sección" },
          { key: "operacion", label: "Operación" },
          { key: "fecha_modificacion", label: "Fecha Modificación" },
          { key: "usuario_modificador", label: "Usuario Modificador" }, 
        ]}
        datos={auditoriasFiltradas}
        idKey="id_audit_asistencia"
      />
    </div>
  );
}