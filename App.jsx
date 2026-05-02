import React, { useState, useEffect } from 'react';
import './index.css';

// 우리가 만든 3개의 큰 화면 부품들
import Lobby from './components/Lobby';
import Header from './components/Header';
import MyCodeSection from './components/MyCodeSection';
import OpponentSection from './components/OpponentSection';
import Result from './components/Result';

function App() {
  // 현재 어떤 화면을 보여줄지 결정하는 State ('lobby', 'battle', 'result' 3가지 상태)
  const [currentScreen, setCurrentScreen] = useState('lobby');
  
  // 배틀 화면용 State
  const [timeLeft, setTimeLeft] = useState(2601); 
  const [userCode, setUserCode] = useState('def sum_of_two(nums, target):\n    pass');

  useEffect(() => {
    // 폰트 주입
    const linkNode = document.createElement('link');
    linkNode.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Fira+Code&display=swap';
    linkNode.rel = 'stylesheet';
    document.head.appendChild(linkNode);

    // 타이머 (배틀 화면일 때만)
    let timer;
    if (currentScreen === 'battle') {
      timer = setInterval(() => setTimeLeft(t => t > 0 ? t - 1 : 0), 1000);
    }
    return () => clearInterval(timer);
  }, [currentScreen]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f0f0f' }}>
      
      {/* 1. 로비 화면 */}
      {currentScreen === 'lobby' && (
        <Lobby onStartBattle={() => setCurrentScreen('battle')} />
      )}

      {/* 2. 대결 화면 */}
      {currentScreen === 'battle' && (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
    <Header timeLeft={timeLeft} />
    <main style={{ display: 'flex', gap: '20px', padding: '20px', flex: 1, overflow: 'hidden' }}>
      
      {/* 바로 여기! onCodeSubmit이라는 통로로 명령을 내려보내야 합니다 */}
      <MyCodeSection 
        code={userCode} 
        onCodeChange={setUserCode} 
        onCodeSubmit={() => setCurrentScreen('result')} 
      />
      
      <OpponentSection />
    </main>
  </div>
)}

      {/* 3. 결과 화면 */}
      {currentScreen === 'result' && (
        <Result onGoLobby={() => setCurrentScreen('lobby')} />
      )}

    </div>
  );
}

export default App;