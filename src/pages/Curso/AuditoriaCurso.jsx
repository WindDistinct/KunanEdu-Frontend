import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cursoService } from "../../api/requestApi";
import Tabla from "../../components/TablaAuditoria";
import "../../styles/Botones.css";
import FiltroTabla from "../../components/FiltroTabla"; 

export default function AuditoriaCurso() {
  const [auditorias, setAuditorias] = useState([]);
  const navigate = useNavigate();
  const [auditoriasFiltradas, setAuditoriasFiltradas] = useState([]);
  const [textoFiltro, setTextoFiltro] = useState("");                

  const cargarAuditorias = async () => {
    const data = await cursoService.auditar();
    setAuditorias(data);
    setAuditoriasFiltradas(data); 
  };

  useEffect(() => {
    cargarAuditorias();
  }, []);

  return (
    <div className="container mt-4">
    <h1 className="text-4xl font-semibold mb-4">Auditoría de Curso</h1>
      <button onClick={() => {setTextoFiltro(""); navigate("/");}} className="btn btn-secondary mb-3">
        Volver al Menú
      </button>
      <br />
      <FiltroTabla
                datos={auditorias}
                clavesFiltro={[
                  "nombre_curso_anterior",
                  "nombre_curso_nuevo",
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
          { key: "id_audit_curso", label: "ID Auditoría" },
          { key: "id_curso", label: "ID Aula" },
          { key: "nombre_curso_anterior", label: "Curso Anterior" },
          { key: "nombre_curso_nuevo", label: "Curso Nuevo" },
            { key: "observacion", label: "Observacion" },
          { key: "operacion", label: "Operación" },
          { key: "fecha_modificacion", label: "Fecha Modificación" },
          { key: "usuario_modificador", label: "Usuario Modificador" },
        ]}
        datos={auditoriasFiltradas}
        idKey="id_audit_curso"
      />
    </div>
  );
}
