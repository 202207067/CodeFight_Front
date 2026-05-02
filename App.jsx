import React, { useState } from 'react';

// 우리가 만든 3개 폴더의 메인 컴포넌트들
import Lobby from './components/Lobby/Lobby';
import Battle from './components/Battle/Battle';
import GameOver from './components/Result/GameOver';
import Result from './components/Result/Result';

export default function App() {
  // 화면 상태: 'lobby' -> 'battle' -> 'gameover' -> 'result'
  const [currentScreen, setCurrentScreen] = useState('lobby');

  return (
    <>
      {currentScreen === 'lobby' && (
        <Lobby onStartBattle={() => setCurrentScreen('battle')} />
      )}

      {currentScreen === 'battle' && (
        // 배틀 중에 나가거나 게임이 끝나면 'gameover' 창으로 넘어갑니다.
        <Battle onExit={() => setCurrentScreen('gameover')} />
      )}

      {currentScreen === 'gameover' && (
        // 3초 뒤에 자동으로 'result' 창으로 넘겨줍니다.
        <GameOver onFinish={() => setCurrentScreen('result')} />
      )}

      {currentScreen === 'result' && (
        // 결과창에서 나가기 버튼을 누르면 다시 'lobby'로 돌아갑니다.
        <Result onReturnLobby={() => setCurrentScreen('lobby')} />
      )}
    </>
  );
}