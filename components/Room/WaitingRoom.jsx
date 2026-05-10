import React, { useState, useEffect, useRef } from 'react';

export default function WaitingRoom({ roomData, onStartBattle, onLeaveRoom }) {
  const [isAmIHost, setIsAmIHost] = useState(true); 

  const [players, setPlayers] = useState([
    { id: 1, name: '오현서 (Hyunseo)', isHost: true, isReady: true, character: '👾' },
    { id: 2, name: '도안팀장님', isHost: false, isReady: false, character: '😎' }, // 🌟 현재 레디 안 한 상태
    { id: 3, name: '자바깎는노인', isHost: false, isReady: true, character: '🤖' },
  ]);

  const [chatScope, setChatScope] = useState('모두에게');
  const [chatMessages, setChatMessages] = useState([
    { type: 'system', text: `[시스템] '${roomData?.title || '방'}' 에 입장하셨습니다.` }
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatLogRef = useRef(null);

  const [countdown, setCountdown] = useState(null);
  
  // 🌟 커스텀 알림창 상태 관리
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    if (chatLogRef.current) chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
  }, [chatMessages]);

  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      const timer = setTimeout(() => {
        onStartBattle(); 
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [countdown, onStartBattle]);

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    setChatMessages([...chatMessages, { type: 'me', sender: '오현서', scope: chatScope, text: chatInput }]);
    setChatInput('');
  };

  // 🌟 게임 시작 버튼 로직 (ALL READY 검증)
  const handleStartClick = () => {
    // 방장을 제외한 나머지 인원 중, isReady가 false인 사람이 있는지 확인
    const allReady = players.filter(p => !p.isHost).every(p => p.isReady);

    if (!allReady) {
      // 🌟 레디 안 한 사람이 있으면 커스텀 알림창 띄우기
      setToastMessage('모든 유저가 준비를 완료해야 시작할 수 있습니다.');
      setTimeout(() => setToastMessage(null), 3000); // 3초 뒤 자동 소멸
      return;
    }
    
    // 모두 레디 상태면 카운트다운 시작
    setCountdown(3); 
  };

  // 🌟 테스트용: 도안팀장님 레디 상태 강제 전환 함수
  const toggleTeammateReady = () => {
    setPlayers(players.map(p => p.id === 2 ? { ...p, isReady: !p.isReady } : p));
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        
        {/* 🌟 커스텀 알림창 (Toast UI) */}
        {toastMessage && (
          <div style={styles.toast}>
            <span>⚠️</span> {toastMessage}
          </div>
        )}

        {countdown !== null && (
          <div style={styles.countdownOverlay}>
            <div style={{
              fontSize: countdown === 0 ? '120px' : '180px',
              fontWeight: '900',
              color: countdown === 0 ? '#ff4d4d' : '#20c997',
              textShadow: countdown === 0 ? '0 0 50px rgba(255, 77, 77, 0.9)' : '0 0 50px rgba(32, 201, 151, 0.9)',
              letterSpacing: '10px',
              fontStyle: 'italic',
              transition: 'color 0.2s ease-in-out, text-shadow 0.2s ease-in-out, transform 0.2s ease-in-out',
              transform: countdown === 0 ? 'scale(1.1)' : 'scale(1)',
              whiteSpace: 'nowrap'
            }}>
              {countdown > 0 ? countdown : 'GAME START!'}
            </div>
          </div>
        )}

        <div style={styles.header}>
          <div style={{ color: '#ccc', fontWeight: 'bold', fontSize: '18px' }}>
            <span style={{ color: '#20c997' }}>#001</span> - {roomData?.title || '알고리즘 배틀'}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {/* 🌟 기능 테스트를 위한 보조 버튼들 */}
            <button style={styles.testBtn} onClick={toggleTeammateReady}>
              [테스트] 팀장님 레디 전환
            </button>
            <button style={styles.testBtn} onClick={() => setIsAmIHost(!isAmIHost)}>
              [테스트] 권한 변경 (현재: {isAmIHost ? '방장' : '참가자'})
            </button>
          </div>
        </div>

        <div style={styles.mainContent}>
          
          <div style={styles.leftColumn}>
            <div style={styles.slotsGrid}>
              {Array.from({ length: 8 }).map((_, index) => {
                const player = players[index];
                return player ? (
                  <div key={index} style={{ ...styles.slotCard, borderColor: player.isHost ? '#e6b800' : (player.isReady ? '#20c997' : '#444') }}>
                    <div style={styles.playerIcon}>{player.character}</div>
                    <div style={styles.playerName}>{player.name}</div>
                    <div style={{ ...styles.statusBadge, backgroundColor: player.isHost ? '#111' : (player.isReady ? '#20c997' : '#444'), color: player.isReady && !player.isHost ? '#000' : '#fff' }}>
                      {player.isHost ? 'HOST' : (player.isReady ? 'READY' : 'WAITING')}
                    </div>
                  </div>
                ) : (
                  <div key={index} style={styles.emptySlot}>Empty</div>
                );
              })}
            </div>

            <div style={styles.chatArea}>
              <div style={styles.chatMessages} ref={chatLogRef}>
                {chatMessages.map((msg, idx) => (
                  <div key={idx} style={{ marginBottom: '6px', textAlign: 'left' }}>
                    {msg.type === 'system' && <span style={{ color: '#aaa' }}>{msg.text}</span>}
                    {msg.type !== 'system' && (
                      <>
                        <span style={{ color: '#888', fontSize: '12px' }}>[{msg.scope}] </span>
                        <span style={{ color: msg.type === 'me' ? '#007bff' : '#e6b800' }}>[{msg.sender}]</span> {msg.text}
                      </>
                    )}
                  </div>
                ))}
              </div>
              <div style={styles.chatInputRow}>
                <select style={styles.chatSelect} value={chatScope} onChange={e => setChatScope(e.target.value)}>
                  <option value="모두에게">모두에게</option>
                  <option value="친구에게">친구에게</option>
                  <option value="귓속말">귓속말</option>
                </select>
                <input type="text" placeholder="메시지 입력..." style={styles.chatInput} value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendMessage()} />
                <button style={styles.chatSendBtn} onClick={handleSendMessage}>전송</button>
              </div>
            </div>
          </div>

          <div style={styles.rightColumn}>
            <div style={styles.settingsPanel}>
              
              <div style={styles.panelTitle}>CHARACTER SELECT</div>
              <select style={styles.optionSelect}>
                <option>👾 기본 슬라임</option>
                <option>🤖 알고리즘 로봇</option>
                <option>🧙‍♂️ 코딩 마법사</option>
              </select>
              
              <div style={styles.panelTitle} style={{ marginTop: '25px', color: '#20c997', fontWeight: 'bold' }}>ROOM SETTINGS</div>
              <div style={styles.settingBox}>
                <div style={styles.settingRow}><span>언어</span><span style={styles.highlight}>{roomData?.language || 'Python'}</span></div>
                <div style={styles.settingRow}><span>난이도</span><span style={styles.highlight}>{roomData?.level || 'Level 1'}</span></div>
                <div style={styles.settingRow}><span>제한 시간</span><span style={styles.highlight}>{roomData?.time || '30분'}</span></div>
                <div style={styles.settingRow}><span>문제 수</span><span style={styles.highlight}>{roomData?.questionCount || '5문제'}</span></div>
              </div>
            </div>

            <div style={styles.actionButtonsRow}>
              {isAmIHost ? (
                <button style={styles.startBtn} onClick={handleStartClick}>GAME START</button>
              ) : (
                <button style={styles.readyBtn}>READY</button>
              )}
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

const styles = {
  pageWrapper: { width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  container: { position: 'relative', width: '1280px', height: '800px', backgroundColor: '#121212', padding: '25px', boxSizing: 'border-box', color: '#fff', display: 'flex', flexDirection: 'column', gap: '20px', borderRadius: '12px', boxShadow: '0 0 40px rgba(0,0,0,0.7)' },
  
  // 🌟 커스텀 알림창(Toast) 스타일: 화면 상단 중앙에 고정
  toast: { position: 'absolute', top: '40px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(255, 77, 77, 0.95)', color: '#fff', padding: '15px 30px', borderRadius: '30px', fontWeight: 'bold', fontSize: '15px', boxShadow: '0 5px 15px rgba(255, 77, 77, 0.4)', zIndex: 10000, display: 'flex', alignItems: 'center', gap: '10px' },

  countdownOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.2)', backdropFilter: 'blur(5px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, borderRadius: '12px' },

  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1a1a1a', padding: '15px 20px', borderRadius: '8px' },
  testBtn: { backgroundColor: '#333', color: '#fff', border: '1px solid #555', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' },
  mainContent: { display: 'flex', gap: '20px', flex: 1, minHeight: 0 },
  leftColumn: { flex: 3, display: 'flex', flexDirection: 'column', backgroundColor: '#1a1a1a', borderRadius: '8px', overflow: 'hidden' },
  rightColumn: { flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#1a1a1a', borderRadius: '8px', overflow: 'hidden' },
  slotsGrid: { flex: 1, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', padding: '20px' },
  slotCard: { border: '2px solid', backgroundColor: '#222', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', minHeight: '120px' },
  playerIcon: { fontSize: '40px', marginBottom: '10px' },
  playerName: { color: '#ccc', fontWeight: 'bold', fontSize: '14px', marginBottom: '10px' },
  statusBadge: { padding: '5px 15px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' },
  emptySlot: { border: '2px dashed #333', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '6px', color: '#444', fontWeight: 'bold' },
  chatArea: { height: '200px', backgroundColor: '#111', display: 'flex', flexDirection: 'column' },
  chatMessages: { flex: 1, padding: '15px', overflowY: 'auto', fontSize: '14px' },
  chatInputRow: { display: 'flex', height: '40px', borderTop: '1px solid #222' },
  chatSelect: { width: '100px', backgroundColor: '#222', color: '#ccc', border: 'none', padding: '0 10px', outline: 'none' },
  chatInput: { flex: 1, backgroundColor: '#111', color: '#fff', border: 'none', padding: '0 15px', outline: 'none' },
  chatSendBtn: { width: '80px', backgroundColor: '#007bff', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' },
  settingsPanel: { flex: 1, padding: '25px', display: 'flex', flexDirection: 'column', gap: '10px' },
  panelTitle: { color: '#20c997', fontSize: '14px', fontWeight: 'bold' },
  optionSelect: { width: '100%', padding: '12px', backgroundColor: '#222', border: '1px solid #444', color: '#fff', borderRadius: '6px', outline: 'none', fontSize: '15px' },
  settingBox: { backgroundColor: '#222', padding: '20px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '15px' },
  settingRow: { display: 'flex', justifyContent: 'space-between', color: '#aaa', fontSize: '14px' },
  highlight: { color: '#fff', fontWeight: 'bold' },
  actionButtonsRow: { padding: '20px', borderTop: '1px solid #333' },
  startBtn: { width: '100%', padding: '18px', backgroundColor: '#ff4d4d', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' },
  readyBtn: { width: '100%', padding: '18px', backgroundColor: '#20c997', color: '#000', border: 'none', borderRadius: '6px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' },
  footer: { marginTop: 'auto' },
  backBtn: { padding: '10px 25px', backgroundColor: 'transparent', border: '1px solid #ff4d4d', color: '#ff4d4d', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }
};