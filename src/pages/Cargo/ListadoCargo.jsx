import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerCargos, eliminarCargo } from "../../api/cargoService";
import Tabla from "../../components/Tabla";
import FormularioCargo from "./FormularioCargo";
import Notificacion from "../../components/Notificacion";
import "../../styles/Botones.css";

export default function ListadoCargo() {
	const [cargos, setCargos] = useState([]);
	const [formData, setFormData] = useState(null);
	const [mensaje, setMensaje] = useState(null);
	const [mostrarFormulario, setMostrarFormulario] = useState(false);
	const navigate = useNavigate();

	const cargarCargos = async () => {
		const data = await obtenerCargos();
		setCargos(data);
	};

	useEffect(() => {
		cargarCargos();
	}, []);

	const handleEliminar = async (id) => {
		await eliminarCargo(id);
		setMensaje({ tipo: "success", texto: "Cargo eliminado correctamente" });
		cargarCargos();
	};

	const handleEditar = (cargo) => {
		setFormData(cargo);
		setMostrarFormulario(true);
	};

	const handleExito = (texto) => {
		setMensaje({ tipo: "success", texto });
		setFormData(null);
		setMostrarFormulario(false);
		cargarCargos();
	};

	return (
		<div>
			<div>
				<h1>Gestión de Cargos</h1>
				<button onClick={() => navigate("/")} className="menu-button">
					Volver al Menú
				</button>
			</div>
			<br />
			<Notificacion mensaje={mensaje?.texto} tipo={mensaje?.tipo} />
			<br />
			{mostrarFormulario || formData ? (
				<FormularioCargo onExito={handleExito} initialData={formData} />
			) : (
				<button
					onClick={() => setMostrarFormulario(true)}
					className="registrar-button"
				>
					Registrar nuevo Cargo
				</button>
			)}
			<br />
			<br />
			<Tabla
				columnas={[
					{ key: "nombre_cargo", label: "Nombre del Cargo" },
					{ key: "estado", label: "Estado" },
				]}
				datos={cargos}
				onEditar={handleEditar}
				onEliminar={handleEliminar}
			/>
		</div>
	);
}
