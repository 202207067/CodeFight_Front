import React, { useState } from 'react';
import Lobby from './components/Lobby/Lobby';
import Battle from './components/Battle/Battle';
import GameOver from './components/Result/GameOver';
import Result from './components/Result/Result';
import PracticeMode from './components/Practice/PracticeMode'; 
import WaitingRoom from './components/Room/WaitingRoom'; 

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('lobby');
  
  // 🌟 현재 입장한 방의 데이터를 저장하는 상태
  const [currentRoom, setCurrentRoom] = useState(null);

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#0f0f0f' }}>
      
      {currentScreen === 'lobby' && (
        <Lobby 
          // 🌟 방에 입장할 때 방 데이터(roomData)를 받아서 저장하고 대기실로 이동
          onJoinRoom={(roomData) => {
            setCurrentRoom(roomData);
            setCurrentScreen('waiting');
          }} 
          onStartPractice={() => setCurrentScreen('practice')} 
        />
      )}

      {currentScreen === 'waiting' && (
        <WaitingRoom 
          roomData={currentRoom} // 🌟 대기실에 방 데이터 전달
          onStartBattle={() => setCurrentScreen('battle')} 
          onLeaveRoom={() => setCurrentScreen('lobby')} 
        />
      )}

      {currentScreen === 'practice' && <PracticeMode onExit={() => setCurrentScreen('lobby')} />}
      
      {currentScreen === 'battle' && (
        <Battle 
          roomData={currentRoom} // 🌟 배틀창에 방 데이터 전달
          onExit={() => setCurrentScreen('gameover')} 
        />
      )}
      
      {currentScreen === 'gameover' && <GameOver onFinish={() => setCurrentScreen('result')} />}
      {currentScreen === 'result' && <Result onReturnLobby={() => setCurrentScreen('lobby')} />}
      
    </div>
  );
}