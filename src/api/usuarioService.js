import axios from "axios";

const API_URL = "http://localhost:4940/api/usuario";

export const obtenerUsuarios = async () => {
	const res = await axios.get(`${API_URL}/all`);
	return res.data;
};

export const crearUsuario = async (data) => {
	const res = await axios.post(`${API_URL}/create`, data);
	return res.data;
};

export const actualizarUsuario = async (id, data) => {
	const res = await axios.put(`${API_URL}/update/${id}`, data);
	return res.data;
};

export const eliminarUsuario = async (id) => {
	const res = await axios.delete(`${API_URL}/delete/${id}`);
	return res.data;
};
