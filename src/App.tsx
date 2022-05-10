import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Link, Outlet } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Mahjong</h1>
        <nav>
          <Link to="/calculator">Calculateur</Link> |{" "}
          <Link to="/regles">Régles</Link> |{" "}
          <Link to="/jouer">Jouer</Link>
        </nav>
      </header>
      <Outlet />
    </div>
  );
}

export default App;
