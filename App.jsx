import React, { useState } from 'react';
import LobbyPage from './pages/LobbyPage';
import WaitingRoomPage from './pages/WaitingRoomPage';
import BattlePage from './pages/BattlePage';
import ResultPage from './pages/ResultPage';
import GameOver from './components/Result/GameOver'; 

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('lobby');
  const [currentRoom, setCurrentRoom] = useState(null);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#0f0f0f', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
      
      {currentScreen === 'lobby' && (
        <LobbyPage 
          onJoinRoom={(roomData) => {
            setCurrentRoom(roomData);
            setCurrentScreen('waiting');
          }} 
          onStartPractice={() => setCurrentScreen('battle')} 
        />
      )}

      {currentScreen === 'waiting' && (
        <WaitingRoomPage
          roomData={currentRoom} 
          onStartBattle={() => setCurrentScreen('battle')} 
          onLeaveRoom={() => setCurrentScreen('lobby')} 
        />
      )}

      {currentScreen === 'battle' && (
        <BattlePage 
          roomData={currentRoom} 
          onExit={() => setCurrentScreen('lobby')} 
          onShowResult={() => setCurrentScreen('result')} 
        />
      )}

      {/* 🌟 시안과 100% 동일한 결과창 컴포넌트 연결 */}
      {currentScreen === 'result' && (
        <GameOver 
          onPlayAgain={() => setCurrentScreen('waiting')} // 다시하기 누르면 대기실로
          onExit={() => setCurrentScreen('lobby')} // 나가기 누르면 로비로
        />
      )}
      
    </div>
  );
}