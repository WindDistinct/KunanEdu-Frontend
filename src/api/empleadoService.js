import axiosInstance from "./axiosInstance";

export const obtenerEmpleadosAd = async () => {
	const res = await axiosInstance.get(`/api/empleado/all-adm`);
	return res.data;
};
export const obtenerEmpleados = async () => {
	const res = await axiosInstance.get(`/api/empleado/all`);
	return res.data;
};

export const crearEmpleado = async (data) => {
	const res = await axiosInstance.post(`/api/empleado/create`, data);
	return res.data;
};

export const actualizarEmpleado = async (id, data) => {
	const res = await axiosInstance.put(`/api/empleado/update/${id}`, data);
	return res.data;
};

export const eliminarEmpleado = async (id) => {
	const res = await axiosInstance.delete(`/api/empleado/delete/${id}`);
	return res.data;
};

export const auditoriaEmpleado = async () => {
	const res = await axiosInstance.get(`/api/empleado/all-audit`);
	return res.data;
};