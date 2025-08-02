// src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Dashboard from './components/AdminPanel';

function App() {
  return (
    
      <Routes>
        {/* Admin Routes */}
        <Route path="/" element={<Dashboard/>}></Route>
        
        {/* Add other routes as needed */}
      </Routes>
  );
}

export default App;