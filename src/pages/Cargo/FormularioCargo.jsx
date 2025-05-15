import React, { useEffect, useState } from "react";
import { crearCargo, actualizarCargo } from "../../api/cargoService";
import "../../styles/Botones.css";
import "../../styles/inputs.css";
import "../../styles/Notificacion.css";

export default function FormularioCargo({ onExito, initialData }) {
	const [form, setForm] = useState({ nombre_cargo: "" });
	const [error, setError] = useState(null);

	useEffect(() => {
		if (initialData) setForm(initialData);
	}, [initialData]);

	const handleChange = (e) => {
		setForm({ nombre_cargo: e.target.value });
	};

	const esTextoValido = (texto) =>
		/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(texto) && texto.trim().length >= 3;

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);

		if (!form.nombre_cargo.trim()) {
			setError("El nombre del cargo es obligatorio");
			return;
		}

		if (!esTextoValido(form.nombre_cargo)) {
			setError("El nombre del cargo debe contener solo letras y al menos 3 caracteres");
			return;
		}

		try {
			if (form.id_cargo) {
				await actualizarCargo(form.id_cargo, { ...form, estado: 1 });
				onExito("Cargo actualizado con éxito");
			} else {
				await crearCargo(form);
				onExito("Cargo registrado con éxito");
			}
			setForm({ nombre_cargo: "" });
		} catch (err) {
			setError("Error al guardar. Verifique que el nombre no esté duplicado");
		}
	};

	return (
		<form onSubmit={handleSubmit} className="form">
			{error && <div className="error grid2">{error}</div>}
			<input
				name="nombre_cargo"
				placeholder="Nombre del Cargo"
				className="input-form"
				value={form.nombre_cargo}
				onChange={handleChange}
			/>
			<div className="grid2">
				<button type="submit" className="aceptar-button">
					{form.id_cargo ? "Actualizar" : "Registrar"} Cargo
				</button>
			</div>
		</form>
	);
}
