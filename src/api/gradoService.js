import axiosInstance from "./axiosInstance";

export const obtenerGradosAd = async () => {
	const res = await axiosInstance.get(`/api/grado/all-adm`);
	return res.data;
};
export const obtenerGrados = async () => {
	const res = await axiosInstance.get(`/api/grado/all`);
	return res.data;
};
export const crearGrado = async (data) => {
	const res = await axiosInstance.post(`/api/grado/create`, data);
	return res.data;
};

export const actualizarGrado = async (id, data) => {
	const res = await axiosInstance.put(`/api/grado/update/${id}`, data);
	return res.data;
};

export const eliminarGrado = async (id) => {
	const res = await axiosInstance.delete(`/api/grado/delete/${id}`);
	return res.data;
};

export const auditoriaGrado = async () => {
	const res = await axiosInstance.get(`/api/grado/all-audit`);
	return res.data;
};