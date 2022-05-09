import './App.css';
import { Link, Outlet } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        Bienvenue sur ce jeu de majhong
        <nav>
          <Link to="/calculateur">Calculateur</Link> |{" "}
          <Link to="/regles">Régles du jeu</Link> |{" "}
          <Link to="/jouer">Jouer</Link>
        </nav>
      </header>
      <Outlet />
    </div>
  );
}

export default App;
