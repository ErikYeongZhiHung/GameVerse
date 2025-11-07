import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavRoutes from './Routes/NavRoutes';

function App() {
  return (
    <Router>
      <Routes>
        {NavRoutes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>
    </Router>
  );
}

export default App;