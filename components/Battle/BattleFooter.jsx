import React from 'react';

export default function BattleFooter({ onExit }) {
  // 눈금 배열 생성 [0, 10, 20 ... 100]
  const ticks = Array.from({ length: 11 }, (_, i) => i * 10);

  return (
    <div style={styles.footerContainer}>
      {/* 1. 프로그레스 바 영역 */}
      <div style={styles.progressSection}>
        <div style={styles.progressBarBg}>
          <div style={styles.progressBarFill}></div>
        </div>
        <div style={styles.progressTicks}>
          {ticks.map(tick => (
            <span key={tick} style={styles.tickLabel}>{tick}</span>
          ))}
        </div>
      </div>

      {/* 2. 하단 버튼 영역 */}
      <div style={styles.buttonSection}>
        <div style={styles.centerButtons}>
          <button style={styles.actionBtn}>코드 제출</button>
          <button style={styles.actionBtnSecondary}>다음 문제</button>
        </div>
        <button style={styles.exitBtn} onClick={onExit}>나가기</button>
      </div>
    </div>
  );
}

const styles = {
  footerContainer: { display: 'flex', flexDirection: 'column', gap: '20px' },
  
  // 프로그레스 바
  progressSection: { border: '1px solid #333', borderRadius: '8px', padding: '15px 20px', backgroundColor: '#151515', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  progressBarBg: { height: '12px', border: '1px solid #444', borderRadius: '6px', backgroundColor: '#111', overflow: 'hidden', position: 'relative' },
  progressBarFill: { width: '40%', height: '100%', backgroundColor: '#888', transition: 'width 0.5s' }, // 40% 진행 예시
  progressTicks: { display: 'flex', justifyContent: 'space-between', marginTop: '8px', padding: '0 2px' },
  tickLabel: { color: '#666', fontSize: '11px', fontFamily: 'monospace' },
  
  // 버튼들
  buttonSection: { display: 'flex', justifyContent: 'center', position: 'relative', alignItems: 'center' },
  centerButtons: { display: 'flex', gap: '15px' },
  actionBtn: { padding: '15px 40px', backgroundColor: '#20c997', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', boxShadow: '0 0 10px rgba(32, 201, 151, 0.3)' },
  actionBtnSecondary: { padding: '15px 40px', backgroundColor: '#2e2e2e', color: '#fff', border: '1px solid #555', borderRadius: '6px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' },
  exitBtn: { position: 'absolute', right: 0, padding: '12px 30px', backgroundColor: '#151515', color: '#ff4d4d', border: '1px solid #ff4d4d', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }
};