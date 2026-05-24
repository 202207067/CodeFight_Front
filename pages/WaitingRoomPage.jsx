import React, { useState, useEffect, useRef } from 'react';
import useBattleStore from '../store/useBattleStore'; // Zustand 금고 연결

export default function WaitingRoom({ roomData, onStartBattle, onLeaveRoom }) {
  const [isAmIHost, setIsAmIHost] = useState(true); 

  // 🌟 Zustand 금고에서 캐릭터 저장 함수 꺼내오기
  const setMyCharacter = useBattleStore((state) => state.setMyCharacter);

  const [players, setPlayers] = useState([
    { id: 1, name: '오현서 (Hyunseo)', isHost: true, isReady: true, character: '👾' },
    { id: 2, name: '도안팀장님', isHost: false, isReady: false, character: '😎' },
    { id: 3, name: '자바깎는노인', isHost: false, isReady: true, character: '🤖' },
  ]);

  const [chatScope, setChatScope] = useState('모두에게');
  const [chatMessages, setChatMessages] = useState([
    { type: 'system', text: `[시스템] '${roomData?.title || '네 번째'}' 에 입장하셨습니다.` }
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatLogRef = useRef(null);

  const [countdown, setCountdown] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [kickTarget, setKickTarget] = useState(null);

  // 🌟 캐릭터 선택 시 실행
  const handleCharSelect = (icon) => {
    setPlayers(prev => prev.map(p => p.id === 1 ? {...p, character: icon} : p));
    setMyCharacter(icon); // 배틀 페이지로 넘길 캐릭터 저장
  };

  useEffect(() => {
    if (chatLogRef.current) chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
  }, [chatMessages]);

  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      const timer = setTimeout(() => { onStartBattle(); }, 1200);
      return () => clearTimeout(timer);
    }
  }, [countdown, onStartBattle]);

  const handleKickClick = (id, name) => setKickTarget({ id, name });
  const confirmKick = () => {
    if (kickTarget) {
      setPlayers(prev => prev.filter(player => player.id !== kickTarget.id));
      setChatMessages(prev => [...prev, { type: 'system', text: `[시스템] ${kickTarget.name} 님이 강제 퇴장되었습니다.` }]);
      setKickTarget(null);
    }
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    setChatMessages([...chatMessages, { type: 'me', sender: 'Hyunseo', scope: chatScope, text: chatInput }]);
    setChatInput('');
  };

  const handleStartClick = () => {
    const allReady = players.filter(p => !p.isHost).every(p => p.isReady);
    if (!allReady) {
      setToastMessage('모든 유저가 준비를 완료해야 시작할 수 있습니다.');
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }
    setCountdown(3); 
  };

  const toggleTeammateReady = () => setPlayers(players.map(p => p.id === 2 ? { ...p, isReady: !p.isReady } : p));

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        {kickTarget && (
          <div style={styles.modalOverlay}>
            <div style={styles.confirmModal}>
              <div style={styles.modalTitle}>강제 퇴장 확인</div>
              <div style={styles.modalDesc}>정말 <strong>{kickTarget.name}</strong> 님을 내보내시겠습니까?</div>
              <div style={styles.modalBtnRow}>
                <button style={styles.modalCancelBtn} onClick={() => setKickTarget(null)}>취소</button>
                <button style={styles.modalKickBtn} onClick={confirmKick}>강퇴하기</button>
              </div>
            </div>
          </div>
        )}
        {toastMessage && <div style={styles.toast}><span>⚠️</span> {toastMessage}</div>}
        {countdown !== null && <div style={styles.countdownOverlay}><div style={{fontSize: '100px', color: '#20c997'}}>{countdown > 0 ? countdown : 'GAME START!'}</div></div>}

        <div style={styles.header}>
          <div style={{ color: '#ccc', fontWeight: 'bold', fontSize: '18px' }}><span style={{ color: '#20c997' }}>#001</span> - {roomData?.title || '네 번째'}</div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button style={styles.testBtn} onClick={toggleTeammateReady}>팀장님 레디 전환</button>
            <button style={styles.testBtn} onClick={() => setIsAmIHost(!isAmIHost)}>권한 변경</button>
          </div>
        </div>

        <div style={styles.mainContent}>
          <div style={styles.leftColumn}>
            <div style={styles.slotsGrid}>
              {Array.from({ length: 8 }).map((_, index) => {
                const p = players[index];
                return p ? (
                  <div key={index} style={{ ...styles.slotCard, borderColor: p.isHost ? '#e6b800' : (p.isReady ? '#20c997' : '#444') }}>
                    {isAmIHost && !p.isHost && <button style={styles.kickIconBtn} onClick={() => handleKickClick(p.id, p.name)}>✕</button>}
                    <div style={styles.playerIcon}>{p.character}</div>
                    <div style={styles.playerName}>{p.name}</div>
                    <div style={{ ...styles.statusBadge, backgroundColor: p.isHost ? '#111' : (p.isReady ? '#20c997' : '#444') }}>{p.isHost ? 'HOST' : (p.isReady ? 'READY' : 'WAITING')}</div>
                  </div>
                ) : <div key={index} style={styles.emptySlot}>Empty</div>;
              })}
            </div>
            <div style={styles.chatArea}>
              <div style={styles.chatMessages} ref={chatLogRef}>{chatMessages.map((m, i) => <div key={i}>{m.text}</div>)}</div>
              <div style={styles.chatInputRow}>
                <select style={styles.chatSelect} value={chatScope} onChange={e => setChatScope(e.target.value)}><option>모두에게</option><option>친구에게</option></select>
                <input style={styles.chatInput} value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendMessage()} />
                <button style={styles.chatSendBtn} onClick={handleSendMessage}>전송</button>
              </div>
            </div>
          </div>

          <div style={styles.rightColumn}>
            <div style={styles.settingsPanel}>
              <div style={{ color: '#20c997', fontSize: '14px', fontWeight: 'bold', textAlign: 'center', marginBottom: '15px' }}>CHARACTER SELECT</div>
              
              {/* 🌟 기존 select 자리를 그리드로 교체 */}
              <div style={styles.charGrid}>
                {['👾', '👨‍💻', '🕵️', '🤖', '🧙‍♂️', '🥷', '👽', '🐶', '😺'].map((icon, i) => (
                  <div key={i} style={styles.charCard} onClick={() => handleCharSelect(icon)}>{icon}</div>
                ))}
              </div>

              <div style={{ color: '#20c997', fontSize: '14px', fontWeight: 'bold', textAlign: 'center', margin: '30px 0 15px' }}>ROOM SETTINGS</div>
              <div style={styles.settingBox}>
                <div style={styles.settingRow}><span>언어</span><span style={styles.highlight}>{roomData?.language || 'Python'}</span></div>
                <div style={styles.settingRow}><span>난이도</span><span style={styles.highlight}>{roomData?.level || 'Level 1'}</span></div>
              </div>
            </div>
            <div style={styles.actionButtonsRow}>
              <button style={styles.startBtn} onClick={handleStartClick}>GAME START</button>
            </div>
          </div>
        </div>
        <div style={styles.footer}><button style={styles.backBtn} onClick={onLeaveRoom}>◀ 방 나가기</button></div>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: { width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  container: { position: 'relative', width: '1280px', height: '800px', backgroundColor: '#121212', padding: '25px', boxSizing: 'border-box', color: '#fff', display: 'flex', flexDirection: 'column', gap: '20px', borderRadius: '12px', boxShadow: '0 0 40px rgba(0,0,0,0.7)' },
  // ... 나머지 기존 스타일 코드 ...
  charGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '20px' },
  charCard: { aspectRatio: '1', border: '2px solid #333', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '24px', backgroundColor: '#222' },
  header: { display: 'flex', justifyContent: 'space-between', padding: '15px', backgroundColor: '#1a1a1a', borderRadius: '8px' },
  testBtn: { backgroundColor: '#333', color: '#fff', border: '1px solid #555', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' },
  mainContent: { display: 'flex', gap: '20px', flex: 1 },
  leftColumn: { flex: 3, display: 'flex', flexDirection: 'column', gap: '15px' },
  slotsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', flex: 1 },
  slotCard: { position: 'relative', border: '2px solid #444', borderRadius: '6px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1a1a1a' },
  playerIcon: { fontSize: '40px' },
  playerName: { color: '#ccc', fontSize: '14px', margin: '5px 0' },
  statusBadge: { padding: '3px 10px', fontSize: '12px', borderRadius: '4px' },
  emptySlot: { border: '2px dashed #333', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#444' },
  kickIconBtn: { position: 'absolute', top: '5px', right: '5px', background: 'transparent', color: '#ff4d4d', border: '1px solid #ff4d4d', cursor: 'pointer' },
  chatArea: { height: '180px', backgroundColor: '#111', display: 'flex', flexDirection: 'column', borderRadius: '8px' },
  chatMessages: { flex: 1, padding: '10px', overflowY: 'auto', fontSize: '14px' },
  chatInputRow: { display: 'flex', height: '40px' },
  chatSelect: { width: '100px', backgroundColor: '#222', color: '#ccc', border: 'none', paddingLeft: '5px' },
  chatInput: { flex: 1, backgroundColor: '#222', color: '#fff', border: 'none', paddingLeft: '10px' },
  chatSendBtn: { width: '80px', backgroundColor: '#007bff', color: '#fff', border: 'none' },
  rightColumn: { flex: 1, backgroundColor: '#1a1a1a', borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column' },
  settingsPanel: { flex: 1 },
  settingBox: { backgroundColor: '#222', padding: '15px', borderRadius: '6px' },
  settingRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '5px', color: '#ccc' },
  highlight: { color: '#fff', fontWeight: 'bold' },
  startBtn: { marginTop: 'auto', padding: '18px', backgroundColor: '#ff4d4d', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' },
  backBtn: { padding: '10px 25px', backgroundColor: 'transparent', color: '#ff4d4d', border: '1px solid #ff4d4d', cursor: 'pointer' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 },
  confirmModal: { background: '#1a1a1a', padding: '30px', borderRadius: '10px', textAlign: 'center' },
  modalBtnRow: { display: 'flex', gap: '10px', marginTop: '20px' },
  modalCancelBtn: { flex: 1, padding: '10px', background: '#333', color: '#fff', border: 'none', cursor: 'pointer' },
  modalKickBtn: { flex: 1, padding: '10px', background: '#ff4d4d', color: '#fff', border: 'none', cursor: 'pointer' },
  toast: { position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', padding: '10px 20px', background: '#ff4d4d', color: '#fff', borderRadius: '20px' },
  countdownOverlay: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }
};