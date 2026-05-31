import React, { useState } from 'react';
import LobbyPage from './pages/LobbyPage';
import WaitingRoomPage from './pages/WaitingRoomPage';
import BattlePage from './pages/BattlePage';
import ResultPage from './pages/ResultPage';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('lobby');
  const [currentRoom, setCurrentRoom] = useState(null);
  const [finalResults, setFinalResults] = useState([]);

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
          onShowResult={(resultsData) => {
            setFinalResults(resultsData);
            setCurrentScreen('result');
          }}
        />
      )}

      {currentScreen === 'result' && (
        <ResultPage 
          gameResults={finalResults} 
          onGoToLobby={() => setCurrentScreen('lobby')} 
        />
      )}
      
    </div>
  );
}