import React from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom';
import './App.css'; 

import Map from "./api/Map"
import Detail from './components/Detail';
import Start from './components/Start';

function App() {
  return (
    <HashRouter basename='/RamenDoko'>
      <Routes>
          <Route path='/' element={<Start />} />
          <Route path='/map' element={<Map />} />
          <Route path='/detail' element={<Detail />} />
       </Routes>
    </HashRouter>
    
  );
}

export default App;
