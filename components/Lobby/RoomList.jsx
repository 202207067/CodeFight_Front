import React from 'react';

export default function RoomList({ rooms, onStartBattle, onOpenCreate }) {
  return (
    <section style={styles.section}>
      <div style={styles.actionRow}>
        <button style={styles.createBtn} onClick={onOpenCreate}>방 만들기</button>
        <button style={styles.quickBtn}>빠른 시작</button>
      </div>
      <div style={styles.table}>
        <div style={styles.header}>
          <div style={{ width: '50px', textAlign: 'center' }}>No</div>
          <div style={{ flex: 1 }}>방 제목</div>
          <div style={{ width: '100px', textAlign: 'center' }}>언어</div>
          <div style={{ width: '100px', textAlign: 'center' }}>상태</div>
        </div>
        <div style={styles.body}>
          {rooms.map(r => (
            <div key={r.no} style={r.status === '대기중' ? styles.rowReady : styles.rowPlaying} onClick={r.status === '대기중' ? onStartBattle : null}>
              <div style={{ width: '50px', textAlign: 'center', color: '#888' }}>{r.no}</div>
              <div style={{ flex: 1, fontWeight: 'bold', color: r.status === '대기중' ? '#fff' : '#888' }}>{r.title}</div>
              <div style={{ width: '100px', textAlign: 'center', color: '#aaa' }}>{r.lang}</div>
              <div style={{ width: '100px', textAlign: 'center', color: r.status === '대기중' ? '#20c997' : '#555' }}>{r.status}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const styles = {
  section: { flex: 7, display: 'flex', flexDirection: 'column', gap: '15px' },
  actionRow: { display: 'flex', gap: '10px' },
  createBtn: { padding: '10px 25px', backgroundColor: '#20c997', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' },
  quickBtn: { padding: '10px 25px', backgroundColor: '#2e2e2e', color: '#fff', border: '1px solid #555', borderRadius: '4px', cursor: 'pointer' },
  table: { flex: 1, backgroundColor: '#151515', border: '1px solid #333', borderRadius: '6px', display: 'flex', flexDirection: 'column' },
  header: { display: 'flex', padding: '15px', backgroundColor: '#111', color: '#888', fontSize: '13px', fontWeight: 'bold' },
  body: { flex: 1, overflowY: 'auto' },
  rowReady: { display: 'flex', padding: '15px', borderBottom: '1px solid #222', borderLeft: '4px solid #20c997', cursor: 'pointer' },
  rowPlaying: { display: 'flex', padding: '15px', borderBottom: '1px solid #222', borderLeft: '4px solid #444', opacity: 0.5 }
};