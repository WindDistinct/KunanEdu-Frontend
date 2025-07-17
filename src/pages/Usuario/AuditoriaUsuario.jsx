import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usuarioService } from "../../api/requestApi"
import Tabla from "../../components/TablaAuditoria";
import "../../styles/Botones.css";
import FiltroTabla from "../../components/FiltroTabla";

export default function AuditoriaUsuario() {
  const [auditorias, setAuditorias] = useState([]);
  const navigate = useNavigate();
  const [auditoriasFiltradas, setAuditoriasFiltradas] = useState([]);
  const [textoFiltro, setTextoFiltro] = useState("");                

  const cargarAuditorias = async () => {
    const data = await usuarioService.auditar();
    setAuditorias(data);
    setAuditoriasFiltradas(data);
  };

  useEffect(() => {
    cargarAuditorias();
  }, []);

  return (
   <div className="container mt-4">
    <h1 className="text-4xl font-semibold mb-4">Auditoría de Usuarios</h1>
      <button onClick={() => {setTextoFiltro(""); navigate("/");}} className="btn btn-secondary mb-3">
        Volver al Menú
      </button>
      <br />
      <FiltroTabla
                datos={auditorias}
                clavesFiltro={[
                  "username_anterior",
                  "username_nuevo",
                  "rol_anterior",
                  "rol_nuevo",
                  "empleado_anterior",
                  "empleado_nuevo",
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
          { key: "id_audit_usuario", label: "ID Auditoría" },
          { key: "id_usuario", label: "ID Usuario" },
          { key: "username_anterior", label: "Username Anterior" },
          { key: "username_nuevo", label: "Username Nuevo" }, 
          { key: "rol_anterior", label: "Rol Anterior" },
          { key: "rol_nuevo", label: "Rol Nuevo" },
           { key: "empleado_anterior", label: "Empleado Anterior" },
          { key: "empleado_nuevo", label: "Empleado Nuevo" },  
           { key: "observacion", label: "Observacion" },
          { key: "operacion", label: "Operación" },
          { key: "fecha_modificacion", label: "Fecha Modificación" },
          { key: "usuario_modificador", label: "Usuario Modificador" }
        ]}
        datos={auditoriasFiltradas}
        idKey="id_audit_usuario"
      />
    </div>
  );
}
