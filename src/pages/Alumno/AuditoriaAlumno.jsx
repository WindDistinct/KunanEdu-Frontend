import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { alumnoService } from "../../api/requestApi";
import Tabla from "../../components/TablaAuditoria";
import FiltroTabla from "../../components/FiltroTabla";     ///////////////////////////////////////

export default function AuditoriaAlumno() {
  const [auditorias, setAuditorias] = useState([]);
  const navigate = useNavigate();
  const [auditoriasFiltradas, setAuditoriasFiltradas] = useState([]);   ///////////////////////////////////////
  const [textoFiltro, setTextoFiltro] = useState("");                   ///////////////////////////////////////

  const cargarAuditorias = async () => {
    const data = await alumnoService.auditar();
    setAuditorias(data);
    setAuditoriasFiltradas(data);     ///////////////////////////////////////
  };

  useEffect(() => {
    cargarAuditorias();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6 text-primary">Auditoría de Alumnos</h1>

      <button
        type="button"
        onClick={() => {setTextoFiltro(""); navigate("/");}}    ///////////////////////////////////////
        className="btn btn-secondary mb-6"
      >
        Volver al Menú
      </button> 

      {/*/////////////////////////////////////*/}
      <FiltroTabla
          datos={auditorias}
          clavesFiltro={[
            "nombre_anterior",
            "nombre_nuevo",
            "apellido_paterno_anterior",
            "apellido_paterno_nuevo",
            "apellido_materno_anterior",
            "apellido_materno_nuevo",
            "numero_documento_anterior",
            "numero_documento_nuevo",
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
            { key: "id_audit_alumno", label: "ID Auditoría" },
            { key: "id_alumno", label: "ID Alumno" },
            { key: "nombre_anterior", label: "Nombre Anterior" },
            { key: "nombre_nuevo", label: "Nombre Nuevo" },
            { key: "apellido_paterno_anterior", label: "Apellido Paterno Anterior" },
            { key: "apellido_paterno_nuevo", label: "Apellido Paterno Nuevo" },
            
            { key: "apellido_materno_anterior", label: "Apellido Materno Anterior" },
            { key: "apellido_materno_nuevo", label: "Apellido Materno Nuevo" },
            
            { key: "numero_documento_anterior", label: "Numero documento Anterior" },
            { key: "numero_documento_nuevo", label: "Numero documento Nuevo" },
            { key: "direccion_anterior", label: "Dirección Anterior" },
            { key: "direccion_nuevo", label: "Dirección Nueva" },
            { key: "telefono_anterior", label: "Teléfono Anterior" },
            { key: "telefono_nuevo", label: "Teléfono Nuevo" }, 
             { key: "observacion", label: "Observacion" },
            { key: "operacion", label: "Operación" },
            { key: "fecha_modificacion", label: "Fecha Modificación" },
            { key: "usuario_modificador", label: "Usuario Modificador" }
          ]}
          datos={auditoriasFiltradas}       /////////////////////////
          idKey="id_audit_alumno"
        /> 
    </div>
  );
}