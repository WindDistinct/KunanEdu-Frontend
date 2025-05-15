import React from "react";
import { Link } from "react-router-dom";
import '../styles/Botones.css';

export default function MenuPrincipal() {
	return (
		<div>
			<h1>Menú Principal</h1>
			<div>
				<Link
					to="/aulas"
					className="registrar-button space-link"
				>
					Gestionar Aulas
				</Link>
				<br></br><br></br><br></br>
				<Link
					to="/aulas"
					className="registrar-button space-link"
				>
					Gestionar Aulas
				</Link>
				{/* Agregar aquí más enlaces a otras entidades */}
			</div>
		</div>
	);
}
