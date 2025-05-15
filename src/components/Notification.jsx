import React from "react";
import '../styles/Notificacion.css';

export default function Notificacion({ mensaje, tipo }) {
	if (!mensaje) return null;
	return (
		<div
			className={`${tipo === "error" ? "error" : "success"}`}
		>
			{mensaje}
		</div>
	);
}
