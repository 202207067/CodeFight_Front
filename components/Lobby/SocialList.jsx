import React, { useState } from 'react';

export default function SocialList({ users, friends, onUserDoubleClick }) {
  const [activeTab, setActiveTab] = useState('users');
  const displayList = activeTab === 'users' ? users : friends;

  return (
    <section style={{ flex: 1, backgroundColor: '#151515', border: '1px solid #333', borderRadius: '6px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', borderBottom: '1px solid #333' }}>
        <div style={activeTab === 'users' ? styles.activeTab : styles.tab} onClick={() => setActiveTab('users')}>접속 유저</div>
        <div style={activeTab === 'friends' ? styles.activeTab : styles.tab} onClick={() => setActiveTab('friends')}>친구</div>
      </div>
      <div style={{ flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {displayList.map(u => (
          <div key={u.id} style={styles.row} onDoubleClick={() => onUserDoubleClick(u)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', backgroundColor: u.tierColor, borderRadius: '50%' }}></div>
              <span style={{ color: '#eee', fontSize: '13px', userSelect: 'none' }}>{u.name}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
const styles = {
  activeTab: { flex: 1, padding: '15px', textAlign: 'center', color: '#fff', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', borderBottom: '2px solid #20c997', backgroundColor: '#1a1a1a' },
  tab: { flex: 1, padding: '15px', textAlign: 'center', color: '#888', fontSize: '13px', cursor: 'pointer' },
  row: { display: 'flex', justifyContent: 'space-between', padding: '10px', borderRadius: '4px', cursor: 'pointer', backgroundColor: '#1a1a1a', border: '1px solid #2e2e2e' }
};