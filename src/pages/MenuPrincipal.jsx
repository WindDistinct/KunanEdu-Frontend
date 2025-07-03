import React from "react";
import { Link } from "react-router-dom";


export default function MenuPrincipal() {
  
  const rol = localStorage.getItem("rol");

  const puedeVerAuditoria = rol === "auditor";
  const puedeVerMantenimientos = ["usuario", "administrador", "profesor"].includes(rol);
  const puedeVerNotas = ["tutor", "profesor"].includes(rol);

  const menuItemsEstaticos = [
    { path: "/empleados", nombre: "Empleados" },
    { path: "/aulas", nombre: "Aulas" },
    { path: "/grados", nombre: "Grados" },
    { path: "/cursos", nombre: "Cursos" },
    { path: "/periodos", nombre: "Periodos" },
    { path: "/alumnos", nombre: "Alumnos" },
  ];

  const menuItems = [
    { path: "/usuarios", nombre: "Usuarios" },
    { path: "/curso_grado", nombre: "CursoGrado" },
    { path: "/curso_seccion", nombre: "CursoSeccion" },
    { path: "/seccion", nombre: "Sección" },
    { path: "/matricula", nombre: "Matrícula" },
  ];

  const menuNotas = [
    { path: "/notas", nombre: "Mis cursos" },
    { path: "/nota_curso", nombre: "Mantenimiento Notas" },
  ];
  const menuAsistencia= [
    { path: "/asistencias", nombre: "Mis Alumnos" },
    { path: "/asistencia_alumno", nombre: "Mantenimiento Asistencia" },
  ];


  const menuAuditoria = [
    ...menuItemsEstaticos.map(({ path, nombre }) => ({
      path: `/auditoria${path}`,
      nombre: `Auditoría ${nombre}`,
    })),
    ...menuItems.map(({ path, nombre }) => ({
      path: `/auditoria${path}`,
      nombre: `Auditoría ${nombre}`,
    })),
    { path: "/auditoria/notas", nombre: "Auditoría Notas" },
  ];

  const tituloSeccion =
    puedeVerAuditoria ? "Auditorías" : puedeVerMantenimientos ? "Mantenimientos" : "Servicios";

  return (
    <div className="min-h-screen flex flex-col">
      
      <div className="navbar bg-base-100 shadow-md px-6">
        <div className="flex-1 text-lg font-semibold  text-center">
          Bienvenido, estás accediendo como <span className="font-bold uppercase">{rol}</span>.
        </div>
      </div>

      
      <main className="flex-1 px-6 py-8 bg-gray-50 space-y-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-white p-6 rounded-lg shadow">
          <img
            src="https://images.pexels.com/photos/3401403/pexels-photo-3401403.jpeg?_gl=1*vf4771*_ga*MzI0NzgzMzQwLjE3NTAzMDEzNjg.*_ga_8JE65Q40S6*czE3NTAzMDEzNjckbzEkZzEkdDE3NTAzMDEzOTkkajI4JGwwJGgw"
            alt="Presentación"
            className="rounded shadow"
          />
          <div>
            <h2 className="text-2xl font-bold mb-4">Notas de la Versión</h2>
            <p className="text-gray-700  text-left">
              ☑️ Accede a las funciones habilitadas según tu rol.
              <br />
              ☑️ Gestiona datos, controla notas o revisa registros
              de auditoría.
              <br />
              ☑️ Interfaz centralizada y fácil de usar.
              <br />
              ☑️ ...
            </p>
            <p className="mt-2 text-sm text-gray-500">Versión 0.4</p>
          </div>
        </div>

        
        <div className="max-w-5xl mx-auto">
          <hr className="border-2 border-gray-300 my-4" />
          <h2 className="text-3xl font-semibold mb-6">{tituloSeccion}</h2>
        </div>

        
        <div className="max-w-5xl mx-auto space-y-6">
          
          {puedeVerMantenimientos && (
            <>
              <details className="collapse collapse-arrow bg-base-100 shadow">
                <summary className="collapse-title text-xl font-medium">Entidades Simples</summary>
                <div className="collapse-content grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {menuItemsEstaticos.map(({ path, nombre }) => (
                    <Link key={path} to={path} className="btn btn-outline w-full">
                      {rol === "administrador" ? `Gestionar ${nombre}` : `Listar ${nombre}`}
                    </Link>
                  ))}
                </div>
              </details>

              <details className="collapse collapse-arrow bg-base-100 shadow">
                <summary className="collapse-title text-xl font-medium">Entidades Compuestas</summary>
                <div className="collapse-content grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {menuItems.map(({ path, nombre }) => (
                    <Link key={path} to={path} className="btn btn-outline w-full">
                      {rol === "administrador" ? `Gestionar ${nombre}` : `Listar ${nombre}`}
                    </Link>
                  ))}
                </div>
              </details>
            </>
          )}

          
          {puedeVerNotas && (
            <details className="collapse collapse-arrow bg-base-100 shadow">
              <summary className="collapse-title text-xl font-medium">Gestión de Notas</summary>
              <div className="collapse-content grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {menuNotas.map(({ path, nombre }) => (
                  <Link key={path} to={path} className="btn btn-accent w-full">
                    {nombre}
                  </Link>
                ))}
              </div>
            </details>
          )}
          {puedeVerNotas && (
            <details className="collapse collapse-arrow bg-base-100 shadow">
              <summary className="collapse-title text-xl font-medium">Gestión Asistencia</summary>
              <div className="collapse-content grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {menuAsistencia.map(({ path, nombre }) => (
                  <Link key={path} to={path} className="btn btn-accent w-full">
                    {nombre}
                  </Link>
                ))}
              </div>
            </details>
          )}
          
          {puedeVerAuditoria && (
            <details className="collapse collapse-arrow bg-base-100 shadow">
              <summary className="collapse-title text-xl font-medium">Módulos de Auditoría</summary>
              <div className="collapse-content grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {menuAuditoria.map(({ path, nombre }) => (
                  <Link key={path} to={path} className="btn btn-outline w-full">
                    {nombre}
                  </Link>
                ))}
              </div>
            </details>
          )}
        </div>
      </main>

      
      <footer className="bg-base-300 p-4 text-center text-sm text-gray-700">
        &copy; {new Date().getFullYear()} Kunan Edu | Todos los derechos reservados.
      </footer>
    </div>
  );
}
