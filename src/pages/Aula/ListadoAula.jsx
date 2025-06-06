import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerAulas, obtenerAulasAd, eliminarAula } from "../../api/aulaService";
import Tabla from "../../components/Tabla";
import FormularioAula from "./FormularioAula";
import Notificacion from "../../components/Notificacion";
import "../../styles/Botones.css";

export default function ListadoAula() {
	const [aulas, setAulas] = useState([]);
	const [formData, setFormData] = useState(null);
	const [mensaje, setMensaje] = useState(null);
	const [mostrarFormulario, setMostrarFormulario] = useState(false);
	const navigate = useNavigate();

	const [rol] = useState(() => localStorage.getItem("rol"));
	const puedeAdministrar = rol === "administrador";

	const cargarAulas = useCallback(async () => {
		try {
			const data = rol === "administrador" ? await obtenerAulasAd() : await obtenerAulas();
			setAulas(data);
		} catch (error) {
			setMensaje({ tipo: "error", texto: "Error al cargar las aulas" });
		}
	}, [rol]);

	useEffect(() => {
		cargarAulas();
	}, [cargarAulas]);

	const handleEliminar = async (id) => {
		try {
			await eliminarAula(id);
			setMensaje({ tipo: "success", texto: "Aula eliminada correctamente" });
			await cargarAulas();
		} catch (error) {
			setMensaje({ tipo: "error", texto: "Error al eliminar el aula" });
		}
	};

	const handleEditar = (aula) => {
		setFormData(aula);
		setMostrarFormulario(true);
	};

	const handleExito = async (texto) => {
		setMensaje({ tipo: "success", texto });
		setFormData(null);
		setMostrarFormulario(false);
		await cargarAulas();
	};

	return (
		<div>
			<div>
				<h1>Gestión de Aulas</h1>
				<button onClick={() => navigate("/")} className="menu-button">
					Volver al Menú
				</button>
			</div>
			<br />
			<Notificacion mensaje={mensaje?.texto} tipo={mensaje?.tipo} />
			<br />
			{mostrarFormulario || formData ? (
				<FormularioAula onExito={handleExito} initialData={formData} />
			) : (
				puedeAdministrar && (
					<button onClick={() => setMostrarFormulario(true)} className="registrar-button">
						Registrar nueva Aula
					</button>
				)
			)}
			<br />
			<br />
			<Tabla
				columnas={[
					{ key: "numero_aula", label: "N° Aula" },
					{ key: "aforo", label: "Aforo" },
					{ key: "ubicacion", label: "Ubicación" },
					...(puedeAdministrar ? [{ key: "estado", label: "Estado" }] : []),
				]}
				datos={aulas}
				onEditar={handleEditar}
				onEliminar={handleEliminar}
				idKey="id_aula"
				mostrarAcciones={puedeAdministrar}
			/>
		</div>
	);
}