import React from 'react';
import { BrowserRouter, HashRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Publicaties from './pages/Publicaties';
import NotFound from './pages/NotFound';
import './App.css';

// Use HashRouter if environment variable is set, otherwise use BrowserRouter
// Set REACT_APP_USE_HASH_ROUTER=true if your hosting doesn't support server-side redirects
const Router = process.env.REACT_APP_USE_HASH_ROUTER === 'true' ? HashRouter : BrowserRouter;

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/publicaties" element={<Publicaties />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

