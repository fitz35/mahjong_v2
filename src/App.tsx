import React from 'react';
import logo from "./logo.png"
import './css/output.css';
import { NavLink, Outlet } from 'react-router-dom';

function App() {
  return (
    <div className="App bg-pageBase text-white h-screen">
      <header className='bg-pageDark items-center h-16 flex'>
        <img className="h-16" src={logo} alt="Logo" />
        <h1 className="flex-1 object-left text-3xl font-bold underline">Mahjong</h1>
        <nav className='flex-1 object-right text-right text-3xl'>
          <NavLink className={({ isActive }) => isActive ? "bg-pageVeryDark" : "hover:bg-pageVeryDark"} to="/">Calculateur</NavLink> |{" "}
          <NavLink className={({ isActive }) => isActive ? "bg-pageVeryDark" : "hover:bg-pageVeryDark"} to="/regles">Régles</NavLink> |{" "}
          <NavLink className={({ isActive }) => isActive ? "bg-pageVeryDark" : "hover:bg-pageVeryDark"} to="/jouer">Jouer</NavLink>
        </nav>
      </header>
      <Outlet />
    </div>
  );
}

export default App;
