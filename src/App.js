import React, { useState } from 'react';
import './App.css';
import ImageProcessor from './components/ImageProcessor';
import JokeGenerator from './components/JokeGenerator';

function App() {
  const [currentPage, setCurrentPage] = useState('image'); // 'image' or 'joke'

  return (
    <div className="App">
      <nav className="navigation">
        <button 
          className={`nav-btn ${currentPage === 'image' ? 'active' : ''}`}
          onClick={() => setCurrentPage('image')}
        >
          🖼️ 图片处理器
        </button>
        <button 
          className={`nav-btn ${currentPage === 'joke' ? 'active' : ''}`}
          onClick={() => setCurrentPage('joke')}
        >
          😂 笑话生成器
        </button>
      </nav>

      <div className="page-content">
        {currentPage === 'image' ? <ImageProcessor /> : <JokeGenerator />}
      </div>
    </div>
  );
}

export default App;
