import React, { useEffect, useState } from "react";
import { crearAula, actualizarAula } from "../../api/aulaService";
import '../../styles/Botones.css';
import '../../styles/inputs.css';
import '../../styles/Notificacion.css';

export default function FormularioAula({ onExito, initialData }) {
  const [form, setForm] = useState({
    numero_aula: "",
    aforo: "",
    ubicacion: "",
    estado: true,  
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let nuevoValor = value;

    if (type === "checkbox") {
      nuevoValor = checked;
    } else if (name === "numero_aula" || name === "aforo") { 
      nuevoValor = value.replace(/\s+/g, "");
    } else { 
      nuevoValor = value.trimStart();
    }
    setForm((prev) => ({ ...prev, [name]: nuevoValor }));
  };

  const validarFormulario = () => {
    const { numero_aula, aforo, ubicacion } = form;
    if (!numero_aula || !aforo || !ubicacion) {
      return "Todos los campos son obligatorios";
    }
    if (!/^\d+$/.test(numero_aula)) {
      return "Introduce un número válido para el número de aula";
    }
    if (!/^\d+$/.test(String(aforo))) {
    return "Introduce un número válido para el aforo";
	}

	if (parseInt(aforo, 10) <= 20) {
		return "El aforo debe ser mayor a 20";
	}
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const errorValidacion = validarFormulario();
    if (errorValidacion) {
      setError(errorValidacion);
      return;
    }

    const datos = {
      ...form,
      numero_aula: String(form.numero_aula).trim(),
      aforo: String(form.aforo).trim(),
      ubicacion: String(form.ubicacion).trim(),
      estado: form.estado,  
    };

    try {
      if (form.id_aula) {
        await actualizarAula(form.id_aula, datos);
        onExito("Aula actualizada con éxito");
      } else {
        await crearAula(datos);
        onExito("Aula registrada con éxito");
      }

      setForm({
        numero_aula: "",
        aforo: "",
        ubicacion: "",
        estado: true,
      });
    } catch (err) {
      setError("Error al guardar. Verifique que el número de aula no esté duplicado");
    }
  };

  const handleCancelar = () => {
    setForm({
      numero_aula: "",
      aforo: "",
      ubicacion: "",
      estado: true,
    });
    onExito(null);
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      {error && <div className="error grid2">{error}</div>}

      <input
        name="numero_aula"
        placeholder="Número de Aula"
        className="input-form"
        value={form.numero_aula}
        onChange={handleChange}
        maxLength={3}
        inputMode="numeric"
      />

      <input
        name="aforo"
        placeholder="Aforo"
        className="input-form"
        value={form.aforo}
        onChange={handleChange}
        maxLength={2}
        inputMode="numeric"
      />

      <select
        name="ubicacion"
        className="input-form"
        value={form.ubicacion}
        onChange={handleChange}
      >
        <option value="" disabled>Ubicación</option>
        <option value="Primer Piso">Primer Piso</option>
        <option value="Segundo Piso">Segundo Piso</option>
        <option value="Tercer Piso">Tercer Piso</option>
      </select>

      <label className="checkbox-label">
        <input
          type="checkbox"
          name="estado"
          checked={!!form.estado}
          onChange={handleChange}
        />
        Activo
      </label>

      <div className="grid2">
        <button type="submit" className="aceptar-button">
          {form.id_aula ? "Actualizar" : "Registrar"} Aula
        </button>

        <button type="button" className="cancelar-button" onClick={handleCancelar}>
          Cancelar
        </button>
      </div>
    </form>
  );
}