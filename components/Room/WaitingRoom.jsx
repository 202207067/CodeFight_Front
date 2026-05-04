import React, { useState } from 'react';

// 🌟 roomData 프롭스 받기
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
            <div style={styles.chatMessages}>
              {chatMessages.map((msg, idx) => (
                <div key={idx} style={{ marginBottom: '5px' }}>
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
            {/* 🌟 선택한 언어 표시 */}
            <div style={styles.optionBox}>☕ {roomData?.language || 'Python'}</div>
            
            <div style={styles.panelTitle}>CHARACTER SELECT</div>
            <div style={styles.optionBox}>👾 기본 캐릭터</div>
            
            <div style={styles.panelTitle}>BATTLE SETTINGS</div>
            <div style={styles.settingRow}>
              <span style={{ color: '#888', fontSize: '13px' }}>배틀 테마</span>
              {/* 🌟 방 제목 표시 */}
              <span style={{ color: '#20c997', fontSize: '13px', fontWeight: 'bold' }}>{roomData?.title || 'ALGORITHM'}</span>
            </div>
            <div style={styles.settingRow}>
              <span style={{ color: '#888', fontSize: '13px' }}>난이도</span>
              {/* 🌟 선택한 난이도 표시 */}
              <div style={styles.selectBox}>{roomData?.level || 'Level 1'}</div>
            </div>
            <div style={styles.settingRow}>
              <span style={{ color: '#888', fontSize: '13px' }}>제한 시간</span>
              {/* 🌟 선택한 시간 표시 */}
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
  );
}

const styles = { container: { backgroundColor: '#121212', height: '100vh', padding: '20px', boxSizing: 'border-box', color: '#fff', display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: '"Inter", sans-serif' }, header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1a1a1a', padding: '15px 20px', border: '1px solid #333', borderRadius: '8px' }, mainContent: { display: 'flex', gap: '20px', flex: 1, minHeight: 0 }, leftColumn: { flex: 7, display: 'flex', flexDirection: 'column', backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', overflow: 'hidden' }, slotsGrid: { flex: 1, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'repeat(2, 1fr)', gap: '15px', padding: '20px' }, slotCard: { border: '2px solid', backgroundColor: '#222', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', padding: '20px 10px', borderRadius: '6px', transition: 'all 0.2s' }, playerIcon: { fontSize: '40px', marginTop: '10px' }, playerName: { fontSize: '14px', color: '#ccc', fontWeight: 'bold' }, statusBadge: { width: '80%', padding: '6px 0', border: '1px solid', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', borderRadius: '4px' }, emptySlot: { border: '2px dashed #333', backgroundColor: '#151515', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRadius: '6px' }, chatArea: { height: '160px', backgroundColor: '#111', borderTop: '1px solid #333', display: 'flex', flexDirection: 'column' }, chatMessages: { flex: 1, padding: '15px', fontSize: '14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }, chatInputRow: { display: 'flex', height: '45px', borderTop: '1px solid #222' }, chatInput: { flex: 1, backgroundColor: '#111', border: 'none', padding: '0 15px', color: '#fff', outline: 'none' }, chatSendBtn: { backgroundColor: '#007bff', border: 'none', color: '#fff', width: '80px', fontWeight: 'bold', cursor: 'pointer' }, rightColumn: { flex: 3, display: 'flex', flexDirection: 'column', backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', overflow: 'hidden' }, settingsPanel: { flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }, panelTitle: { color: '#20c997', fontSize: '14px', fontWeight: 'bold', marginTop: '10px' }, optionBox: { backgroundColor: '#222', border: '1px solid #444', padding: '15px', textAlign: 'center', fontSize: '14px', borderRadius: '4px', color: '#ccc' }, settingRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #333' }, selectBox: { backgroundColor: '#111', color: '#fff', border: '1px solid #444', padding: '6px 10px', outline: 'none', borderRadius: '4px' }, actionButtonsRow: { display: 'flex', padding: '20px', gap: '15px', backgroundColor: '#151515', borderTop: '1px solid #333' }, readyBtn: { flex: 1, padding: '20px', borderRadius: '6px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }, startBtn: { flex: 1, padding: '20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }, footer: { marginTop: 'auto' }, backBtn: { padding: '8px 25px', backgroundColor: 'transparent', border: '1px solid #ff4d4d', color: '#ff4d4d', borderRadius: '4px', cursor: 'pointer' } };