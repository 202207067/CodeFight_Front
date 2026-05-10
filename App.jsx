import React, { useState } from 'react';
import Lobby from './components/Lobby/Lobby';
import Battle from './components/Battle/Battle';
import WaitingRoom from './components/Room/WaitingRoom';
// 🌟 방금 만든 GameOver 컴포넌트 임포트! (경로는 실제 파일 위치에 맞게 조정하세요)
import GameOver from './components/Result/GameOver'; 

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('lobby');
  const [currentRoom, setCurrentRoom] = useState(null);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#0f0f0f', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
      
      {currentScreen === 'lobby' && (
        <Lobby 
          onJoinRoom={(roomData) => {
            setCurrentRoom(roomData);
            setCurrentScreen('waiting');
          }} 
          onStartPractice={() => setCurrentScreen('battle')} 
        />
      )}

      {currentScreen === 'waiting' && (
        <WaitingRoom 
          roomData={currentRoom} 
          onStartBattle={() => setCurrentScreen('battle')} 
          onLeaveRoom={() => setCurrentScreen('lobby')} 
        />
      )}

      {currentScreen === 'battle' && (
        <Battle 
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