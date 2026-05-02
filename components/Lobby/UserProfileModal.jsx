import React from 'react';

export default function UserProfileModal({ user, onClose }) {
  if (!user) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.box} onClick={e => e.stopPropagation()}>
        <div style={styles.banner}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{...styles.tierIcon, borderColor: '#fff', backgroundColor: user.tierColor}}>
              {user.tier === 'Gold' ? '🏆' : '🥈'}
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '24px', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
                {user.name} {user.isMe && <span style={styles.badge}>본인</span>}
              </h2>
              <div style={{ color: user.tierColor, fontWeight: 'bold', fontSize: '14px', marginTop: '5px' }}>{user.tier} Division</div>
            </div>
          </div>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div style={styles.summaryRow}>
          <div style={styles.summaryItem}><span style={styles.label}>통합 경험치</span><span style={styles.value}>1,450,210 EXP</span></div>
          <div style={styles.summaryItem}><span style={styles.label}>통합 랭킹</span><span style={styles.value}>상위 12.5%</span></div>
        </div>
        <div style={styles.statsGrid}>
          <div style={styles.statSection}>
            <div style={styles.statHeader}>| 전체 전적</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ color: '#ffc107', fontSize: '13px', fontWeight: 'bold' }}>누적 승률</span>
              <div style={{ textAlign: 'right' }}><div style={{ color: '#fff', fontWeight: 'bold' }}>56.5%</div></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#ffc107', fontSize: '13px', fontWeight: 'bold' }}>정답 적중률</span>
              <div style={{ textAlign: 'right' }}><div style={{ color: '#20c997', fontWeight: 'bold' }}>72.8%</div></div>
            </div>
          </div>
          <div style={styles.statSection}>
            <div style={styles.statHeader}>| 최근 동향 및 언어</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ color: '#ffc107', fontSize: '13px', fontWeight: 'bold' }}>평균 실행 속도</span><span style={{ color: '#fff' }}>145 ms</span>
            </div>
            <div style={styles.langBarBox}>
              <span style={{ color: '#aaa', fontSize: '12px', width: '50px' }}>Python</span>
              <div style={styles.barBg}><div style={{ width: '70%', backgroundColor: '#0d6efd', height: '100%' }}></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  box: { backgroundColor: '#151515', border: '1px solid #333', borderRadius: '8px', width: '550px', overflow: 'hidden' },
  banner: { background: 'linear-gradient(90deg, #111 0%, #222 100%)', padding: '20px', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between' },
  tierIcon: { width: '60px', height: '60px', borderRadius: '10px', border: '2px solid', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '24px' },
  closeBtn: { background: 'none', border: 'none', color: '#888', fontSize: '20px', cursor: 'pointer', alignSelf: 'flex-start' },
  badge: { fontSize: '10px', color: '#20c997', border: '1px solid #20c997', padding: '2px 5px', borderRadius: '3px' },
  summaryRow: { display: 'flex', borderBottom: '1px solid #2a2a2a', backgroundColor: '#1a1a1a' },
  summaryItem: { flex: 1, padding: '15px', display: 'flex', justifyContent: 'space-between', borderRight: '1px solid #2a2a2a' },
  label: { color: '#888', fontSize: '13px', fontWeight: 'bold' },
  value: { color: '#fff', fontSize: '14px', fontFamily: 'monospace' },
  statsGrid: { display: 'flex' },
  statSection: { flex: 1, padding: '20px', borderRight: '1px solid #2a2a2a' },
  statHeader: { color: '#aaa', fontSize: '13px', fontWeight: 'bold', marginBottom: '15px' },
  langBarBox: { display: 'flex', alignItems: 'center', gap: '10px' },
  barBg: { flex: 1, backgroundColor: '#222', height: '8px', borderRadius: '4px', overflow: 'hidden' }
};