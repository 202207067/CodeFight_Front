import React, { useState } from 'react';
import Lobby from './components/Lobby/Lobby';
import Battle from './components/Battle/Battle';
import GameOver from './components/Result/GameOver';
import Result from './components/Result/Result';
import PracticeMode from './components/Practice/PracticeMode'; 
import WaitingRoom from './components/Room/WaitingRoom'; 

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('lobby');
  const [currentRoom, setCurrentRoom] = useState(null);

  return (
    // 🌟 절대 좌표를 사용해 브라우저 기본 여백을 완벽하게 무시하고 화면을 꽉 채웁니다.
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', backgroundColor: '#0f0f0f' }}>
      
      {currentScreen === 'lobby' && (
        <Lobby 
          onJoinRoom={(roomData) => {
            setCurrentRoom(roomData);
            setCurrentScreen('waiting');
          }} 
          onStartPractice={() => setCurrentScreen('practice')} 
        />
      )}

      {currentScreen === 'waiting' && (
        <WaitingRoom 
          roomData={currentRoom} 
          onStartBattle={() => setCurrentScreen('battle')} 
          onLeaveRoom={() => setCurrentScreen('lobby')} 
        />
      )}

      {currentScreen === 'practice' && <PracticeMode onExit={() => setCurrentScreen('lobby')} />}
      
      {currentScreen === 'battle' && (
        <Battle 
          roomData={currentRoom} 
          onExit={() => setCurrentScreen('gameover')} 
        />
      )}
      
      {currentScreen === 'gameover' && <GameOver onFinish={() => setCurrentScreen('result')} />}
      {currentScreen === 'result' && <Result onReturnLobby={() => setCurrentScreen('lobby')} />}
      
    </div>
  );
}