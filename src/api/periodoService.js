import axiosInstance from "./axiosInstance";

export const obtenerPeriodosAd = async () => {
	const res = await axiosInstance.get(`/api/periodo/all-adm`);
	return res.data;
};
export const obtenerPeriodos = async () => {
	const res = await axiosInstance.get(`/api/periodo/all`);
	return res.data;
};

export const crearPeriodo = async (data) => {
	const res = await axiosInstance.post(`/api/periodo/create`, data);
	return res.data;
};

export const actualizarPeriodo = async (id, data) => {
	const res = await axiosInstance.put(`/api/periodo/update/${id}`, data);
	return res.data;
};

export const eliminarPeriodo = async (id) => {
	const res = await axiosInstance.delete(`/api/periodo/delete/${id}`);
	return res.data;
};

export const auditoriaPeriodo = async () => {
	const res = await axiosInstance.get(`/api/periodo/all-audit`);
	return res.data;
};