import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard/Dashboard';
import Prediction from './pages/Prediction/Prediction'; 
import History from './pages/History/History';
import ModelInsights from './pages/ModelInsights/ModelInsights';  
import About from './pages/About/About';  


function Placeholder({ title }) {
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">{title}</h1>
          <p className="page-subtitle">
            Insurance fraud detection and analytics platform.
          </p>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<MainLayout />}>

          <Route
            path="/"
            element={<Navigate to="/dashboard" replace />}
          />

          <Route
  path="/dashboard"
  element={<Dashboard />}
/>
<Route
  path="/prediction"
  element={<Prediction />}
/>
          <Route
  path="/history"
  element={<History />}
/>

          <Route
            path="/prediction/:id"
            element={<Placeholder title="Prediction Details" />}
          />

          <Route
  path="/model-insights"
  element={<ModelInsights />}
/>

          <Route
  path="/about"
  element={<About />}
/>

          <Route
            path="*"
            element={<Navigate to="/dashboard" replace />}
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;