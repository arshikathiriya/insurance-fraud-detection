import React from 'react';
import ReactDOM from 'react-dom/client';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import './assets/styles/global.css';
import './assets/styles/layout.css';
import './assets/styles/dashboard.css';
import './assets/styles/prediction.css';
import './assets/styles/history.css'; 
import './assets/styles/model-insights.css';
import './assets/styles/about.css'; 

import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);