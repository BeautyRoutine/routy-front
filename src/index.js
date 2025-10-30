import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// 🔹 HashRouter 추가
import { HashRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* 🔹 BrowserRouter 대신 HashRouter로 감싸기 */}
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
);

reportWebVitals();
