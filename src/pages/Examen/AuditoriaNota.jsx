import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { examenService } from "../../api/requestApi";
import Tabla from "../../components/TablaAuditoria";
import "../../styles/Botones.css";
import FiltroTabla from "../../components/FiltroTabla";

export default function AuditoriaNota() {
  const [auditorias, setAuditorias] = useState([]);
  const navigate = useNavigate();
  const [auditoriasFiltradas, setAuditoriasFiltradas] = useState([]);
  const [textoFiltro, setTextoFiltro] = useState("");                

  const cargarAuditorias = async () => {
    const data = await examenService.auditar();
    setAuditorias(data);
    setAuditoriasFiltradas(data);
  };

  useEffect(() => {
    cargarAuditorias();
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="text-4xl font-semibold mb-4">Auditoría de Notas</h1>

      <button onClick={() => {setTextoFiltro(""); navigate("/");}} className="btn btn-secondary mb-3">
        Volver al Menú
      </button>
      <br />

      <FiltroTabla
                datos={auditorias}
                clavesFiltro={[
                  "bimestre_anterior",
                  "bimestre_nuevo",
                  "nota_anterior",
                  "nota_nuevo",
                  "usuario_modificador",
                 ]}
                onFiltrar={setAuditoriasFiltradas}
                placeholder="Buscar bimestre o nota..."
                texto={textoFiltro}
                setTexto={setTextoFiltro}
            />

      <Tabla
        columnas={[
          { key: "id_audit_examen", label: "ID Auditoría" },
          { key: "id_examen", label: "ID Examen" },
          { key: "bimestre_anterior", label: "Bimestre Anterior" },
          { key: "bimestre_nuevo", label: "Bimestre Nuevo" },
          { key: "nota_anterior", label: "Nota Anterior" },
          { key: "nota_nuevo", label: "Nota Nueva" },
          { key: "estado_anterior", label: "Estado Anterior" },
          { key: "estado_nuevo", label: "Estado Nuevo" },
          { key: "matricula_anterior", label: "Matrícula Anterior" },
          { key: "matricula_nuevo", label: "Matrícula Nueva" },
          { key: "curso_seccion_anterior", label: "Curso-Sección Anterior" },
          { key: "curso_seccion_nuevo", label: "Curso-Sección Nuevo" },
          { key: "operacion", label: "Operación" },
          { key: "fecha_modificacion", label: "Fecha Modificación" },
          { key: "usuario_modificador", label: "Usuario Modificador" },
        ]}
        datos={auditoriasFiltradas}
        idKey="id_audit_examen"
      />
    </div>
  );
}