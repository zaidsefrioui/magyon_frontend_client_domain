import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // Eğer CSS dosyanız varsa
import App from './App.jsx'; // App.js veya App.jsx dosyasını içeri aktarıyor

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);