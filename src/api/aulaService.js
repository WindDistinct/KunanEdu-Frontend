import axiosInstance from "./axiosInstance";

export const obtenerAulas = async () => {
	const res = await axiosInstance.get(`/api/aula/all-adm`);
	return res.data;
};

export const crearAula = async (data) => {
	const res = await axiosInstance.post(`/api/aula/create`, data);
	return res.data;
};

export const actualizarAula = async (id, data) => {
	const res = await axiosInstance.put(`/api/aula/update/${id}`, data);
	return res.data;
};

export const eliminarAula = async (id) => {
	const res = await axiosInstance.delete(`/api/aula/delete/${id}`);
	return res.data;
};

export const auditoriaAula = async (id) => {
	const res = await axiosInstance.get(`/api/aula/all-audit`);
	return res.data;
};
