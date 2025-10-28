import React from 'react';
import './styles/global.css';
import { Routes , Route } from "react-router-dom";
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';
import FinishGamePage from './pages/FinishGamePage';
import PauseGamePage from './pages/PauseGamePage';
function App() {
  return (
    <div className='flex flex-col h-[100vh] items-center justify-around'>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/game-page/:level/:type" element={<GamePage/>}/>
        <Route path="/game-page/pause" element={<PauseGamePage/>}/>
        <Route path="/game-page/:finish" element={<FinishGamePage />}/>
      </Routes>
    </div>
  );
}

export default App;
