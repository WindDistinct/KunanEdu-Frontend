import React, { useEffect, useState } from "react";
import { crearAula, actualizarAula } from "../../api/aulaService";

export default function FormularioAula({ onExito, initialData }) {
	const [form, setForm] = useState({
		numero_aula: "",
		grado: "",
		aforo: "",
		ubicacion: "",
		estado: "",
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
			!form.ubicacion ||
			!form.estado
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
				estado: "",
			});
		} catch (err) {
			setError(
				"Error al guardar. Verifique que el número de aula no esté duplicado",
			);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="mb-4 grid grid-cols-2 gap-4">
			{error && <div className="col-span-2 text-red-600">{error}</div>}
			<input
				name="numero_aula"
				placeholder="Número de Aula"
				className="p-2 border rounded"
				value={form.numero_aula}
				onChange={handleChange}
			/>
			<input
				name="grado"
				placeholder="Grado"
				className="p-2 border rounded"
				value={form.grado}
				onChange={handleChange}
			/>
			<input
				name="aforo"
				placeholder="Aforo"
				className="p-2 border rounded"
				value={form.aforo}
				onChange={handleChange}
			/>
			<input
				name="ubicacion"
				placeholder="Ubicación"
				className="p-2 border rounded"
				value={form.ubicacion}
				onChange={handleChange}
			/>
			<select
				name="estado"
				className="p-2 border rounded"
				value={form.estado}
				onChange={handleChange}
			>
				<option value={1}>Activo</option>
				<option value={0}>Inactivo</option>
			</select>
			<div className="col-span-2">
				<button
					type="submit"
					className="bg-blue-500 text-white px-4 py-2 rounded"
				>
					{form.id_aula ? "Actualizar" : "Registrar"} Aula
				</button>
			</div>
		</form>
	);
}
