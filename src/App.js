import "./App.css";
import logo from "./logo.svg";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginUser from "./components/LoginUser";
import MenuPrincipal from "./pages/MenuPrincipal";
import ListadoAula from "./pages/Aula/ListadoAula";
// Aquí puedes importar más entidades conforme las vayas creando

function App() {
	const [autenticado, setAutenticado] = useState(false);

	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<h1 className="App-title">KunanEdu</h1>
			</header>
			<main className="App-main">
				{autenticado ? (
					<Router>
						<Routes>
							<Route path="/" element={<MenuPrincipal />} />
							<Route path="/aulas" element={<ListadoAula />} />
							{/* Agrega aquí más rutas conforme avances */}
						</Routes>
					</Router>
				) : (
					<LoginUser onLoginCorrecto={() => setAutenticado(true)} />
				)}
			</main>
		</div>
	);
}

export default App;
