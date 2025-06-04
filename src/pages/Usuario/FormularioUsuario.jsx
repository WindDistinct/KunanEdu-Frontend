import React, { useEffect, useState } from "react";
import { crearUsuario, actualizarUsuario } from "../../api/usuarioService";
import "../../styles/Botones.css";
import "../../styles/inputs.css";
import "../../styles/Notificacion.css";

export default function FormularioUsuario({ onExito, initialData }) {
	const [form, setForm] = useState({ username: "", password: "", rol: "" });
	const [error, setError] = useState(null);

	useEffect(() => {
		if (initialData) setForm({ ...initialData, password: "" });
	}, [initialData]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);

		if (!form.username || !form.password || !form.rol) {
			setError("Todos los campos son obligatorios");
			return;
		}

		try {
			if (form.id_usuario) {
				await actualizarUsuario(form.id_usuario, form);
				onExito("Usuario actualizado con éxito");
			} else {
				await crearUsuario(form);
				onExito("Usuario registrado con éxito");
			}
			setForm({ username: "", password: "", rol: "" });
		} catch (err) {
			setError("Error al guardar. Verifique que el usuario no esté duplicado");
		}
	};

	return (
		<form onSubmit={handleSubmit} className="form">
			{error && <div className="error grid2">{error}</div>}
			<input
				name="username"
				placeholder="Usuario"
				className="input-form"
				value={form.username}
				onChange={handleChange}
			/>
			<input
				name="password"
				type="password"
				placeholder="Contraseña"
				className="input-form"
				value={form.password}
				onChange={handleChange}
			/>
			<select
			name="rol"
			className="input-form"
			value={form.rol}
			onChange={handleChange}
			required
			>
			<option value="" disabled>Seleccione año</option>
			<option value="administrador">Administrador</option>
			<option value="usuario">Usuario</option>
			</select>
			<div className="grid2">
				<button type="submit" className="aceptar-button">
					{form.id_usuario ? "Actualizar" : "Registrar"} Usuario
				</button>
			</div>
		</form>
	);
}
