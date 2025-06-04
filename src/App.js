import "./App.css";
import logo from "./logo.svg";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

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

function App() {
	const [autenticado, setAutenticado] = useState(false);

	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<h1 className="App-title">KunanEdu</h1>
			</header>
			<main className="App-main">
				{autenticado ? (
					<Router>
						<Routes>
							<Route path="/" element={<MenuPrincipal />} />
							<Route path="/aulas" element={<ListadoAula />} />
							<Route path="/alumnos" element={<ListadoAlumno />} />
							<Route path="/cursos" element={<ListadoCurso />} />
							<Route path="/empleados" element={<ListadoEmpleado />} />
							<Route path="/grados" element={<ListadoGrado />} />
							<Route path="/usuarios" element={<ListadoUsuario />} />
							<Route path="/periodos" element={<ListadoPeriodo />} />

							<Route path="/auditoria/aulas" element={<AuditoriaAula />} />
							

						</Routes>
					</Router>
				) : (
					<LoginUser onLoginCorrecto={() => setAutenticado(true)} />
				)}
			</main>
		</div>
	);
}
/*
<Route path="/auditoria/alumnos" element={<AuditoriaAlumno />} />
							<Route path="/auditoria/cursos" element={<AuditoriaCurso />} />
							<Route path="/auditoria/empleados" element={<AuditoriaEmpleado />} />
							<Route path="/auditoria/grados" element={<AuditoriaGrado />} />
							<Route path="/auditoria/usuarios" element={<AuditoriaUsuario />} />
							<Route path="/auditoria/periodos" element={<AuditoriaPeriodo />} /> 
							*/
export default App;
