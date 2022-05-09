import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter,Routes,Route, } from "react-router-dom";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Calculator from './routes/calculator';
import Rules from './routes/rules';
import Play from './routes/play';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="calculateur" element={<Calculator />} />
        <Route path="regles" element={<Rules />} />
        <Route path="jouer" element={<Play />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
