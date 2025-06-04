import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL + "/api/usuario";

export const loginUsuario = async ({ username, password }) => {
  try {
    const res = await axios.post(`${baseURL}/login`, { username, password });
    return res.data; // Aquí esperas que venga token y demás datos
  } catch (error) {
    throw error.response?.data?.message || "Error en login";
  }
};
