import React, { useEffect, useState } from "react";
import { crearGrado, actualizarGrado } from "../../api/gradoService";
import "../../styles/Botones.css";
import "../../styles/inputs.css";
import "../../styles/Notificacion.css";

export default function FormularioGrado({ onExito, initialData }) {
	const [form, setForm] = useState({ nombre_grado: "", descripcion_grado: "" });
	const [error, setError] = useState(null);

	useEffect(() => {
		if (initialData) setForm(initialData);
	}, [initialData]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);

		if (!form.nombre_grado || !form.descripcion_grado) {
			setError("Todos los campos son obligatorios");
			return;
		}

		try {
			if (form.id_grado) {
				await actualizarGrado(form.id_grado, { ...form, estado: 1 });
				onExito("Grado actualizado con éxito");
			} else {
				await crearGrado(form);
				onExito("Grado registrado con éxito");
			}
			setForm({ nombre_grado: "", descripcion_grado: "" });
		} catch (err) {
			setError(
				"Error al guardar. Verifique que el nombre del grado no esté duplicado",
			);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="form">
			{error && <div className="error grid2">{error}</div>}
			<input
				name="nombre_grado"
				placeholder="Nombre del Grado"
				className="input-form"
				value={form.nombre_grado}
				onChange={handleChange}
			/>
			<input
				name="descripcion_grado"
				placeholder="Descripción"
				className="input-form"
				value={form.descripcion_grado}
				onChange={handleChange}
			/>
			<div className="grid2">
				<button type="submit" className="aceptar-button">
					{form.id_grado ? "Actualizar" : "Registrar"} Grado
				</button>
			</div>
		</form>
	);
}
