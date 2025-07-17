import React, { useState, useEffect } from "react";

export default function FiltroTabla({ datos, clavesFiltro = [], onFiltrar, placeholder = "Buscar...", texto, setTexto }) {
  const [inputInterno, setInputInterno] = useState("");

  const textoActual = texto !== undefined ? texto : inputInterno;
  const cambiarTexto = setTexto || setInputInterno;

  useEffect(() => {
    const textoNormalizado = textoActual.toLowerCase();

    const filtrados = datos.filter((item) =>
      clavesFiltro.some((clave) =>
        (item[clave] || "")
          .toString()
          .toLowerCase()
          .includes(textoNormalizado)
      )
    );

    onFiltrar(textoActual ? filtrados : datos);
  }, [textoActual, datos, clavesFiltro, onFiltrar]);

  return (
    <div className="mb-4">
      <input
        type="text"
        className="input input-bordered w-full max-w-sm"
        placeholder={placeholder}
        value={textoActual}
        onChange={(e) => cambiarTexto(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
      />
    </div>
  );
}