import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerAulas, eliminarAula } from "../../api/aulaService";
import Tabla from "../../components/Tabla";
import FormularioAula from "./FormularioAula";
import Notificacion from "../../components/Notification";

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
		<div className="p-4 max-w-4xl mx-auto">
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-xl font-bold">Gestión de Aulas</h1>
				<button
					onClick={() => navigate("/")}
					className="bg-gray-300 text-sm px-2 py-1 rounded"
				>
					Volver al Menú
				</button>
			</div>
			<Notificacion mensaje={mensaje?.texto} tipo={mensaje?.tipo} />
			{mostrarFormulario || formData ? (
				<FormularioAula onExito={handleExito} initialData={formData} />
			) : (
				<button
					onClick={() => setMostrarFormulario(true)}
					className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
				>
					Registrar nueva Aula
				</button>
			)}
			<Tabla
				columnas={["N° Aula", "Grado", "Aforo", "Ubicación", "Estado"]}
				datos={aulas}
				onEditar={handleEditar}
				onEliminar={handleEliminar}
			/>
		</div>
	);
}
