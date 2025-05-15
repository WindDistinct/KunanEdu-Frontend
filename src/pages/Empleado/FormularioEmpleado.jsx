import React, { useEffect, useState } from "react";
import { crearEmpleado, actualizarEmpleado } from "../../api/empleadoService";
import "../../styles/Botones.css";
import "../../styles/inputs.css";
import "../../styles/Notificacion.css";

export default function FormularioEmpleado({ onExito, initialData }) {
	const [form, setForm] = useState({
		nombre_empleado: "",
		apellido_paterno: "",
		apellido_materno: "",
		fecha_nacimiento: "",
		especialidad: "",
		dni: "",
		telefono: "",
		observacion: "",
		cargo: "",
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
			"nombre_empleado",
			"apellido_paterno",
			"apellido_materno",
			"fecha_nacimiento",
			"especialidad",
			"dni",
			"telefono",
			"cargo",
		];

		if (camposObligatorios.some((campo) => !form[campo])) {
			setError("Todos los campos obligatorios deben estar completos");
			return;
		}

		try {
			if (form.id_empleado) {
				await actualizarEmpleado(form.id_empleado, { ...form, estado: 1 });
				onExito("Empleado actualizado con éxito");
			} else {
				await crearEmpleado(form);
				onExito("Empleado registrado con éxito");
			}
			setForm({
				nombre_empleado: "",
				apellido_paterno: "",
				apellido_materno: "",
				fecha_nacimiento: "",
				especialidad: "",
				dni: "",
				telefono: "",
				observacion: "",
				cargo: "",
			});
		} catch (err) {
			setError("Error al guardar. Verifique que el DNI no esté duplicado");
		}
	};

	return (
		<form onSubmit={handleSubmit} className="form">
			{error && <div className="error grid2">{error}</div>}
			<input
				name="nombre_empleado"
				placeholder="Nombres"
				className="input-form"
				value={form.nombre_empleado}
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
				name="fecha_nacimiento"
				type="date"
				placeholder="Fecha Nacimiento"
				className="input-form"
				value={form.fecha_nacimiento}
				onChange={handleChange}
			/>
			<input
				name="especialidad"
				placeholder="Especialidad"
				className="input-form"
				value={form.especialidad}
				onChange={handleChange}
			/>
			<input
				name="dni"
				placeholder="DNI"
				className="input-form"
				value={form.dni}
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
				name="observacion"
				placeholder="Observación"
				className="input-form"
				value={form.observacion}
				onChange={handleChange}
			/>
			<input
				name="cargo"
				placeholder="Cargo"
				className="input-form"
				value={form.cargo}
				onChange={handleChange}
			/>
			<div className="grid2">
				<button type="submit" className="aceptar-button">
					{form.id_empleado ? "Actualizar" : "Registrar"} Empleado
				</button>
			</div>
		</form>
	);
}
