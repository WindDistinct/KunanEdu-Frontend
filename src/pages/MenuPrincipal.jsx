import React from "react";
import { Link } from "react-router-dom";
import "./../styles/Botones.css";

export default function MenuPrincipal() {
	return (
		<div className="p-8 max-w-xl mx-auto">
			<h1 className="text-2xl font-bold mb-6">Menú Principal</h1>
			<div className="grid grid-cols-1 gap-4">
				<Link to="/aulas" className="menu-button space-link">
					Gestionar Aulas
				</Link>
				<Link to="/alumnos" className="menu-button space-link">
					Gestionar Alumnos
				</Link>
				<Link to="/cargos" className="menu-button space-link">
					Gestionar Cargos
				</Link>
				<Link to="/cursos" className="menu-button space-link">
					Gestionar Cursos
				</Link>
				<Link to="/empleados" className="menu-button space-link">
					Gestionar Empleados
				</Link>
				<Link to="/grados" className="menu-button space-link">
					Gestionar Grados
				</Link>
				<Link to="/usuarios" className="menu-button space-link">
					Gestionar Usuarios
				</Link>
			</div>
		</div>
	);
}
