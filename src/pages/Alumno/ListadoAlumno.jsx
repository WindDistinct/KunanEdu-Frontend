import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerAlumnos, eliminarAlumno } from "../../api/alumnoService";
import Tabla from "../../components/Tabla";
import FormularioAlumno from "./FormularioAlumno";
import Notificacion from "../../components/Notificacion";
import "../../styles/Botones.css";

export default function ListadoAlumno() {
	const [alumnos, setAlumnos] = useState([]);
	const [formData, setFormData] = useState(null);
	const [mensaje, setMensaje] = useState(null);
	const [mostrarFormulario, setMostrarFormulario] = useState(false);
	const navigate = useNavigate();

	const cargarAlumnos = async () => {
		const data = await obtenerAlumnos();
		setAlumnos(data);
		console.log(data);
	};

	useEffect(() => {
		cargarAlumnos();
	}, []);

	const handleEliminar = async (id) => {
		await eliminarAlumno(id);
		setMensaje({ tipo: "success", texto: "Alumno eliminado correctamente" });
		cargarAlumnos();
	};

	const handleEditar = (alumno) => {
		setFormData(alumno);
		setMostrarFormulario(true);
	};

	const handleExito = (texto) => {
		setMensaje({ tipo: "success", texto });
		setFormData(null);
		setMostrarFormulario(false);
		cargarAlumnos();
	};

	return (
		<div>
			<div>
				<h1>Gestión de Alumnos</h1>
				<button onClick={() => navigate("/")} className="menu-button">
					Volver al Menú
				</button>
			</div>
			<br />
			<Notificacion mensaje={mensaje?.texto} tipo={mensaje?.tipo} />
			<br />
			{mostrarFormulario || formData ? (
				<FormularioAlumno onExito={handleExito} initialData={formData} />
			) : (
				<button
					onClick={() => setMostrarFormulario(true)}
					className="registrar-button"
				>
					Registrar nuevo Alumno
				</button>
			)}
			<br />
			<br />
			<Tabla
				columnas={[
					{ key: "nombre", label: "Nombres" },
					{ key: "apellido_paterno", label: "Apellido Paterno" },
					{ key: "apellido_materno", label: "Apellido Materno" },
					{ key: "dni", label: "DNI" },
					{ key: "direccion", label: "Dirección" },
					{ key: "telefono", label: "Teléfono" },
					{ key: "fecha_nacimiento", label: "Fecha Nacimiento" },
					{ key: "estado", label: "Estado" },
				]}
				datos={alumnos}
				onEditar={handleEditar}
				onEliminar={handleEliminar}
				idKey="id_alumno"
			/>
		</div>
	);
}
