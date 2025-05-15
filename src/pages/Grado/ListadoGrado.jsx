import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerGrados, eliminarGrado } from "../../api/gradoService";
import Tabla from "../../components/Tabla";
import FormularioGrado from "./FormularioGrado";
import Notificacion from "../../components/Notificacion";
import "../../styles/Botones.css";

export default function ListadoGrado() {
	const [grados, setGrados] = useState([]);
	const [formData, setFormData] = useState(null);
	const [mensaje, setMensaje] = useState(null);
	const [mostrarFormulario, setMostrarFormulario] = useState(false);
	const navigate = useNavigate();

	const cargarGrados = async () => {
		const data = await obtenerGrados();
		setGrados(data);
	};

	useEffect(() => {
		cargarGrados();
	}, []);

	const handleEliminar = async (id) => {
		await eliminarGrado(id);
		setMensaje({ tipo: "success", texto: "Grado eliminado correctamente" });
		cargarGrados();
	};

	const handleEditar = (grado) => {
		setFormData(grado);
		setMostrarFormulario(true);
	};

	const handleExito = (texto) => {
		setMensaje({ tipo: "success", texto });
		setFormData(null);
		setMostrarFormulario(false);
		cargarGrados();
	};

	return (
		<div>
			<div>
				<h1>Gestión de Grados</h1>
				<button onClick={() => navigate("/")} className="menu-button">
					Volver al Menú
				</button>
			</div>
			<br />
			<Notificacion mensaje={mensaje?.texto} tipo={mensaje?.tipo} />
			<br />
			{mostrarFormulario || formData ? (
				<FormularioGrado onExito={handleExito} initialData={formData} />
			) : (
				<button
					onClick={() => setMostrarFormulario(true)}
					className="registrar-button"
				>
					Registrar nuevo Grado
				</button>
			)}
			<br />
			<br />
			<Tabla
				columnas={[
					{ key: "nombre_grado", label: "Nombre del Grado" },
					{ key: "descripcion_grado", label: "Descripción" },
					{ key: "estado", label: "Estado" },
				]}
				datos={grados}
				onEditar={handleEditar}
				onEliminar={handleEliminar}
			/>
		</div>
	);
}
