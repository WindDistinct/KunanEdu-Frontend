import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { matriculaService } from "../../api/requestApi";
import Tabla from "../../components/TablaAuditoria";
import FiltroTabla from "../../components/FiltroTabla";

export default function AuditoriaMatricula() {
  const [auditorias, setAuditorias] = useState([]);
  const navigate = useNavigate();
  const [auditoriasFiltradas, setAuditoriasFiltradas] = useState([]);
  const [textoFiltro, setTextoFiltro] = useState("");                

  const cargarAuditorias = async () => {
    const data = await matriculaService.auditar();   
    setAuditorias(data);
    setAuditoriasFiltradas(data);
  };

  useEffect(() => {
    cargarAuditorias();
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="text-4xl font-semibold mb-4">Auditoría de Matrículas</h1>
      <button onClick={() => {setTextoFiltro(""); navigate("/");}} className="btn btn-secondary mb-3">
        Volver al Menú
      </button>
      <br />
      <br />
      <FiltroTabla
                datos={auditorias}
                clavesFiltro={[
                  "alumno_anterior",
                  "alumno_nuevo",
                  "condicion_anterior",
                  "condicion_nuevo",
                  "seccion_anterior",
                  "seccion_nuevo",
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
          { key: "id_audit_matricula", label: "ID Auditoría" },
          { key: "id_matricula", label: "ID Matrícula" },
           
          { key: "alumno_anterior", label: "Alumno Anterior (ID)" },
          { key: "alumno_nuevo", label: "Alumno Nuevo (ID)" },
          { key: "condicion_anterior", label: "Condición Anterior" },
          { key: "condicion_nuevo", label: "Condición Nuevo" }, 
          { key: "seccion_anterior", label: "Sección Anterior (ID)" },
          { key: "seccion_nuevo", label: "Sección Nuevo (ID)" },
             { key: "observacion", label: "Observacion" },
          { key: "operacion", label: "Operación" },
          { key: "fecha_modificacion", label: "Fecha Modificación" },
          { key: "usuario_modificador", label: "Usuario Modificador" },
        ]}
        datos={auditoriasFiltradas} 
        idKey="id_audit_matricula"
      />
    </div>
  );
}