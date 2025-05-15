import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerAulas, eliminarAula } from "../../api/aulaService";
import Tabla from "../../components/Tabla";
import FormularioAula from "./FormularioAula";
import Notificacion from "../../components/Notification";
import '../../styles/Botones.css';

export default function ListadoAula() {
	const [aulas, setAulas] = useState([]);
	const [formData, setFormData] = useState(null);
	const [mensaje, setMensaje] = useState(null);
	const [mostrarFormulario, setMostrarFormulario] = useState(false);
	const navigate = useNavigate();

	const cargarAulas = async () => {
		const data = await obtenerAulas();
		setAulas(data);
	};

	useEffect(() => {
		cargarAulas();
	}, []);

	const handleEliminar = async (id) => {
		await eliminarAula(id);
		setMensaje({ tipo: "success", texto: "Aula eliminada correctamente" });
		cargarAulas();
	};

	const handleEditar = (aula) => {
		setFormData(aula);
		setMostrarFormulario(true);
	};

	const handleExito = (texto) => {
		setMensaje({ tipo: "success", texto });
		setFormData(null);
		setMostrarFormulario(false);
		cargarAulas();
	};

	return (
		<div>
			<div>
				<h1>Gestión de Aulas</h1>
				<button
					onClick={() => navigate("/")}
					className="menu-button"
				>
					Volver al Menú
				</button>
			</div>
			<br></br>
			<Notificacion mensaje={mensaje?.texto} tipo={mensaje?.tipo} />
			<br></br>
			{mostrarFormulario || formData ? (
				<FormularioAula onExito={handleExito} initialData={formData} />
			) : (
				<button
					onClick={() => setMostrarFormulario(true)}
					className="registrar-button"
				>
					Registrar nueva Aula
				</button>
			)}
			<br></br><br></br>
			<Tabla
				columnas={["N° Aula", "Grado", "Aforo", "Ubicación", "Estado"]}
				datos={aulas}
				onEditar={handleEditar}
				onEliminar={handleEliminar}
			/>
		</div>
	);
}
