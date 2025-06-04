import React, { useEffect, useState } from "react";
import { crearGrado, actualizarGrado } from "../../api/gradoService";
import "../../styles/Botones.css";
import "../../styles/inputs.css";
import "../../styles/Notificacion.css";

export default function FormularioGrado({ onExito, initialData }) {
	const [form, setForm] = useState({ 
		nivel: "",
		anio: "",
		cupos_totales: "",
		cupos_disponibles: "",
	});
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

		if (!form.nivel || !form.anio || !form.cupos_totales || !form.cupos_disponibles) {
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
			setForm({ 
				nivel: "",
				anio: "",
				cupos_totales: "",
				cupos_disponibles: "" 
			});
		} catch (err) {
			setError(
				"Error al guardar. Verifique que el nombre del grado no esté duplicado",
			);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="form">
			{error && <div className="error grid2">{error}</div>}
			<select
			name="nivel"
			className="input-form"
			value={form.nivel}
			onChange={handleChange}
			required
			>
			<option value="" disabled>Seleccione nivel</option>
			<option value="inicial">Inicial</option>
			<option value="primaria">Primaria</option>
			<option value="secundaria">Secundaria</option>
			</select>

			<select
			name="anio"
			className="input-form"
			value={form.anio}
			onChange={handleChange}
			required
			>
			<option value="" disabled>Seleccione año</option>
			<option value="1ro">1ro</option>
			<option value="2do">2do</option>
			<option value="3ro">3ro</option>
			<option value="4to">4to</option>
			<option value="5to">5to</option>
			<option value="6to">6to</option>
			</select>

			<input
				name="cupos_totales"
				placeholder="Cupos Totales"
				className="input-form"
				value={form.cupos_totales}
				onChange={handleChange}
				maxLength={3}
				inputMode="numeric"
			/>

			<input
				name="cupos_disponibles"
				placeholder="Cupos Disponibles"
				className="input-form"
				value={form.cupos_disponibles}
				onChange={handleChange}
				maxLength={3}
				inputMode="numeric"
			/>

			<div className="grid2">
				<button type="submit" className="aceptar-button">
					{form.id_grado ? "Actualizar" : "Registrar"} Grado
				</button>
			</div>
		</form>
	);
}
