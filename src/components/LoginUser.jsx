import React, { useState } from 'react';
import { usuarioService } from '../api/requestApi';

export default function LoginUser({ onLoginCorrecto }) {
	const [usuario, setUsuario] = useState('');
	const [password, setPassword] = useState('');
	const [mensaje, setMensaje] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const data = await usuarioService.login({ username: usuario, password }); 
			localStorage.setItem("token", data.token);
			localStorage.setItem("rol", data.rol);
			localStorage.setItem("id_usuario", data.usuario);
			setMensaje("Bienvenido!");
			onLoginCorrecto();
		} catch (error) {
			setMensaje("Usuario o contraseña incorrectos");
		}
	};

	return (
		<div className="flex justify-center items-center min-h-screen ">
			<div className="card w-full max-w-sm bg-base-100 shadow-xl p-6">
				<h3 className="text-2xl font-bold text-center mb-4">Iniciar Sesión</h3>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="form-control">
						<label htmlFor="usuario" className="label">
							<span className="label-text">Usuario</span>
						</label>
						<input
							type="text"
							id="usuario"
							className="input input-bordered"
							value={usuario}
							onChange={e => setUsuario(e.target.value)}
							required
						/>
					</div>
					<div className="form-control">
						<label htmlFor="password" className="label">
							<span className="label-text">Contraseña</span>
						</label>
						<input
							type="password"
							id="password"
							className="input input-bordered"
							value={password}
							onChange={e => setPassword(e.target.value)}
							required
						/>
					</div>
					<div className="form-control mt-4">
						<button type="submit" className="btn btn-primary w-full">Ingresar</button>
					</div>
				</form>
				{mensaje && (
					<div className="alert alert-info mt-4 text-sm text-center">
						{mensaje}
					</div>
				)}
			</div>
		</div>
	);
}