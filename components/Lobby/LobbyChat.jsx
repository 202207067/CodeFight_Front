import React from 'react';

export default function LobbyChat() {
  return (
    <section style={{ flex: 3, backgroundColor: '#151515', border: '1px solid #333', borderRadius: '6px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px', color: '#ccc', fontSize: '13px', fontFamily: 'monospace' }}>
        <div>/? 를 누르시면 채팅 도움말을 보실 수 있습니다.</div>
        <div><span style={{color: '#ffc107'}}>[영환]</span> 다들 ㅎㅇ요</div>
        <div><span style={{color: '#0d6efd'}}>[현서]</span> 파이썬 오세요</div>
      </div>
      <div style={{ borderTop: '1px solid #333', backgroundColor: '#111' }}>
        <input type="text" placeholder="로비 채팅..." style={{ width: '100%', padding: '12px', background: 'none', border: 'none', color: '#fff', outline: 'none' }} />
      </div>
    </section>
  );
}