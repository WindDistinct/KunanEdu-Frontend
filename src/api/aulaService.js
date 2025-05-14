import axios from "axios";

const API_URL = "http://localhost:4940/api/aula";

export const obtenerAulas = async () => {
	const res = await axios.get(`${API_URL}/all`);
	return res.data;
};

export const crearAula = async (data) => {
	const res = await axios.post(`${API_URL}/create`, data);
	return res.data;
};

export const actualizarAula = async (id, data) => {
	const res = await axios.put(`${API_URL}/update/${id}`, data);
	return res.data;
};

export const eliminarAula = async (id) => {
	const res = await axios.delete(`${API_URL}/delete/${id}`);
	return res.data;
};
