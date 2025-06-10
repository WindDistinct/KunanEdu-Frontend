import React from "react";
import { Link } from "react-router-dom";

export default function MenuPrincipal() {
  const rol = localStorage.getItem("rol");
  const puedeVerAuditoria = rol === "auditor";
  const puedeVerMantenimientos = ["usuario", "administrador", "profesor"].includes(rol);

  const menuItems = [
    { path: "/aulas", nombre: "Aulas" },
    { path: "/alumnos", nombre: "Alumnos" },
    { path: "/empleados", nombre: "Empleados" },
    { path: "/grados", nombre: "Grados" },
    { path: "/usuarios", nombre: "Usuarios" },
    { path: "/periodos", nombre: "Periodos" },
    { path: "/cursos", nombre: "Cursos" },
    { path: "/seccion", nombre: "Sección" },
    { path: "/curso_grado", nombre: "CursoGrado" },

  ];

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      {puedeVerMantenimientos && (
        <section>
         <h1 className="text-4xl font-semibold mb-4">  Entidades</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {menuItems.map(({ path, nombre }) => (
              <Link
                key={path}
                to={path}
                className="btn btn-secondary btn-outline w-full"
              >
                {rol === "administrador" ? `Gestionar ${nombre}` : `Listar ${nombre}`}
              </Link>
            ))}
          </div>
        </section>
      )}

      {puedeVerAuditoria && (
        <section>
           <h1 className="text-4xl font-semibold mb-4">Registros de Auditoría</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {menuItems.map(({ path, nombre }) => (
              <Link
                key={path}
                to={`/auditoria${path}`}
                className="btn btn-secondary btn-outline w-full"
              >
                Auditoría {nombre}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <h1 className="text-2xl font-semibold mb-4">Servicios Extras</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Link to="/notas" className="btn btn-accent w-full">
            Notas
          </Link>
        </div>
      </section>
    </div>
  );
}
