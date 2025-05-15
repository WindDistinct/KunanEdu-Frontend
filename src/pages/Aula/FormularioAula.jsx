import React, { useEffect, useState } from "react";
import { crearAula, actualizarAula } from "../../api/aulaService";
import '../../styles/Botones.css';
import '../../styles/inputs.css';
import '../../styles/Notificacion.css';

export default function FormularioAula({ onExito, initialData }) {
	const [form, setForm] = useState({
		numero_aula: "",
		grado: "",
		aforo: "",
		ubicacion: "",
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

		if (
			!form.numero_aula ||
			!form.grado ||
			!form.aforo ||
			!form.ubicacion
		) {
			setError("Todos los campos son obligatorios");
			return;
		}

		try {
			if (form.id_aula) {
				await actualizarAula(form.id_aula, { ...form });
				onExito("Aula actualizada con éxito");
			} else {
				await crearAula(form);
				onExito("Aula registrada con éxito");
			}
			setForm({
				numero_aula: "",
				grado: "",
				aforo: "",
				ubicacion: "",
			});
		} catch (err) {
			setError(
				"Error al guardar. Verifique que el número de aula no esté duplicado",
			);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="form">
			{error && <div className="error grid2">{error}</div>}
			<input
			name="numero_aula"
			placeholder="Número de Aula"
			className="input-form"
			value={form.numero_aula}
			onChange={handleChange}
			maxLength={3}
			pattern="\d*"
			inputMode="numeric"
			/>

			<input
			name="grado"
			placeholder="Grado"
			className="input-form"
			value={form.grado}
			onChange={handleChange}
			maxLength={1}
			pattern="\d*"
			inputMode="numeric"
			/>

			<input
			name="aforo"
			placeholder="Aforo"
			className="input-form"
			value={form.aforo}
			onChange={handleChange}
			maxLength={2}
			pattern="\d*"
			inputMode="numeric"
			/>

			<input
			name="ubicacion"
			placeholder="Ubicación"
			className="input-form"
			value={form.ubicacion}
			onChange={handleChange}
			maxLength={20}
			/>

			<div className="grid2">
				<button
					type="submit"
					className="aceptar-button"
				>
					{form.id_aula ? "Actualizar" : "Registrar"} Aula
				</button>
			</div>
		</form>
	);
}
