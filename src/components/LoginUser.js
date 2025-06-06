import React, { useState } from 'react';
import '../styles/LoginUser.css';
import { loginUsuario } from '../api/authService'; // ajusta ruta si es necesario

export default function LoginUser({ onLoginCorrecto }) {
	const [usuario, setUsuario] = useState('');
	const [password, setPassword] = useState('');
	const [mensaje, setMensaje] = useState('');
  
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const data = await loginUsuario({ username: usuario, password });
    localStorage.setItem("token", data.token);  
	localStorage.setItem("rol", data.rol); 
    setMensaje("Bienvenido!");
    onLoginCorrecto();
  } catch (error) {
    setMensaje(error.toString());
  }
};


	return (
		<div className="login-container">
			<h2>Iniciar Sesión</h2>
			<form onSubmit={handleSubmit}>
				<label>
					<h4>Usuario</h4>
					<input
						type="text"
						value={usuario}
						onChange={e => setUsuario(e.target.value)}
						required
					/>
				</label>
				<br />
				<br />
				<label>
					<h4>Contraseña</h4>
					<input
						type="password"
						value={password}
						onChange={e => setPassword(e.target.value)}
						required
					/>
				</label>
				<br />
				<br />
				<button type="submit">Ingresar</button>
			</form>
			{mensaje && <p>{mensaje}</p>}
		</div>
	);
}
