import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Toaster } from 'react-hot-toast';
import './styles/cursores.css'; // <--- Importante para que el :root se cargue

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Toaster 
      position="top-right" 
      toastOptions={{
        style: { zIndex: 99999 } 
      }} 
    />
    <App />
  </React.StrictMode>
);