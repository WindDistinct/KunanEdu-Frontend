import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { empleadoService } from "../../api/requestApi";
import Tabla from "../../components/TablaAuditoria";
import "../../styles/Botones.css";
import FiltroTabla from "../../components/FiltroTabla";

export default function AuditoriaEmpleado() {
  const [auditorias, setAuditorias] = useState([]);
  const navigate = useNavigate();
  const [auditoriasFiltradas, setAuditoriasFiltradas] = useState([]);
  const [textoFiltro, setTextoFiltro] = useState("");                

  const cargarAuditorias = async () => {
    const data = await empleadoService.auditar();
    setAuditorias(data);
    setAuditoriasFiltradas(data);
  };

  useEffect(() => {
    cargarAuditorias();
  }, []);

  return (
      <div className="p-4">
      <h1 className="text-3xl font-bold mb-6 text-primary">Auditoría de Empleados</h1>
      <button onClick={() => {setTextoFiltro(""); navigate("/");}} className="btn btn-secondary mb-3">
        Volver al Menú
      </button>
      <br />
      <FiltroTabla
                datos={auditorias}
                clavesFiltro={[
                  "nombre_emp_anterior",
                  "nombre_emp_nuevo",
                  "ape_pat_emp_anterior",
                  "ape_pat_emp_nuevo",
                  "ape_mat_emp_anterior",
                  "ape_mat_emp_nuevo",
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
          { key: "id_audit_emp", label: "ID Auditoría" },
          { key: "id_emp", label: "ID Empleado" },
          { key: "nombre_emp_anterior", label: "Nombre Anterior" },
          { key: "nombre_emp_nuevo", label: "Nombre Nuevo" },
          { key: "ape_pat_emp_anterior", label: "Apellido Paterno Anterior" },
          { key: "ape_pat_emp_nuevo", label: "Apellido Paterno Nuevo" },
          { key: "ape_mat_emp_anterior", label: "Apellido Materno Anterior" },
          { key: "ape_mat_emp_nuevo", label: "Apellido Materno Nuevo" },
          { key: "fec_nac_anterior", label: "Fecha Nacimiento Anterior" },
          { key: "fec_nac_nuevo", label: "Fecha Nacimiento Nueva" },
          { key: "especialidad_anterior", label: "Especialidad Anterior" },
          { key: "especialidad_nuevo", label: "Especialidad Nueva" },
             { key: "numero_documento_anterior", label: "Numero documento Anterior" },
            { key: "numero_documento_nuevo", label: "Numero documento Nuevo" },
          { key: "telefono_anterior", label: "Teléfono Anterior" },
          { key: "telefono_nuevo", label: "Teléfono Nuevo" },
            { key: "observacion", label: "Observacion" },
          { key: "cargo_anterior", label: "Cargo Anterior" },
          { key: "cargo_nuevo", label: "Cargo Nuevo" }, 
          /*{ key: "estado_anterior", label: "Estado Anterior" },
          { key: "estado_nuevo", label: "Estado Nuevo" },*/
          { key: "operacion", label: "Operación" },
          { key: "fecha_modificacion", label: "Fecha Modificación" },
          { key: "usuario_modificador", label: "Usuario Modificador" }
        ]}
        datos={auditoriasFiltradas} 
        idKey="id_audit_emp"
      />
    </div>
  );
}
