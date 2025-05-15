import React, { useEffect, useState } from "react";
import { crearCurso, actualizarCurso } from "../../api/cursoService";
import "../../styles/Botones.css";
import "../../styles/inputs.css";
import "../../styles/Notificacion.css";

export default function FormularioCurso({ onExito, initialData }) {
	const [form, setForm] = useState({
		nombre_curso: "",
		grado: "",
		docente: "",
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

		if (!form.nombre_curso || !form.grado || !form.docente) {
			setError("Todos los campos son obligatorios");
			return;
		}

		try {
			if (form.id_curso) {
				await actualizarCurso(form.id_curso, { ...form, estado: 1 });
				onExito("Curso actualizado con éxito");
			} else {
				await crearCurso(form);
				onExito("Curso registrado con éxito");
			}
			setForm({ nombre_curso: "", grado: "", docente: "" });
		} catch (err) {
			setError(
				"Error al guardar. Verifique que el nombre del curso no esté duplicado",
			);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="form">
			{error && <div className="error grid2">{error}</div>}
			<input
				name="nombre_curso"
				placeholder="Nombre del Curso"
				className="input-form"
				value={form.nombre_curso}
				onChange={handleChange}
			/>
			<input
				name="grado"
				placeholder="Grado"
				className="input-form"
				value={form.grado}
				onChange={handleChange}
			/>
			<input
				name="docente"
				placeholder="Docente"
				className="input-form"
				value={form.docente}
				onChange={handleChange}
			/>
			<div className="grid2">
				<button type="submit" className="aceptar-button">
					{form.id_curso ? "Actualizar" : "Registrar"} Curso
				</button>
			</div>
		</form>
	);
}
