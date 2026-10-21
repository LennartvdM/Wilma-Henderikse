import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Publicaties from './pages/Publicaties';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="publicaties" element={<Publicaties />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
