import React, { useState } from 'react';

export default function LobbyHeader() {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <header style={styles.header}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
        <h1 style={{ margin: 0, fontSize: '20px', color: '#fff', letterSpacing: '2px' }}>CODING FIGHTS</h1>
        <nav style={styles.navMenu}>
          <span style={styles.activeMenu}>방 목록</span>
          <span>명예의 전당</span>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }} onMouseEnter={() => setShowHelp(true)} onMouseLeave={() => setShowHelp(false)}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'help' }}>게임 도움말 <div style={styles.helpIcon}>?</div></span>
            {showHelp && (
              <div style={styles.tooltip}>티어는 랭크 모드 결과를 통해 정해집니다.</div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

const styles = {
  header: { display: 'flex', padding: '0 30px', height: '60px', backgroundColor: '#1a1a1a', borderBottom: '2px solid #333' },
  navMenu: { display: 'flex', gap: '25px', color: '#888', fontWeight: 'bold', alignItems: 'center' },
  activeMenu: { color: '#20c997', borderBottom: '2px solid #20c997', paddingBottom: '18px', paddingTop: '20px', cursor: 'pointer' },
  helpIcon: { display: 'flex', justifyContent: 'center', alignItems: 'center', width: '16px', height: '16px', borderRadius: '50%', border: '1px solid #888', fontSize: '11px' },
  tooltip: { position: 'absolute', top: '35px', width: '250px', backgroundColor: '#111', border: '1px solid #444', borderRadius: '8px', padding: '15px', color: '#fff', fontSize: '12px', zIndex: 100 }
};