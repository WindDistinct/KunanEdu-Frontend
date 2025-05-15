import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerCursos, eliminarCurso } from "../../api/cursoService";
import Tabla from "../../components/Tabla";
import FormularioCurso from "./FormularioCurso";
import Notificacion from "../../components/Notificacion";
import "../../styles/Botones.css";

export default function ListadoCurso() {
	const [cursos, setCursos] = useState([]);
	const [formData, setFormData] = useState(null);
	const [mensaje, setMensaje] = useState(null);
	const [mostrarFormulario, setMostrarFormulario] = useState(false);
	const navigate = useNavigate();

	const cargarCursos = async () => {
		const data = await obtenerCursos();
		setCursos(data);
	};

	useEffect(() => {
		cargarCursos();
	}, []);

	const handleEliminar = async (id) => {
		await eliminarCurso(id);
		setMensaje({ tipo: "success", texto: "Curso eliminado correctamente" });
		cargarCursos();
	};

	const handleEditar = (curso) => {
		setFormData(curso);
		setMostrarFormulario(true);
	};

	const handleExito = (texto) => {
		setMensaje({ tipo: "success", texto });
		setFormData(null);
		setMostrarFormulario(false);
		cargarCursos();
	};

	return (
		<div>
			<div>
				<h1>Gestión de Cursos</h1>
				<button onClick={() => navigate("/")} className="menu-button">
					Volver al Menú
				</button>
			</div>
			<br />
			<Notificacion mensaje={mensaje?.texto} tipo={mensaje?.tipo} />
			<br />
			{mostrarFormulario || formData ? (
				<FormularioCurso onExito={handleExito} initialData={formData} />
			) : (
				<button
					onClick={() => setMostrarFormulario(true)}
					className="registrar-button"
				>
					Registrar nuevo Curso
				</button>
			)}
			<br />
			<br />
			<Tabla
				columnas={[
					{ key: "nombre_curso", label: "Nombre del Curso" },
					{ key: "grado", label: "Grado" },
					{ key: "docente", label: "Docente" },
					{ key: "estado", label: "Estado" },
				]}
				datos={cursos}
				onEditar={handleEditar}
				onEliminar={handleEliminar}
			/>
		</div>
	);
}
