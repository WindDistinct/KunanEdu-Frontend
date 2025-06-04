import React from "react";
import { Link } from "react-router-dom";
import "./../styles/Botones.css";

export default function MenuPrincipal() {
	return (
<div className="p-8 max-w-xl mx-auto">
	<h1 className="text-2xl font-bold mb-6">Mantenimiento de Entidades</h1>
	<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
		<div className="menu-grid">
			<Link to="/aulas" className="menu-button space-link">Gestionar Aulas</Link>
			<Link to="/alumnos" className="menu-button space-link">Gestionar Alumnos</Link>
			<Link to="/cursos" className="menu-button space-link">Gestionar Cursos</Link>
			<Link to="/empleados" className="menu-button space-link">Gestionar Empleados</Link>
			<Link to="/grados" className="menu-button space-link">Gestionar Grados</Link>
			<Link to="/usuarios" className="menu-button space-link">Gestionar Usuarios</Link>
			<Link to="/periodos" className="menu-button space-link">Gestionar Periodos</Link>
		</div>
	</div>
	<h1 className="text-2xl font-bold mb-6">Registros de Auditoria</h1>
	<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
		<div className="menu-grid">
			<Link to="/auditoria/aulas" className="menu-button2 space-link">Auditoria Aulas</Link>
			<Link to="/auditoria/alumnos" className="menu-button2 space-link">Auditoria Alumnos</Link>
			<Link to="/auditoria/cursos" className="menu-button2 space-link">Auditoria Cursos</Link>
			<Link to="/auditoria/empleados" className="menu-button2 space-link">Auditoria Empleados</Link>
			<Link to="/auditoria/grados" className="menu-button2 space-link">Auditoria Grados</Link>
			<Link to="/auditoria/usuarios" className="menu-button2 space-link">Auditoria Usuarios</Link>
			<Link to="/auditoria/periodos" className="menu-button2 space-link">Auditoria Periodos</Link>
		</div>
	</div>
</div>

		
	);
}
