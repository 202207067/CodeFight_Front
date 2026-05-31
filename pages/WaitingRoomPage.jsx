import React, { useState, useEffect } from 'react';
// 🌟 Firebase DB에서 문서를 삭제하기 위한 도구 가져오기
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';

export default function WaitingRoomPage({ roomData, onStartBattle, onLeaveRoom }) {
  const [players, setPlayers] = useState([]);
  const [emptySlots, setEmptySlots] = useState([]);
  const [totalCapacity, setTotalCapacity] = useState(8);
  
  const [myChar, setMyChar] = useState('👾');

  const [kickTargetId, setKickTargetId] = useState(null); 
  const [countdown, setCountdown] = useState(null);
  const [inlineWarning, setInlineWarning] = useState('');

  useEffect(() => {
    const maxCapacity = Number(roomData?.capacity) || 4;
    setTotalCapacity(maxCapacity);

    const dummyPool = [
      { id: 2, name: "도안팀장님", status: "WAITING", char: "😎", isHost: false },
      { id: 3, name: "자바깎는노인", status: "READY", char: "🤖", isHost: false },
      { id: 4, name: "김코딩", status: "READY", char: "🦊", isHost: false },
      { id: 5, name: "파이썬고수", status: "WAITING", char: "🧙‍♂️", isHost: false },
      { id: 6, name: "알고리즘봇", status: "READY", char: "🕵️‍♂️", isHost: false }
    ];

    const dummyCount = Math.min(3, maxCapacity - 1);
    const actualPlayers = [
      { id: 1, name: "오현서 (Hyunseo)", status: "HOST", char: '👾', isHost: true }, 
      ...dummyPool.slice(0, dummyCount)
    ];
    
    setPlayers(actualPlayers);
  }, [roomData]); 

  useEffect(() => {
    setPlayers(prev => prev.map(p => p.isHost ? { ...p, char: myChar } : p));
  }, [myChar]);

  useEffect(() => {
    const emptyCount = totalCapacity - players.length;
    setEmptySlots(Array.from({ length: emptyCount > 0 ? emptyCount : 0 }));
  }, [players, totalCapacity]);

  useEffect(() => {
    if (countdown === null) return;
    
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      onStartBattle(players); 
    }
  }, [countdown, onStartBattle, players]);

  const confirmKick = () => {
    if (kickTargetId !== null) {
      setPlayers(prev => prev.filter(p => p.id !== kickTargetId));
      setKickTargetId(null); 
    }
  };

  const handleStartGame = () => {
    const allReady = players.every(p => p.isHost || p.status === 'READY');
    
    if (!allReady) {
      setInlineWarning("⚠️ 모든 플레이어가 READY 상태여야 합니다.");
      setTimeout(() => setInlineWarning(''), 2000);
      return;
    }
    setCountdown(3);
  };

  // 🌟 핵심 로직: 방 나가기 버튼을 누르면 DB에서 방을 삭제하고 로비로 이동
  const handleLeaveRoom = async () => {
    if (roomData?.id) {
      try {
        // Firebase의 rooms 컬렉션에서 현재 방 ID를 찾아 완전히 삭제 (폭파)
        await deleteDoc(doc(db, 'rooms', roomData.id));
      } catch (error) {
        console.error("방 삭제 중 오류 발생:", error);
      }
    }
    // 삭제 후 App.jsx에 있는 onLeaveRoom을 호출해 화면을 로비로 전환
    onLeaveRoom();
  };

  const characters = ['👾', '👨‍💻', '🕵️‍♂️', '🤖', '🧙‍♂️', '📱', '👽', '🐶', '🦊'];

  return (
    <div style={styles.pageWrapper}>
      {countdown !== null && (
        <div style={styles.countdownOverlay}>
          <div style={styles.countdownText}>
            {countdown > 0 ? countdown : 'START!'}
          </div>
        </div>
      )}

      {kickTargetId !== null && (
        <div style={styles.modalOverlay}>
          <div style={styles.confirmModal}>
            <h3 style={{...styles.modalTitle, color: '#ff4d4d'}}>🚫 플레이어 강퇴</h3>
            <p style={styles.modalDesc}>
              정말로 이 플레이어를 대기실에서<br />
              강퇴하시겠습니까?
            </p>
            <div style={styles.modalBtnRow}>
              <button style={styles.modalCancelBtn} onClick={() => setKickTargetId(null)}>취소</button>
              <button style={styles.modalConfirmBtn} onClick={confirmKick}>강퇴하기</button>
            </div>
          </div>
        </div>
      )}

      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <span style={styles.roomBadge}>
              {players.length} / {totalCapacity}
            </span>
            <h2 style={styles.roomTitle}>#{roomData?.id?.substring(0, 3) || '001'} - {roomData?.title || '코딩 배틀 방'}</h2>
            
            {inlineWarning && (
              <span style={styles.inlineWarningText}>{inlineWarning}</span>
            )}
          </div>
        </div>

        <div style={styles.mainContent}>
          <div style={styles.leftSection}>
            <div style={styles.gridContainer}>
              <div style={{
                ...styles.playerGrid,
                gridTemplateColumns: `repeat(${Math.min(totalCapacity, 4)}, 1fr)`
              }}>
                {players.map((p) => (
                  <div key={p.id} style={{
                    ...styles.playerCard,
                    borderColor: p.isHost ? '#ffcf40' : (p.status === 'READY' ? '#20c997' : '#444')
                  }}>
                    {!p.isHost && (
                      <button style={styles.kickBtn} onClick={() => setKickTargetId(p.id)}>❌</button>
                    )}
                    <div style={styles.charIcon}>{p.char}</div>
                    <div style={styles.playerName}>{p.name}</div>
                    <div style={{
                      ...styles.statusBadge,
                      backgroundColor: p.status === 'WAITING' ? '#555' : (p.isHost ? '#222' : '#20c997'),
                      color: p.status === 'WAITING' ? '#ccc' : (p.isHost ? '#aaa' : '#000'),
                      border: p.isHost ? '1px solid #555' : 'none'
                    }}>
                      {p.status}
                    </div>
                  </div>
                ))}
                {emptySlots.map((_, idx) => (
                  <div key={`empty-${idx}`} style={styles.emptyCard}>Empty</div>
                ))}
              </div>
            </div>

            <div style={styles.chatSection}>
              <div style={styles.chatLog}>
                <div style={{ color: '#ccc', textAlign: 'center', margin: 'auto' }}>
                  [시스템] '{roomData?.title || '배틀 방'}' 에 입장하셨습니다.
                </div>
              </div>
              <div style={styles.chatInputRow}>
                <select style={styles.chatSelect}><option>모두에게</option></select>
                <input type="text" style={styles.chatInput} placeholder="메시지를 입력하세요" />
                <button style={styles.chatSendBtn}>전송</button>
              </div>
            </div>
            <div style={styles.leaveRow}>
              {/* 🌟 기존 onLeaveRoom을 Firebase 삭제 로직이 포함된 handleLeaveRoom으로 교체 */}
              <button style={styles.leaveBtn} onClick={handleLeaveRoom}>◀ 방 나가기</button>
            </div>
          </div>

          <div style={styles.rightSection}>
            <div style={styles.rightPanel}>
              <h3 style={styles.panelTitle}>CHARACTER SELECT</h3>
              <div style={styles.charGrid}>
                {characters.map((char, idx) => (
                  <button 
                    key={idx} 
                    style={{
                      ...styles.charBtn,
                      borderColor: myChar === char ? '#20c997' : '#444',
                      backgroundColor: myChar === char ? '#333' : '#2a2a2a'
                    }}
                    onClick={() => setMyChar(char)}
                  >
                    {char}
                  </button>
                ))}
              </div>

              <h3 style={{...styles.panelTitle, marginTop: '30px'}}>ROOM SETTINGS</h3>
              <div style={styles.settingRow}>
                <span>언어</span><span style={{fontWeight: 'bold', color: '#fff'}}>{roomData?.language || 'Python'}</span>
              </div>
              <div style={styles.settingRow}>
                <span>난이도</span><span style={{fontWeight: 'bold', color: '#fff'}}>{roomData?.level || 'Level 1'}</span>
              </div>

              <button style={styles.startBtn} onClick={handleStartGame}>GAME START</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: { width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#0d0d0d', color: '#fff', boxSizing: 'border-box' },
  container: { width: '1300px', height: '800px', backgroundColor: '#1a1a1a', borderRadius: '12px', padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px', border: '1px solid #222' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px' },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '15px' },
  roomBadge: { backgroundColor: '#20c997', color: '#000', padding: '5px 12px', borderRadius: '4px', fontWeight: 'bold', fontSize: '14px', letterSpacing: '0.5px' },
  roomTitle: { margin: 0, color: '#fff', fontSize: '20px', fontWeight: 'bold' },
  inlineWarningText: { marginLeft: '10px', color: '#ff4d4d', fontSize: '14px', fontWeight: 'bold', animation: 'fadeIn 0.3s ease-in' },
  mainContent: { display: 'flex', gap: '20px', flex: 1, minHeight: 0 },
  leftSection: { flex: 3, display: 'flex', flexDirection: 'column', gap: '20px', minHeight: 0 },
  gridContainer: { flex: 1, overflowY: 'auto', paddingRight: '5px' },
  playerGrid: { display: 'grid', gap: '15px', width: '100%' },
  playerCard: { position: 'relative', backgroundColor: '#111', borderRadius: '8px', border: '2px solid #444', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', height: '170px' },
  emptyCard: { backgroundColor: 'transparent', borderRadius: '8px', border: '2px dashed #444', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#444', height: '170px', fontSize: '18px', fontWeight: 'bold' },
  kickBtn: { position: 'absolute', top: '10px', right: '10px', backgroundColor: 'transparent', border: '1px solid #ff4d4d', color: '#ff4d4d', borderRadius: '4px', padding: '2px 6px', cursor: 'pointer', fontSize: '10px', transition: 'background 0.2s' },
  charIcon: { fontSize: '45px' },
  playerName: { fontSize: '13px', color: '#fff' },
  statusBadge: { padding: '4px 12px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' },
  chatSection: { backgroundColor: '#111', borderRadius: '8px', border: '1px solid #333', height: '140px', display: 'flex', flexDirection: 'column', padding: '10px', flexShrink: 0 },
  chatLog: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  chatInputRow: { display: 'flex', gap: '10px' },
  chatSelect: { backgroundColor: '#222', color: '#ccc', border: '1px solid #444', borderRadius: '4px', padding: '8px', width: '100px' },
  chatInput: { flex: 1, backgroundColor: '#222', color: '#fff', border: '1px solid #444', borderRadius: '4px', padding: '8px 15px' },
  chatSendBtn: { backgroundColor: '#007bff', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  leaveRow: { display: 'flex', justifyContent: 'center', flexShrink: 0 },
  leaveBtn: { backgroundColor: 'transparent', border: '1px solid #ff4d4d', color: '#ff4d4d', padding: '10px 30px', borderRadius: '4px', cursor: 'pointer' },
  rightSection: { flex: 1, display: 'flex', flexDirection: 'column' },
  rightPanel: { flex: 1, backgroundColor: '#222', borderRadius: '8px', padding: '25px', display: 'flex', flexDirection: 'column' },
  panelTitle: { margin: '0 0 15px 0', fontSize: '14px', color: '#20c997', textAlign: 'center', fontWeight: 'bold', letterSpacing: '1px' },
  charGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' },
  charBtn: { backgroundColor: '#2a2a2a', border: '1px solid #444', borderRadius: '8px', fontSize: '30px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' },
  settingRow: { display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #333', color: '#ccc', fontSize: '15px' },
  startBtn: { marginTop: 'auto', backgroundColor: '#ff4d4d', color: '#fff', border: 'none', padding: '20px', borderRadius: '8px', fontSize: '20px', fontWeight: '900', cursor: 'pointer', letterSpacing: '2px', boxShadow: '0 5px 15px rgba(255,77,77,0.3)' },

  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  confirmModal: { width: '400px', backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '10px', padding: '30px', textAlign: 'center', color: '#fff', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' },
  modalTitle: { margin: '0 0 15px 0', fontSize: '20px', fontWeight: 'bold' },
  modalDesc: { margin: '0 0 25px 0', fontSize: '15px', color: '#ccc', lineHeight: '1.6' },
  modalBtnRow: { display: 'flex', gap: '15px', justifyContent: 'center' },
  modalCancelBtn: { flex: 1, padding: '12px 0', backgroundColor: '#333', color: '#fff', border: '1px solid #444', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' },
  modalConfirmBtn: { flex: 1, padding: '12px 0', backgroundColor: '#ff4d4d', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' },
  countdownOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.9)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  countdownText: { fontSize: '150px', fontWeight: '900', color: '#20c997', textShadow: '0 0 40px rgba(32, 201, 151, 0.7)' }
};