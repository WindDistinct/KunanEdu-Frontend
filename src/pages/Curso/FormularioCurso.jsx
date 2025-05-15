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

	const esTextoValido = (texto) => /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,}$/.test(texto.trim());
	const esNumeroValido = (numero) => /^\d+$/.test(numero.trim());

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);

		const { nombre_curso, grado, docente } = form;

		if (!nombre_curso || !grado || !docente) {
			setError("Todos los campos son obligatorios");
			return;
		}

		if (!esTextoValido(nombre_curso)) {
			setError("El nombre del curso debe contener solo letras y tener al menos 3 caracteres");
			return;
		}

		if (!esNumeroValido(grado)) {
			setError("El grado debe contener solo números");
			return;
		}

		if (!esNumeroValido(docente)) {
			setError("El docente debe contener solo números");
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
			setError("Error al guardar. Verifique que el nombre del curso no esté duplicado");
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
				inputMode="numeric"
			/>
			<input
				name="docente"
				placeholder="Docente (solo números)"
				className="input-form"
				value={form.docente}
				onChange={handleChange}
				inputMode="numeric"
			/>
			<div className="grid2">
				<button type="submit" className="aceptar-button">
					{form.id_curso ? "Actualizar" : "Registrar"} Curso
				</button>
			</div>
		</form>
	);
}
