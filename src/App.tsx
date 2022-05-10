import React from 'react';
import './output.css';
import { Link, Outlet } from 'react-router-dom';

function App() {
  return (
    <div className="App bg-pageBase text-white h-screen">
      <header className='bg-pageDark items-center h-16 flex'>
        <h1 className="flex-1 object-left text-3xl font-bold underline">Mahjong</h1>
        <nav className='flex-1 object-right text-right text-3xl'>
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
