import logo from './logo.svg';
import './App.css';
import LoginUser from './components/LoginUser';
import VentanaPrincipal from './components/VentanaPrincipal';
import { useState } from 'react';

function App() {

  const [autenticado, setAutenticado] = useState(false);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">KunanEdu</h1>
      </header>
      <main className="App-main">
      {autenticado
        ? <VentanaPrincipal />
        : <LoginUser onLoginCorrecto={() => setAutenticado(true)} />}
      </main>
    </div>
  );
}

export default App;
