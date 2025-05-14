import React from "react";

export default function Notificacion({ mensaje, tipo }) {
	if (!mensaje) return null;
	return (
		<div
			className={`p-2 rounded mb-4 ${tipo === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
		>
			{mensaje}
		</div>
	);
}
