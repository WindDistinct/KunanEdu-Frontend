import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerEmpleados, eliminarEmpleado } from "../../api/empleadoService";
import Tabla from "../../components/Tabla";
import FormularioEmpleado from "./FormularioEmpleado";
import Notificacion from "../../components/Notificacion";
import "../../styles/Botones.css";

export default function ListadoEmpleado() {
	const [empleados, setEmpleados] = useState([]);
	const [formData, setFormData] = useState(null);
	const [mensaje, setMensaje] = useState(null);
	const [mostrarFormulario, setMostrarFormulario] = useState(false);
	const navigate = useNavigate();

	const cargarEmpleados = async () => {
		const data = await obtenerEmpleados();
		setEmpleados(data);
	};

	useEffect(() => {
		cargarEmpleados();
	}, []);

	const handleEliminar = async (id) => {
		await eliminarEmpleado(id);
		setMensaje({ tipo: "success", texto: "Empleado eliminado correctamente" });
		cargarEmpleados();
	};

	const handleEditar = (empleado) => {
		setFormData(empleado);
		setMostrarFormulario(true);
	};

	const handleExito = (texto) => {
		setMensaje({ tipo: "success", texto });
		setFormData(null);
		setMostrarFormulario(false);
		cargarEmpleados();
	};

	return (
		<div>
			<div>
				<h1>Gestión de Empleados</h1>
				<button onClick={() => navigate("/")} className="menu-button">
					Volver al Menú
				</button>
			</div>
			<br />
			<Notificacion mensaje={mensaje?.texto} tipo={mensaje?.tipo} />
			<br />
			{mostrarFormulario || formData ? (
				<FormularioEmpleado onExito={handleExito} initialData={formData} />
			) : (
				<button
					onClick={() => setMostrarFormulario(true)}
					className="registrar-button"
				>
					Registrar nuevo Empleado
				</button>
			)}
			<br />
			<br />
			<Tabla
				columnas={[
					{ key: "nombre_empleado", label: "Nombres" },
					{ key: "apellido_paterno", label: "Apellido" },
					{ key: "dni", label: "DNI" },
					{ key: "especialidad", label: "Especialidad" },
					{ key: "cargo", label: "Cargo" },
					{ key: "estado", label: "Estado" },
				]}
				datos={empleados.map((e) => ({
					...e,
					nombre: `${e.nombre_empleado} ${e.apellido_paterno} ${e.apellido_materno}`,
				}))}
				onEditar={handleEditar}
				onEliminar={handleEliminar}
			/>
		</div>
	);
}
