import axiosInstance from "./axiosInstance";

export const obtenerSeccionAd = async () => {
	const res = await axiosInstance.get(`/api/seccion/all-adm`);
	return res.data;
};
export const obtenerSeccion = async () => {
	const res = await axiosInstance.get(`/api/seccion/all`);
	return res.data;
};

export const crearSeccion = async (data) => {
	const res = await axiosInstance.post(`/api/seccion/create`, data);
	return res.data;
};

export const actualizarSeccion = async (id, data) => {
	const res = await axiosInstance.put(`/api/seccion/update/${id}`, data);
	return res.data;
};

export const eliminarSeccion = async (id) => {
	const res = await axiosInstance.delete(`/api/seccion/delete/${id}`);
	return res.data;
};

export const auditoriaSeccion = async (id) => {
	const res = await axiosInstance.get(`/api/seccion/all-audit`);
	return res.data;
};
