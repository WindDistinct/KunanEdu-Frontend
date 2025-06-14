import React from "react";
import { Link } from "react-router-dom";

export default function MenuPrincipal() {
  const rol = localStorage.getItem("rol");
  const puedeVerAuditoria = rol === "auditor";
  const puedeVerMantenimientos = ["usuario", "administrador", "profesor"].includes(rol);
  const puedeVerNotas = [ "tutor", "profesor"].includes(rol);

  const menuItemsEstaticos=[
     { path: "/empleados", nombre: "Empleados" },  
    { path: "/aulas", nombre: "Aulas" },
    { path: "/grados", nombre: "Grados" },
    { path: "/cursos", nombre: "Cursos" },  
    { path: "/periodos", nombre: "Periodos" },
     { path: "/alumnos", nombre: "Alumnos" },
  ]
  const menuItems = [ 
     { path: "/usuarios", nombre: "Usuarios" }, 
    { path: "/curso_grado", nombre: "CursoGrado" },
    { path: "/seccion", nombre: "Sección" },
    { path: "/matricula", nombre: "Matricula" },
    { path: "/curso_seccion", nombre: "CursoSeccion" },

  ];

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
       {puedeVerMantenimientos && (
        <section>
         <h1 className="text-4xl font-semibold mb-4">  Entidades Simples</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {menuItemsEstaticos.map(({ path, nombre }) => (
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
      {puedeVerMantenimientos && (
        <section>
         <h1 className="text-4xl font-semibold mb-4">  Entidades Compuestas</h1>
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
             {menuItemsEstaticos.map(({ path, nombre }) => (
              <Link
                key={path}
                to={`/auditoria${path}`}
                className="btn btn-secondary btn-outline w-full"
              >
                Auditoría {nombre}
              </Link>
            ))}

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

      {puedeVerNotas && (
       <section>
        <h1 className="text-2xl font-semibold mb-4">Servicios Extras</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Link to="/notas" className="btn btn-accent w-full">
            Mis cursos
          </Link>
        </div>
      </section>
      )}


     
    </div>
  );
}
