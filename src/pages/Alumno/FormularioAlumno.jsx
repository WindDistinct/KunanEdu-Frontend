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

	const esTextoValido = (texto, minLength = 2) =>
		/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(texto) && texto.length >= minLength;

	const esNumeroExacto = (valor, digitos) =>
		/^\d+$/.test(valor) && valor.length === digitos;

	const esNumero = (valor) => /^\d+$/.test(valor);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);

		const {
			nombre_alumno,
			apellido_paterno,
			apellido_materno,
			dni_alumno,
			direccion,
			grado,
			telefono,
			fecha_nacimiento,
		} = form;

		// Validaciones obligatorias
		if (
			!nombre_alumno ||
			!apellido_paterno ||
			!apellido_materno ||
			!dni_alumno ||
			!direccion ||
			!grado ||
			!telefono ||
			!fecha_nacimiento
		) {
			setError("Todos los campos son obligatorios");
			return;
		}

		// Validaciones específicas
		if (!esTextoValido(nombre_alumno, 5)) {
			setError("El nombre debe tener al menos 5 letras y no contener números");
			return;
		}

		if (!esTextoValido(apellido_paterno)) {
			setError("El apellido paterno debe tener al menos 2 letras y no contener números");
			return;
		}

		if (!esTextoValido(apellido_materno)) {
			setError("El apellido materno debe tener al menos 2 letras y no contener números");
			return;
		}

		if (!esNumeroExacto(dni_alumno, 8)) {
			setError("El DNI debe tener exactamente 8 dígitos numéricos");
			return;
		}

		if (direccion.length < 5) {
			setError("La dirección debe tener al menos 5 caracteres");
			return;
		}

		if (!esNumero(grado)) {
			setError("El grado debe ser un número");
			return;
		}

		if (!esNumeroExacto(telefono, 9)) {
			setError("El teléfono debe tener exactamente 9 dígitos numéricos");
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
				maxLength={8}
				inputMode="numeric"
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
				inputMode="numeric"
			/>
			<input
				name="telefono"
				placeholder="Teléfono"
				className="input-form"
				value={form.telefono}
				onChange={handleChange}
				maxLength={9}
				inputMode="numeric"
			/>
			<input
				name="fecha_nacimiento"
				type="date"
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
