export default function App() {
  const [currentScreen, setCurrentScreen] = useState('lobby');
  const [currentRoom, setCurrentRoom] = useState(null);
  const [finalResults, setFinalResults] = useState([]); // 결과 데이터 보관용

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
            // 🌟 배틀 끝날 때 받은 데이터를 상태에 저장하고 결과창으로 이동
            setFinalResults(resultsData);
            setCurrentScreen('result');
          }}
        />
      )}

      {/* 🌟 결과창 렌더링 추가 */}
      {currentScreen === 'result' && (
        <ResultPage 
          gameResults={finalResults} 
          onGoToLobby={() => setCurrentScreen('lobby')} 
        />
      )}
      
    </div>
  );
}