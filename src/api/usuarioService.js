import axiosInstance from "./axiosInstance";

export const obtenerUsuariosAd = async () => {
	const res = await axiosInstance.get(`/api/usuario/all-adm`);
	return res.data;
};
export const obtenerUsuarios = async () => {
	const res = await axiosInstance.get(`/api/usuario/all`);
	return res.data;
};

export const crearUsuario = async (data) => {
	const res = await axiosInstance.post(`/api/usuario/create`, data);
	return res.data;
};

export const actualizarUsuario = async (id, data) => {
	const res = await axiosInstance.put(`/api/usuario/update/${id}`, data);
	return res.data;
};

export const eliminarUsuario = async (id) => {
	const res = await axiosInstance.delete(`/api/usuario/delete/${id}`);
	return res.data;
};

export const auditoriaUsuario = async () => {
	const res = await axiosInstance.get(`/api/usuario/all-audit`);
	return res.data;
};