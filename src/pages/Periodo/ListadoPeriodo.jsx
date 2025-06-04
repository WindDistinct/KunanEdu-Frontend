import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerPeriodos, eliminarPeriodo } from "../../api/periodoService";
import Tabla from "../../components/Tabla";
import FormularioPeriodo from "./FormularioPeriodo";
import Notificacion from "../../components/Notificacion";
import "../../styles/Botones.css";

export default function ListadoPeriodo() {
	const [periodos, setPeriodos] = useState([]);
	const [formData, setFormData] = useState(null);
	const [mensaje, setMensaje] = useState(null);
	const [mostrarFormulario, setMostrarFormulario] = useState(false);
	const navigate = useNavigate();

	const cargarPeriodos = async () => {
		const data = await obtenerPeriodos();
		setPeriodos(data);
	};

	useEffect(() => {
		cargarPeriodos();
	}, []);

	const handleEliminar = async (id) => {
		await eliminarPeriodo(id);
		setMensaje({ tipo: "success", texto: "Periodo eliminado correctamente" });
		cargarPeriodos();
	};

	const handleEditar = (periodo) => {
		setFormData(periodo);
		setMostrarFormulario(true);
	};

	const handleExito = (texto) => {
		setMensaje({ tipo: "success", texto });
		setFormData(null);
		setMostrarFormulario(false);
		cargarPeriodos();
	};

	return (
		<div>
			<div>
				<h1>Gestión de Periodos</h1>
				<button onClick={() => navigate("/")} className="menu-button">
					Volver al Menú
				</button>
			</div>
			<br />
			<Notificacion mensaje={mensaje?.texto} tipo={mensaje?.tipo} />
			<br />
			{mostrarFormulario || formData ? (
				<FormularioPeriodo onExito={handleExito} initialData={formData} />
			) : (
				<button
					onClick={() => setMostrarFormulario(true)}
					className="registrar-button"
				>
					Registrar nuevo Periodo
				</button>
			)}
			<br />
			<br />
			<Tabla
				columnas={[
					{ key: "anio", label: "Año" },
					{ key: "descripcion", label: "Descripción" },
					{ key: "progreso", label: "Progreso" },
					{ key: "estado", label: "Estado" },
				]}
				datos={periodos}
				onEditar={handleEditar}
				onEliminar={handleEliminar}
				idKey="id_periodo"
			/>
		</div>
	);
}
