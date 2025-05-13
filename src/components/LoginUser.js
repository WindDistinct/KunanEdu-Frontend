import React, { useState } from 'react';
import '../styles/LoginUser.css';


export default function LoginUser({ onLoginCorrecto}) {

    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [mensaje, setMensaje] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
    
        // Aca estoy colocando solo para comprobar, aqui deberia ir el fetch del rest para la validacion en la BD
        const usuarios = [
          { usuario: 'admin', password: '1234' },
          { usuario: 'profesor', password: 'abcd' },
        ];
        //////////////////////////////////////////////////////////////////////////////////////////////////////////
    
        const encontrado = usuarios.find(
          u => u.usuario === usuario && u.password === password
        );
    
        if (encontrado) {
          setMensaje('Bienvenido!');
          onLoginCorrecto();
        } else {
          setMensaje('Datos incorrectos, intente nuevamente.');
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
  )
}
