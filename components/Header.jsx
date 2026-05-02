import React from 'react';

function Header({ timeLeft }) {
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <header style={styles.header}>
      <div>
        <span style={styles.subTitle}>GRADUATION PROJECT - ROUND 01</span>
        <h2 style={styles.mainTitle}>두 수의 합 변형</h2>
        <p style={styles.desc}>nums = [2, 7, 11, 15], target = 9 | 출력: [0, 1]</p>
      </div>
      <div style={styles.rightInfo}>
        <div style={styles.timerBadge}>
          <span style={styles.timerIcon}>⏰</span>
          <span style={styles.timerText}>{formatTime(timeLeft)}</span>
        </div>
        <div style={styles.langBadge}>Python</div>
      </div>
    </header>
  );
}

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 40px', backgroundColor: '#0f0f0f', borderBottom: '1px solid #333', fontFamily: '"Inter", sans-serif' },
  subTitle: { color: '#007bff', fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '3px', textTransform: 'uppercase' },
  mainTitle: { margin: '0 0 3px 0', fontSize: '22px', fontWeight: 'bold', color: '#f8f9fa' },
  desc: { color: '#888', fontSize: '13px', margin: 0, fontFamily: '"Fira Code", monospace' },
  rightInfo: { display: 'flex', gap: '15px', alignItems: 'center' },
  timerBadge: { backgroundColor: '#1e1e1e', color: 'white', padding: '10px 25px', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: 'inset 0 0 10px rgba(255,0,0,0.2)' },
  timerText: { fontSize: '22px', fontWeight: 'bold', color: '#ff4d4d', fontFamily: '"Fira Code", monospace' },
  langBadge: { backgroundColor: '#2e2e2e', color: '#fff', padding: '8px 15px', borderRadius: '5px', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase' }
};

export default Header;