import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerUsuarios, eliminarUsuario } from "../../api/usuarioService";
import Tabla from "../../components/Tabla";
import FormularioUsuario from "./FormularioUsuario";
import Notificacion from "../../components/Notificacion";
import "../../styles/Botones.css";

export default function ListadoUsuario() {
	const [usuarios, setUsuarios] = useState([]);
	const [formData, setFormData] = useState(null);
	const [mensaje, setMensaje] = useState(null);
	const [mostrarFormulario, setMostrarFormulario] = useState(false);
	const navigate = useNavigate();

	const cargarUsuarios = async () => {
		const data = await obtenerUsuarios();
		setUsuarios(data);
	};

	useEffect(() => {
		cargarUsuarios();
	}, []);

	const handleEliminar = async (id) => {
		await eliminarUsuario(id);
		setMensaje({ tipo: "success", texto: "Usuario eliminado correctamente" });
		cargarUsuarios();
	};

	const handleEditar = (usuario) => {
		setFormData(usuario);
		setMostrarFormulario(true);
	};

	const handleExito = (texto) => {
		setMensaje({ tipo: "success", texto });
		setFormData(null);
		setMostrarFormulario(false);
		cargarUsuarios();
	};

	return (
		<div>
			<div>
				<h1>Gestión de Usuarios</h1>
				<button onClick={() => navigate("/")} className="menu-button">
					Volver al Menú
				</button>
			</div>
			<br />
			<Notificacion mensaje={mensaje?.texto} tipo={mensaje?.tipo} />
			<br />
			{mostrarFormulario || formData ? (
				<FormularioUsuario onExito={handleExito} initialData={formData} />
			) : (
				<button
					onClick={() => setMostrarFormulario(true)}
					className="registrar-button"
				>
					Registrar nuevo Usuario
				</button>
			)}
			<br />
			<br />
			<Tabla
				columnas={[
					{ key: "usuario", label: "Usuario" },
					{ key: "rol", label: "Rol" },
				]}
				datos={usuarios}
				onEditar={handleEditar}
				onEliminar={handleEliminar}
			/>
		</div>
	);
}
