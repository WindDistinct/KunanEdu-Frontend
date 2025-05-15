import axios from "axios";

const API_URL = "http://localhost:4940/api/curso";

export const obtenerCursos = async () => {
	const res = await axios.get(`${API_URL}/all`);
	return res.data;
};

export const crearCurso = async (data) => {
	const res = await axios.post(`${API_URL}/create`, data);
	return res.data;
};

export const actualizarCurso = async (id, data) => {
	const res = await axios.put(`${API_URL}/update/${id}`, data);
	return res.data;
};

export const eliminarCurso = async (id) => {
	const res = await axios.delete(`${API_URL}/delete/${id}`);
	return res.data;
};
