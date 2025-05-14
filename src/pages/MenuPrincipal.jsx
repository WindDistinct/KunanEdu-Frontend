import React from "react";
import { Link } from "react-router-dom";

export default function MenuPrincipal() {
	return (
		<div className="p-8 max-w-xl mx-auto">
			<h1 className="text-2xl font-bold mb-6">Menú Principal</h1>
			<div className="grid grid-cols-1 gap-4">
				<Link
					to="/aulas"
					className="bg-blue-500 text-white px-4 py-2 rounded text-center"
				>
					Gestionar Aulas
				</Link>
				{/* Agregar aquí más enlaces a otras entidades */}
			</div>
		</div>
	);
}
