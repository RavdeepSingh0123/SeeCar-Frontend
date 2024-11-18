import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Home from './components/Home';
import Addcar from './components/Addcar';
import About from './components/About';
import SearchResults from './components/SearchResults';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
        <Route exact path='/login' element={<Login />} />
        <Route exact path='/' element={<Home />} />
        <Route exact path='/about' element={<About />} />
        <Route exact path='/search' element={<SearchResults />} />
        <Route exact path='/addcar' element={<Addcar />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
