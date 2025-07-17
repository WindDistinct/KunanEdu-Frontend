import "./App.css";
import logo from "/logo.svg";
import { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import LoginUser from "./components/LoginUser";
import MenuPrincipal from "./pages/MenuPrincipal";

import ListadoAula from "./pages/Aula/ListadoAula";
import ListadoAlumno from "./pages/Alumno/ListadoAlumno";
import ListadoCurso from "./pages/Curso/ListadoCurso";
import ListadoEmpleado from "./pages/Empleado/ListadoEmpleado";
import ListadoGrado from "./pages/Grado/ListadoGrado";
import ListadoUsuario from "./pages/Usuario/ListadoUsuario";
import ListadoPeriodo from "./pages/Periodo/ListadoPeriodo";

import AuditoriaAula from './pages/Aula/AuditoriaAula';
import AuditoriaAlumno from "./pages/Alumno/AuditoriaAlumno";
import AuditoriaEmpleado from "./pages/Empleado/AuditoriaEmpleado";
import AuditoriaGrado from "./pages/Grado/AuditoriaGrado";
import AuditoriaPeriodo from "./pages/Periodo/AuditoriaPeriodo";
import AuditoriaUsuario from "./pages/Usuario/AuditoriaUsuario";
import ListadoNotas from "./pages/Examen/ListadoNotas";
import AuditoriaCurso from "./pages/Curso/AuditoriaCurso";
import ListadoSeccion from "./pages/Seccion/ListadoSeccion";
import AuditoriaSeccion from "./pages/Seccion/AuditoriaSeccion";
import ListadoCursoGrado from "./pages/Curso_Grado/ListadoCursoGrado";
import AuditoriaCursoGrado from "./pages/Curso_Grado/AuditoriaCursoGrado";
import ListadoMatricula from "./pages/Matricula/ListadoMatricula";
import AuditoriaMatricula from "./pages/Matricula/AuditoriaMatricula";
import ListadoCursoSeccion from "./pages/Curso_Seccion/ListadoCursoSeccion";
import AuditoriaCursoSeccion from "./pages/Curso_Seccion/AuditoriaCursoSeccion";
import AuditoriaNota from "./pages/Examen/AuditoriaNota";
import ListadoNotasPorCurso from "./pages/Examen/ListadoNotaCurso";
import ListadoCursosAsistencia from "./pages/Asistencia/ListadoCursosAsistencia";
import ReporteAsistenciaAlumno from "./pages/Asistencia/ListadoAsistencia";
import AuditoriaAsistencia from "./pages/Asistencia/AuditoriaAsistencia";
import ListadoAsistenciaAlumno from "./pages/Asistencia/ListadoAsistencia";
import ReporteAsistencia from "./pages/Asistencia/ReporteAsistencia";
import HistorialAcademico from "./pages/Alumno/HistorialAcademico";


function App() {
  const [autenticado, setAutenticado] = useState(false);
  const navigate = useNavigate();
  const handleLogout = () => {
      localStorage.clear();
      setAutenticado(false);
      navigate("/login");
    };
   

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 left-0 w-full z-50 bg-white shadow-md flex items-center justify-between px-6 h-16">
        <div className="flex items-center gap-4">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">KunanEdu</h1>
        </div>
        {autenticado && (
    <button onClick={handleLogout} className="btn btn-error text-white">
      Cerrar Sesión
    </button>
  )}
      </header>
      <main className="px-4 py-6 text-center">
        <div className={`${autenticado ? 'h-[calc(100vh-60px)]' : ''}`}>

        {autenticado ? (
            <Routes>
              <Route path="/login" element={<LoginUser />} />
              <Route path="/" element={<MenuPrincipal  />} />
              <Route path="/aulas" element={<ListadoAula />} />
              <Route path="/alumnos" element={<ListadoAlumno />} />
              <Route path="/cursos" element={<ListadoCurso />} />
              <Route path="/empleados" element={<ListadoEmpleado />} />
              <Route path="/grados" element={<ListadoGrado />} />
              <Route path="/usuarios" element={<ListadoUsuario />} />
              <Route path="/periodos" element={<ListadoPeriodo />} />
              <Route path="/notas" element={<ListadoNotas />} />
              <Route path="/seccion" element={<ListadoSeccion />} />
              <Route path="/curso_grado" element={<ListadoCursoGrado />} />
              <Route path="/matricula" element={<ListadoMatricula />} />
              <Route path="/curso_seccion" element={<ListadoCursoSeccion />} />
              <Route path="/nota_curso" element={<ListadoNotasPorCurso/>} />
              <Route path="/asistencias" element={<ListadoCursosAsistencia />} />
              <Route path="/asistencia_alumno" element={<ListadoAsistenciaAlumno />} />
              <Route path="/asistencia_reporte" element={<ReporteAsistencia />} />
              <Route path="/historial/:id" element={<HistorialAcademico />} />

              <Route path="/auditoria/aulas" element={<AuditoriaAula />} />
              <Route path="/auditoria/alumnos" element={<AuditoriaAlumno />} />
              <Route path="/auditoria/empleados" element={<AuditoriaEmpleado />} />
              <Route path="/auditoria/grados" element={<AuditoriaGrado />} />
              <Route path="/auditoria/periodos" element={<AuditoriaPeriodo />} />
              <Route path="/auditoria/usuarios" element={<AuditoriaUsuario />} />
              <Route path="/auditoria/cursos" element={<AuditoriaCurso />} />
              <Route path="/auditoria/seccion" element={<AuditoriaSeccion />} />
              <Route path="/auditoria/curso_grado" element={<AuditoriaCursoGrado />} />
              <Route path="/auditoria/matricula" element={<AuditoriaMatricula />} />
              <Route path="/auditoria/curso_seccion" element={<AuditoriaCursoSeccion />} />
              <Route path="/auditoria/notas" element={<AuditoriaNota />} />
              <Route path="/auditoria/asistencias" element={<AuditoriaAsistencia />} />


            </Routes>
        ) : (
          <Routes>
            <Route path="/login" element={<LoginUser onLoginCorrecto={() => setAutenticado(true)} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        )}
        </div>
      </main>
    </div>
  );
}

export default App
