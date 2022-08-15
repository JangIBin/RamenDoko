import React from 'react'
import { Route, Routes } from 'react-router-dom';
import './App.css'; 

import Map from "./api/Map"
import Detail from './components/Detail';

function App() {
  return (

    <Routes>
      <Route path='/' element={<Map />} />
      <Route path='/detail' element={<Detail />} />
    </Routes>
  );
}

export default App;
