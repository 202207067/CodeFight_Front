import React from 'react';

function OpponentSection() {
  return (
    <section style={styles.container}>
      {/* 딥 블랙 헤더 */}
      <div style={styles.cardHeader}>
        <span style={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '12px' }}>Live Opponent</span>
        <span style={styles.badge}>Hacking...</span>
      </div>

      {/* 블러/로딩 영역 */}
      <div style={styles.blurredArea}>
        {/* 네온 시안 스피너 */}
        <div style={styles.spinner}></div>
        <h4 style={{ fontWeight: 'bold', marginTop: '20px', color: '#f8f9fa' }}>실시간 코드 분석 중</h4>
        <p style={{ color: '#888', fontSize: '13px' }}>상대방의 개인 화면은 블러 처리됨</p>
      </div>

      {/* 하단 연결 상태 바 */}
      <div style={styles.statusBar}>
        <span style={{ color: '#20c997' }}>● 연결됨</span> &nbsp;&nbsp;|&nbsp;&nbsp; 지연속도: 15ms &nbsp;&nbsp;|&nbsp;&nbsp; 동기화 중
      </div>
    </section>
  );
}

const styles = {
  container: { flex: 1, backgroundColor: '#1e1e1e', borderRadius: '8px', border: '1px solid #333', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', fontFamily: '"Inter", sans-serif' },
  cardHeader: { backgroundColor: '#121212', color: 'white', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333' },
  badge: { backgroundColor: '#ff4d4d', color: 'white', padding: '3px 12px', borderRadius: '15px', fontSize: '11px', fontWeight: 'bold', animation: 'pulse 1s linear infinite' },
  blurredArea: { flex: 1, backgroundColor: '#121212', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative' },
  spinner: { width: '40px', height: '40px', border: '4px solid #2e2e2e', borderTop: '4px solid #20c997', borderRadius: '50%', animation: 'spin 1s linear infinite', boxShadow: '0 0 10px rgba(32,201,151,0.5)' },
  statusBar: { backgroundColor: '#121212', color: '#888', padding: '15px 20px', fontSize: '12px', textAlign: 'center', borderTop: '1px solid #333' }
};

// 스피너 및 뱃지 애니메이션을 위한 CSS 주입
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(255,77,77,0.7); } 70% { box-shadow: 0 0 0 10px rgba(255,77,77,0); } 100% { box-shadow: 0 0 0 0 rgba(255,77,77,0); } }
`;
document.head.appendChild(styleSheet);

export default OpponentSection;