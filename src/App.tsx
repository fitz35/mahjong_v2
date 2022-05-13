import React from 'react';
import logo from "./logo.png"
//import './css/output.css';
//import 'antd/dist/antd.css';
import './css/input.less';
import { Outlet } from 'react-router-dom';
import { CustomNavbar } from './component/navbar/CustomNavbar';

function App() {
  return (
    <div className="App bg-pageBase text-white h-screen">
      <header className='bg-pageDark items-center h-16 flex'>
        <img className="h-16" src={logo} alt="Logo" />
        <h1 className="flex-1 text-white object-left text-3xl font-bold underline">Mahjong</h1>
        <CustomNavbar></CustomNavbar>
      </header>
      <Outlet />
    </div>
  );
}

export default App;
