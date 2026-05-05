import React, { useState, useEffect, useRef } from 'react';

export default function WaitingRoom({ roomData, onStartBattle, onLeaveRoom }) {
  const [players, setPlayers] = useState([
    { id: 1, name: '현서 (나)', isHost: true, isReady: true, language: roomData?.language || 'Python', character: '👾' },
    { id: 2, name: '도안팀장님', isHost: false, isReady: false, language: 'Java', character: '😎' },
  ]);

  const maxPlayers = 8;
  
  const [chatMessages, setChatMessages] = useState([
    { type: 'system', text: `[시스템] '${roomData?.title || '알고리즘 방'}' 방이 생성되었습니다.` },
    { type: 'other', sender: '도안팀장님', text: '준비 완료되면 레디 눌러주세요!' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // 🌟 채팅 자동 스크롤을 위한 Ref 설정
  const chatLogRef = useRef(null);

  // 🌟 새 메시지가 추가될 때마다 스크롤을 맨 아래로 강제 이동
  useEffect(() => {
    if (chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    setChatMessages([...chatMessages, { type: 'me', sender: '현서', text: chatInput }]);
    setChatInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSendMessage();
  };

  const handleReadyToggle = () => {
    setPlayers(players.map(player => 
      !player.isHost ? { ...player, isReady: !player.isReady } : player
    ));
  };

  const handleStartGame = () => {
    const allGuestsReady = players.filter(p => !p.isHost).every(p => p.isReady);
    if (allGuestsReady) onStartBattle(); 
    else alert("모든 플레이어가 '레디' 상태여야 시작할 수 있습니다!");
  };

  return (
    // 🌟 로비와 동일하게 화면을 정중앙에 고정하는 래퍼 적용
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        
        <div style={styles.header}>
          <div style={{ color: '#ccc', fontWeight: 'bold', fontSize: '18px' }}>
            <span style={{ color: '#20c997' }}>#001</span> - {roomData?.title || '알고리즘 진검승부 방'}
          </div>
          <div style={{ backgroundColor: '#222', border: '1px solid #444', padding: '5px 15px', borderRadius: '4px', fontSize: '13px', color: '#aaa' }}>
            PUBLIC | 2/8 명
          </div>
        </div>

        <div style={styles.mainContent}>
          
          <div style={styles.leftColumn}>
            <div style={styles.slotsGrid}>
              {Array.from({ length: maxPlayers }).map((_, index) => {
                const player = players[index];
                if (player) {
                  const isHost = player.isHost;
                  const isReady = player.isReady;
                  const slotColor = isHost ? '#e6b800' : (isReady ? '#20c997' : '#444');

                  return (
                    <div key={index} style={{ ...styles.slotCard, borderColor: slotColor }}>
                      <div style={styles.playerIcon}>{player.character}</div>
                      <div style={styles.playerName}>{player.name}</div>
                      <div style={{ ...styles.statusBadge, borderColor: slotColor, color: slotColor, backgroundColor: isReady ? 'rgba(32, 201, 151, 0.1)' : 'transparent' }}>
                        {isHost ? 'HOST' : (isReady ? 'READY' : 'WAITING')}
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div key={index} style={styles.emptySlot}>
                      <span style={{ color: '#444', fontSize: '24px', fontWeight: 'bold' }}>X</span>
                      <span style={{ color: '#555', fontSize: '12px', marginTop: '5px' }}>Empty</span>
                    </div>
                  );
                }
              })}
            </div>

            <div style={styles.chatArea}>
              {/* 🌟 ref 연결 완료 */}
              <div style={styles.chatMessages} ref={chatLogRef}>
                {chatMessages.map((msg, idx) => (
                  // 🌟 텍스트 좌측 정렬 및 자동 줄바꿈 적용
                  <div key={idx} style={{ marginBottom: '6px', textAlign: 'left', wordBreak: 'break-word' }}>
                    {msg.type === 'system' && <span style={{ color: '#aaa' }}>{msg.text}</span>}
                    {msg.type === 'other' && <><span style={{ color: '#e6b800' }}>[{msg.sender}]</span> {msg.text}</>}
                    {msg.type === 'me' && <><span style={{ color: '#007bff' }}>[{msg.sender}]</span> {msg.text}</>}
                  </div>
                ))}
              </div>
              <div style={styles.chatInputRow}>
                <input type="text" placeholder="메시지를 입력하세요..." style={styles.chatInput} value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={handleKeyDown} />
                <button style={styles.chatSendBtn} onClick={handleSendMessage}>전송</button>
              </div>
            </div>
          </div>

          <div style={styles.rightColumn}>
            <div style={styles.settingsPanel}>
              <div style={styles.panelTitle}>MAIN LANGUAGE</div>
              <div style={styles.optionBox}>☕ {roomData?.language || 'Python'}</div>
              
              <div style={styles.panelTitle}>CHARACTER SELECT</div>
              <div style={styles.optionBox}>👾 기본 캐릭터</div>
              
              <div style={styles.panelTitle}>BATTLE SETTINGS</div>
              <div style={styles.settingRow}>
                <span style={{ color: '#888', fontSize: '13px' }}>배틀 테마</span>
                <span style={{ color: '#20c997', fontSize: '13px', fontWeight: 'bold' }}>{roomData?.title || 'ALGORITHM'}</span>
              </div>
              <div style={styles.settingRow}>
                <span style={{ color: '#888', fontSize: '13px' }}>난이도</span>
                <div style={styles.selectBox}>{roomData?.level || 'Level 1'}</div>
              </div>
              <div style={styles.settingRow}>
                <span style={{ color: '#888', fontSize: '13px' }}>제한 시간</span>
                <div style={styles.selectBox}>{roomData?.time || '30분'}</div>
              </div>
            </div>

            <div style={styles.actionButtonsRow}>
              <button style={{ ...styles.readyBtn, backgroundColor: players[1].isReady ? '#20c997' : '#222', color: players[1].isReady ? '#000' : '#aaa', borderColor: players[1].isReady ? '#20c997' : '#444' }} onClick={handleReadyToggle}>READY</button>
              <button style={styles.startBtn} onClick={handleStartGame}>START</button>
            </div>
          </div>
          
        </div>
        
        <div style={styles.footer}>
          <button style={styles.backBtn} onClick={onLeaveRoom}>◀ 방 나가기</button>
        </div>

      </div>
    </div>
  );
}

// === 🌟 로비와 동일한 반응형/정중앙 배치 스타일 적용 ===
const styles = {
  pageWrapper: { width: '100%', height: '100vh', backgroundColor: '#0f0f0f', display: 'flex', justifyContent: 'center', overflowX: 'hidden', overflowY: 'auto' },
  container: { width: '100%', maxWidth: '1400px', minHeight: '95vh', backgroundColor: '#121212', padding: '20px', margin: '20px', boxSizing: 'border-box', color: '#fff', display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: '"Inter", sans-serif', borderRadius: '12px', boxShadow: '0 0 30px rgba(0,0,0,0.8)' },
  
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1a1a1a', padding: '15px 20px', border: '1px solid #333', borderRadius: '8px', flexShrink: 0 },
  
  // flexWrap을 통해 화면이 좁아지면 설정 패널이 밑으로 떨어집니다.
  mainContent: { display: 'flex', gap: '20px', flex: 1, minHeight: 0, flexWrap: 'wrap' },
  
  leftColumn: { flex: '7 1 500px', display: 'flex', flexDirection: 'column', backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', overflow: 'hidden', minHeight: '400px' },
  rightColumn: { flex: '3 1 300px', display: 'flex', flexDirection: 'column', backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', overflow: 'hidden', minHeight: '400px' },

  slotsGrid: { flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', padding: '20px' },
  slotCard: { border: '2px solid', backgroundColor: '#222', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', padding: '15px 10px', borderRadius: '6px', transition: 'all 0.2s', minHeight: '120px' },
  playerIcon: { fontSize: '36px', marginTop: '10px' },
  playerName: { fontSize: '13px', color: '#ccc', fontWeight: 'bold' },
  statusBadge: { width: '80%', padding: '6px 0', border: '1px solid', textAlign: 'center', fontSize: '11px', fontWeight: 'bold', borderRadius: '4px' },
  emptySlot: { border: '2px dashed #333', backgroundColor: '#151515', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRadius: '6px', minHeight: '120px' },
  
  chatArea: { height: '180px', backgroundColor: '#111', borderTop: '1px solid #333', display: 'flex', flexDirection: 'column', flexShrink: 0 },
  chatMessages: { flex: 1, padding: '15px', fontSize: '14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' },
  chatInputRow: { display: 'flex', height: '45px', borderTop: '1px solid #222', flexShrink: 0 },
  chatInput: { flex: 1, backgroundColor: '#111', border: 'none', padding: '0 15px', color: '#fff', outline: 'none', fontSize: '13px' },
  chatSendBtn: { backgroundColor: '#007bff', border: 'none', color: '#fff', width: '80px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' },

  settingsPanel: { flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px', overflowY: 'auto' },
  panelTitle: { color: '#20c997', fontSize: '14px', fontWeight: 'bold', marginTop: '10px' },
  optionBox: { backgroundColor: '#222', border: '1px solid #444', padding: '12px', textAlign: 'center', fontSize: '14px', borderRadius: '4px', color: '#ccc' },
  settingRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #333' },
  selectBox: { backgroundColor: '#111', color: '#fff', border: '1px solid #444', padding: '6px 10px', outline: 'none', borderRadius: '4px', fontSize: '13px' },

  actionButtonsRow: { display: 'flex', padding: '20px', gap: '15px', backgroundColor: '#151515', borderTop: '1px solid #333', flexShrink: 0 },
  readyBtn: { flex: 1, padding: '15px', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' },
  startBtn: { flex: 1, padding: '15px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' },

  footer: { marginTop: 'auto', flexShrink: 0 },
  backBtn: { padding: '8px 25px', backgroundColor: 'transparent', border: '1px solid #ff4d4d', color: '#ff4d4d', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }
};