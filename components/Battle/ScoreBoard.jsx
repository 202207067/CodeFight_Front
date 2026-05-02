import React from 'react';

export default function ScoreBoard() {
  // 임시 참가자 데이터
  const players = [
    { id: 1, name: '현서 (나)', score: 0, isMe: true },
    { id: 2, name: '도안팀장님', score: 0, isMe: false },
    { id: 3, name: '자바깎는노인', score: 0, isMe: false },
  ];

  return (
    <div style={styles.rightPanel}>
      {/* 점수판 영역 */}
      <div style={styles.scoreboard}>
        <div style={styles.panelTitle}>점수판</div>
        <div style={styles.scoreList}>
          {players.map(p => (
            <div key={p.id} style={{...styles.scoreRow, border: p.isMe ? '1px solid #20c997' : '1px solid #333', backgroundColor: p.isMe ? '#1a2520' : '#111'}}>
              <div style={styles.userIcon}>👾</div>
              <div style={styles.userInfo}>
                <span style={{ fontSize: '13px', color: p.isMe ? '#20c997' : '#fff', fontWeight: p.isMe ? 'bold' : 'normal' }}>{p.name}</span>
                <span style={{ fontSize: '13px', color: '#ffc107', fontWeight: 'bold' }}>{p.score}점</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 힌트 버튼 */}
      <button style={styles.hintBtn}>💡 힌트 사용하기 (남은 횟수: 3)</button>
    </div>
  );
}

const styles = {
  rightPanel: { flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' },
  scoreboard: { flex: 1, border: '1px solid #333', borderRadius: '8px', display: 'flex', flexDirection: 'column', backgroundColor: '#151515', overflow: 'hidden' },
  panelTitle: { textAlign: 'center', padding: '15px', borderBottom: '1px solid #333', color: '#fff', fontWeight: 'bold', backgroundColor: '#111' },
  scoreList: { flex: 1, overflowY: 'auto', padding: '15px', display: 'flex', flexDirection: 'column', gap: '10px' },
  scoreRow: { display: 'flex', alignItems: 'center', borderRadius: '6px', padding: '8px' },
  userIcon: { width: '32px', height: '32px', backgroundColor: '#222', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '10px' },
  userInfo: { flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  hintBtn: { height: '60px', border: '1px solid #20c997', borderRadius: '8px', backgroundColor: '#152520', color: '#20c997', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 0 10px rgba(32, 201, 151, 0.2)' },
};