import React from "react";

export default function Tabla({ columnas, datos, onEditar, onEliminar }) {
	return (
		<table className="min-w-full border text-sm">
			<thead>
				<tr>
					{columnas.map((col) => (
						<th key={col} className="border px-2 py-1 text-left bg-gray-200">
							{col}
						</th>
					))}
					<th className="border px-2 py-1 bg-gray-200">Acciones</th>
				</tr>
			</thead>
			<tbody>
				{datos.map((item) => (
					<tr key={item.id_aula}>
						<td className="border px-2 py-1">{item.numero_aula}</td>
						<td className="border px-2 py-1">{item.grado}</td>
						<td className="border px-2 py-1">{item.aforo}</td>
						<td className="border px-2 py-1">{item.ubicacion}</td>
						<td className="border px-2 py-1">
							{item.estado ? "Activo" : "Inactivo"}
						</td>
						<td className="border px-2 py-1 flex gap-2">
							<button
								onClick={() => onEditar(item)}
								className="text-blue-500 hover:underline"
							>
								Editar
							</button>
							<button
								onClick={() => onEliminar(item.id_aula)}
								className="text-red-500 hover:underline"
							>
								Eliminar
							</button>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}
