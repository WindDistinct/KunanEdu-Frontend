import React from "react";
import '../styles/Tablas.css';

export default function Tabla({ columnas, datos, onEditar, onEliminar }) {
	return (
		<table className="tabla">
			<thead>
				<tr>
				{columnas.map((col) => (
					<th key={col} className="encabezado-columna">
					{col}
					</th>
				))}
				<th className="encabezado-columna">Acciones</th>
				</tr>
			</thead>
			<tbody>
				{datos.map((item) => (
				<tr key={item.id_aula}>
					<td className="celda">{item.numero_aula}</td>
					<td className="celda">{item.grado}</td>
					<td className="celda">{item.aforo}</td>
					<td className="celda">{item.ubicacion}</td>
					<td className="celda">{item.estado ? "Activo" : "Inactivo"}</td>
					<td className="celda acciones">
					<button onClick={() => onEditar(item)} className="btn-editar">
						Editar
					</button>
					<button onClick={() => onEliminar(item.id_aula)} className="btn-eliminar">
						Eliminar
					</button>
					</td>
				</tr>
				))}
			</tbody>
		</table>
	);
}
