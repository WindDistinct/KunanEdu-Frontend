import React, { useEffect, useState } from "react";
import { crearEmpleado, actualizarEmpleado } from "../../api/empleadoService";
import { obtenerUsuarios } from "../../api/usuarioService";
import "../../styles/Botones.css";
import "../../styles/inputs.css";
import "../../styles/Notificacion.css";

export default function FormularioEmpleado({ onExito, initialData }) {
	const [form, setForm] = useState({
		nombre_emp: "",
		ape_pat_emp: "",
		ape_mat_emp: "",
		fec_nac: "",
		dni: "",
		telefono: "",
		especialidad: "",
		cargo: "",
		observacion: "",
		usuario: "",
	});
	const [error, setError] = useState(null);

	const [usuarios, setUsuarios] = useState([]);

	useEffect(() => {
		const cargarUsuarios = async () => {
			const data = await obtenerUsuarios();
			setUsuarios(data);
		};
		cargarUsuarios();
	}, []);

	useEffect(() => {
		if (initialData) setForm(initialData);
	}, [initialData]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const esTextoValido = (texto) => /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(texto.trim());
	const esNumeroExacto = (numero, longitud) =>
		new RegExp(`^\\d{${longitud}}$`).test(numero.trim());

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);

		const camposObligatorios = [
			"nombre_emp",
			"ape_pat_emp",
			"ape_mat_emp",
			"fec_nac",
			"dni",
			"telefono",
			"especialidad",
			"cargo",
			"observacion",
			"usuario",
		];

		if (camposObligatorios.some((campo) => !form[campo])) {
			setError("Todos los campos obligatorios deben estar completos");
			return;
		}

		if (!esTextoValido(form.nombre_emp)) {
			setError("El nombre solo debe contener letras y espacios");
			return;
		}
		if (!esTextoValido(form.ape_pat_emp)) {
			setError("El apellido paterno solo debe contener letras y espacios");
			return;
		}
		if (!esTextoValido(form.ape_mat_emp)) {
			setError("El apellido materno solo debe contener letras y espacios");
			return;
		}
		if (!esTextoValido(form.especialidad)) {
			setError("La especialidad solo debe contener letras y espacios");
			return;
		}
		if (!esTextoValido(form.observacion)) {
			setError("La especialidad solo debe contener letras y espacios");
			return;
		}
		if (!esNumeroExacto(form.dni, 8)) {
			setError("El DNI debe contener exactamente 8 dígitos numéricos");
			return;
		}
		if (!esNumeroExacto(form.telefono, 9)) {
			setError("El teléfono debe contener exactamente 9 dígitos numéricos");
			return;
		}

		try {
			if (form.id_emp) {
				await actualizarEmpleado(form.id_emp, { ...form, estado: 1 });
				onExito("Empleado actualizado con éxito");
			} else {
				await crearEmpleado(form);
				onExito("Empleado registrado con éxito");
			}
			setForm({
				nombre_emp: "",
				ape_pat_emp: "",
				ape_mat_emp: "",
				fec_nac: "",
				dni: "",
				telefono: "",
				especialidad: "",
				cargo: "",
				observacion: "",
				usuario: "",
			});
		} catch (err) {
	let mensaje = "Error del servidor";

	if (err.response?.data) {
		if (typeof err.response.data === "string") {
			mensaje = err.response.data;
		} else if (err.response.data.message) {
			mensaje = err.response.data.message;
		} else {
			mensaje = JSON.stringify(err.response.data);
		}
	} else if (err.message) {
		mensaje = err.message;
	}

	console.error("Error detallado:", err); 
	setError(`Error al guardar: ${mensaje}`);
}
	};

	return (
		<form onSubmit={handleSubmit} className="form">
			{error && <div className="error grid2">{error}</div>}
			<input
				name="nombre_emp"
				placeholder="Nombres"
				className="input-form"
				value={form.nombre_emp}
				onChange={handleChange}
			/>
			<input
				name="ape_pat_emp"
				placeholder="Apellido Paterno"
				className="input-form"
				value={form.ape_pat_emp}
				onChange={handleChange}
			/>
			<input
				name="ape_mat_emp"
				placeholder="Apellido Materno"
				className="input-form"
				value={form.ape_mat_emp}
				onChange={handleChange}
			/>
			<input
				name="fec_nac"
				type="date"
				placeholder="Fecha Nacimiento"
				className="input-form"
				value={form.fec_nac}
				onChange={handleChange}
			/>

			<select
			name="especialidad"
			className="input-form"
			value={form.especialidad}
			onChange={handleChange}
			required
			>
			<option value="" disabled>Seleccione especialidad</option>
			<option value="ciencias">Ciencias</option>
			<option value="letras">Letras</option>
			<option value="matematicas">Matemáticas</option>
			<option value="mixto">Mixto</option>
			</select>

			<input
				name="dni"
				placeholder="DNI"
				className="input-form"
				value={form.dni}
				onChange={handleChange}
				maxLength={8}
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
				name="observacion"
				placeholder="Observación"
				className="input-form"
				value={form.observacion}
				onChange={handleChange}
			/>

			<select
			name="cargo"
			className="input-form"
			value={form.cargo}
			onChange={handleChange}
			required
			>
			<option value="" disabled>Seleccione cargo</option>
			<option value="docente">Docente</option>
			<option value="tutor">Tutor</option>
			<option value="director">Director</option>
			</select>

			<select
				name="usuario"
				className="input-form"
				value={form.usuario || ""}
				onChange={handleChange}
				required
			>
				<option value="" disabled>Seleccione usuario</option>
				{usuarios.map((usuario) => (
					<option key={usuario.id_usuario} value={usuario.id_usuario}>
						{usuario.username}
					</option>
				))}
			</select>

			<div className="grid2">
				<button type="submit" className="aceptar-button">
					{form.id_empleado ? "Actualizar" : "Registrar"} Empleado
				</button>
			</div>
		</form>
	);
}
