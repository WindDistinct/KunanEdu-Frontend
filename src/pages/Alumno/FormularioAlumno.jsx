import React, { useEffect, useState } from "react";
import { crearAlumno, actualizarAlumno } from "../../api/alumnoService";
import "../../styles/Botones.css";
import "../../styles/inputs.css";
import "../../styles/Notificacion.css";

export default function FormularioAlumno({ onExito, initialData }) {
	const [form, setForm] = useState({
		nombre_alumno: "",
		apellido_paterno: "",
		apellido_materno: "",
		dni_alumno: "",
		direccion: "",
		grado: "",
		telefono: "",
		fecha_nacimiento: "",
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

		const camposObligatorios = [
			"nombre_alumno",
			"apellido_paterno",
			"apellido_materno",
			"dni_alumno",
			"direccion",
			"grado",
			"telefono",
			"fecha_nacimiento",
		];

		if (camposObligatorios.some((campo) => !form[campo])) {
			setError("Todos los campos son obligatorios");
			return;
		}

		try {
			if (form.id_alumno) {
				await actualizarAlumno(form.id_alumno, { ...form, estado: 1 });
				onExito("Alumno actualizado con éxito");
			} else {
				await crearAlumno(form);
				onExito("Alumno registrado con éxito");
			}
			setForm({
				nombre_alumno: "",
				apellido_paterno: "",
				apellido_materno: "",
				dni_alumno: "",
				direccion: "",
				grado: "",
				telefono: "",
				fecha_nacimiento: "",
			});
		} catch (err) {
			setError("Error al guardar. Verifique que el DNI no esté duplicado");
		}
	};

	return (
		<form onSubmit={handleSubmit} className="form">
			{error && <div className="error grid2">{error}</div>}
			<input
				name="nombre_alumno"
				placeholder="Nombres"
				className="input-form"
				value={form.nombre_alumno}
				onChange={handleChange}
			/>
			<input
				name="apellido_paterno"
				placeholder="Apellido Paterno"
				className="input-form"
				value={form.apellido_paterno}
				onChange={handleChange}
			/>
			<input
				name="apellido_materno"
				placeholder="Apellido Materno"
				className="input-form"
				value={form.apellido_materno}
				onChange={handleChange}
			/>
			<input
				name="dni_alumno"
				placeholder="DNI"
				className="input-form"
				value={form.dni_alumno}
				onChange={handleChange}
			/>
			<input
				name="direccion"
				placeholder="Dirección"
				className="input-form"
				value={form.direccion}
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
				name="telefono"
				placeholder="Teléfono"
				className="input-form"
				value={form.telefono}
				onChange={handleChange}
			/>
			<input
				name="fecha_nacimiento"
				type="date"
				placeholder="Fecha de Nacimiento"
				className="input-form"
				value={form.fecha_nacimiento}
				onChange={handleChange}
			/>
			<div className="grid2">
				<button type="submit" className="aceptar-button">
					{form.id_alumno ? "Actualizar" : "Registrar"} Alumno
				</button>
			</div>
		</form>
	);
}
