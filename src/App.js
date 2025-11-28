import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Publicaties from './pages/Publicaties';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/publicaties" element={<Publicaties />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

