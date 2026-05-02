import React from 'react';
import MyCodeSection from './MyCodeSection';
import OpponentSection from './OpponentSection';
import ScoreBoard from './ScoreBoard';
import BattleFooter from './BattleFooter';

export default function Battle({ onExit }) {
  return (
    <div style={styles.container}>
      {/* 상단 3분할 영역 (내 코드 / 상대 코드 / 점수판) */}
      <div style={styles.mainTop}>
        <MyCodeSection />
        <OpponentSection />
        <ScoreBoard />
      </div>

      {/* 하단 진행바 및 버튼 영역 */}
      <BattleFooter onExit={onExit} />
    </div>
  );
}

const styles = {
  container: { 
    display: 'flex', 
    flexDirection: 'column', 
    height: '100vh', 
    backgroundColor: '#0f0f0f', 
    padding: '20px', 
    gap: '20px',
    boxSizing: 'border-box',
    fontFamily: '"Inter", sans-serif'
  },
  mainTop: { 
    display: 'flex', 
    gap: '20px', 
    flex: 1, 
    minHeight: 0 
  }
};