import React, { useState } from 'react';
import Lobby from './components/Lobby/Lobby';
import Battle from './components/Battle/Battle';
import WaitingRoom from './components/Room/WaitingRoom';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('lobby');
  const [currentRoom, setCurrentRoom] = useState(null);

  return (
    // 🌟 100vw를 완전히 삭제하고, 예전에 성공했던 절대 좌표 방식으로 돌려놓았습니다!
    // 이제 화면이 오른쪽으로 밀리지 않고 모니터 정중앙에 1280x800 사이즈로 완벽하게 꽂힙니다.
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
        />
      )}
      
    </div>
  );
}