import React from 'react';
import ReactDOM from 'react-dom/client'; // Importiert die Client-Seite von ReactDOM für die Verwendung mit createRoot
import './index.css'; // Importiert die Styles für die Index-Seite
import App from './App'; // Importiert die Haupt-App-Komponente
import reportWebVitals from './reportWebVitals'; // Importiert die Funktion zur Berichterstattung über Web-Vitals

// Erstellt einen React-Root mit der Wurzel am DOM-Element mit der ID 'root'
const root = ReactDOM.createRoot(document.getElementById('root'));

// Rendert die App innerhalb eines StrictMode-Elements für zusätzliche React-Prüfungen im Entwicklungsmodus
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
