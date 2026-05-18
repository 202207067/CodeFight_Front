import React, { useState, useEffect, useRef } from 'react';
import Modal from "../components/common/Modal";
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../utils/firebase'; 

export default function LobbyPage({ onJoinRoom, onStartPractice }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rooms, setRooms] = useState([]);
  
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 4; 

  const [activeTab, setActiveTab] = useState('friends');

  // 🌟 로비 채팅 범위 상태 추가
  const [chatScope, setChatScope] = useState('모두에게');
  const [chatMessages, setChatMessages] = useState([
    { type: 'system', text: '[시스템] 로비에 입장하셨습니다.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatLogRef = useRef(null);

  useEffect(() => {
    const q = query(collection(db, 'rooms'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const roomDataFromDB = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRooms(roomDataFromDB);
    });
    return () => unsubscribe();
  }, []);

  const totalPages = Math.max(1, Math.ceil(rooms.length / roomsPerPage));
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = rooms.slice(indexOfFirstRoom, indexOfLastRoom);

  useEffect(() => {
    if (chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    // 🌟 메시지 객체에 선택된 범위(scope) 포함
    setChatMessages([...chatMessages, { type: 'me', sender: 'Hyunseo', scope: chatScope, text: chatInput }]);
    setChatInput('');
  };

  const handleCreateRoom = async (newRoomData) => {
    try {
      const docRef = await addDoc(collection(db, 'rooms'), {
        title: newRoomData.title,
        capacity: newRoomData.capacity,
        level: newRoomData.level,
        language: newRoomData.language,
        time: newRoomData.time,
        status: 'WAITING',
        active: true,
        createdAt: serverTimestamp()
      });
      setIsModalOpen(false); 
      onJoinRoom({ id: docRef.id, ...newRoomData, status: 'WAITING' }); 
    } catch (error) {
      console.error("방 생성 실패:", error);
    }
  };

  const friendsList = [
    { status: '⚫', name: '도안팀장님', state: '오프라인' },
    { status: '🟢', name: '자바깎는노인', state: '온라인' },
    { status: '🟢', name: '김코딩', state: '온라인' },
  ].sort((a, b) => (a.state === '온라인' ? -1 : 1));

  const rankingList = [
    { rank: '🏆', name: '도안팀장님', score: 2800 },
    { rank: '🥈', name: '오현서 (나)', score: 2450 },
    { rank: '🥉', name: '자바깎는노인', score: 2100 },
    { rank: '4', name: '알고리즘봇', score: 1500 },
  ].sort((a, b) => b.score - a.score);

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        
        <div style={styles.topSection}>
          <div style={styles.roomWrapper}>
            <div style={styles.grid}>
              {currentRooms.map(room => (
                <div key={room.id} style={{ ...styles.roomCard, borderColor: room.active ? '#20c997' : '#333' }} onClick={() => onJoinRoom(room)}>
                  <div style={styles.roomLeft}>
                    <div style={styles.roomId}>ROOM</div>
                    <div style={styles.roomCap}>{room.capacity}</div>
                  </div>
                  <div style={styles.roomRight}>
                    <div style={styles.roomTitle}>{room.title}</div>
                    <div style={{ ...styles.roomStatus, color: room.status === 'WAITING' ? '#20c997' : '#555' }}>
                      {room.status}
                    </div>
                  </div>
                </div>
              ))}
              {currentRooms.length < 4 && Array.from({ length: 4 - currentRooms.length }).map((_, i) => (
                <div key={`empty-${i}`} style={styles.emptyCardSlot}>WAITING FOR BATTLE...</div>
              ))}
            </div>

            <div style={styles.pagination}>
              <button style={styles.pageBtn} onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>◀</button>
              <span style={styles.pageText}>{currentPage} / {totalPages}</span>
              <button style={styles.pageBtn} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>▶</button>
            </div>

            <div style={styles.actionRow}>
              <button style={styles.createBtn} onClick={() => setIsModalOpen(true)}>방만들기</button>
              <button style={styles.normalBtn} onClick={onStartPractice}>연습모드</button>
            </div>
          </div>

          <div style={styles.sideWrapper}>
            <div style={styles.avatar}>ME</div>
            <div style={styles.profileName}>오현서 (Hyunseo)</div>
            <div style={styles.profileRank}>Silver II</div>
            <button style={styles.viewCodeBtn}>내 코드보기</button>
            <div style={styles.expHeader}><span>EXP</span><span>1450 / 2000</span></div>
            <div style={styles.expBarBg}><div style={styles.expBarFill}></div></div>
          </div>
        </div>

        <div style={styles.bottomSection}>
          <div style={styles.chatWrapper}>
            <div style={styles.chatLog} ref={chatLogRef}>
              {chatMessages.map((msg, idx) => (
                <div key={idx} style={{ marginBottom: '8px', textAlign: 'left' }}>
                  {msg.type === 'system' && <span style={{ color: '#aaa' }}>{msg.text}</span>}
                  {msg.type !== 'system' && (
                    <>
                      <span style={{ color: '#888', fontSize: '12px' }}>[{msg.scope || '모두에게'}] </span>
                      <span style={{ color: msg.type === 'me' ? '#007bff' : '#e6b800' }}>[{msg.sender}]</span> {msg.text}
                    </>
                  )}
                </div>
              ))}
            </div>
            <div style={styles.chatInputRow}>
              {/* 🌟 로비 채팅 범위 리스트박스 */}
              <select style={styles.chatSelect} value={chatScope} onChange={e => setChatScope(e.target.value)}>
                <option value="모두에게">모두에게</option>
                <option value="친구에게">친구에게</option>
                <option value="귓속말">귓속말</option>
              </select>
              <input type="text" placeholder="메시지를 입력하세요..." style={styles.chatInput} value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendMessage()} />
              <button style={styles.chatSendBtn} onClick={handleSendMessage}>전송</button>
            </div>
          </div>

          <div style={styles.sideWrapper}>
            <div style={styles.tabs}>
              <div style={activeTab === 'friends' ? styles.activeTab : styles.inactiveTab} onClick={() => setActiveTab('friends')}>친구</div>
              <div style={activeTab === 'ranking' ? styles.activeTab : styles.inactiveTab} onClick={() => setActiveTab('ranking')}>랭킹</div>
            </div>
            <div style={styles.tableArea}>
              {activeTab === 'friends' ? (
                <div style={styles.tableBody}>
                  {friendsList.map((f, i) => (
                    <div key={i} style={styles.tableRow}><span>{f.status}</span><span>{f.name}</span><span style={{ color: f.state === '온라인' ? '#20c997' : '#888' }}>{f.state}</span></div>
                  ))}
                </div>
              ) : (
                <div style={styles.tableBody}>
                  {rankingList.map((u, i) => (
                    <div key={i} style={styles.tableRow}><span>{u.rank}</span><span>{u.name}</span><span style={{ color: '#20c997' }}>{u.score}</span></div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={styles.footer}>
          <button style={styles.settingBtn}>로비 코드 히스토리</button>
          <button style={styles.exitBtn}>종료</button>
        </div>

        {isModalOpen && <Modal onClose={() => setIsModalOpen(false)} onCreate={handleCreateRoom} />}
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: { width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  container: { width: '1280px', height: '800px', backgroundColor: '#121212', padding: '25px', boxSizing: 'border-box', color: '#fff', display: 'flex', flexDirection: 'column', gap: '20px', borderRadius: '12px', boxShadow: '0 0 40px rgba(0,0,0,0.7)' },
  topSection: { display: 'flex', gap: '20px', height: '420px' },
  bottomSection: { display: 'flex', gap: '20px', height: '280px' },
  roomWrapper: { width: '850px', backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' },
  sideWrapper: { width: '360px', backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxSizing: 'border-box' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '15px', flex: 1 }, 
  roomCard: { display: 'flex', backgroundColor: '#222', border: '1px solid #333', borderRadius: '6px', cursor: 'pointer' },
  emptyCardSlot: { display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#151515', border: '1px dashed #333', borderRadius: '6px', color: '#444' },
  roomLeft: { width: '80px', borderRight: '1px solid #333', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' },
  roomRight: { flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  roomTitle: { fontSize: '15px', fontWeight: 'bold', marginBottom: '8px' },
  roomStatus: { fontSize: '14px', fontWeight: 'bold' },
  pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', margin: '25px 0' },
  pageBtn: { backgroundColor: '#252525', color: '#fff', border: '1px solid #444', padding: '5px 15px', cursor: 'pointer' },
  actionRow: { display: 'flex', gap: '10px' },
  createBtn: { flex: 1, padding: '14px', backgroundColor: '#20c997', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  normalBtn: { flex: 1, padding: '14px', backgroundColor: '#2a2a2a', color: '#aaa', border: '1px solid #444', borderRadius: '6px', cursor: 'pointer' },
  avatar: { width: '80px', height: '80px', backgroundColor: '#007bff', borderRadius: '50%', marginBottom: '15px', border: '3px solid #1a1a1a', boxShadow: '0 0 0 2px #007bff' },
  profileName: { fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' },
  profileRank: { fontSize: '13px', color: '#20c997', marginBottom: '20px' },
  viewCodeBtn: { width: '100%', padding: '10px', backgroundColor: '#252525', border: '1px solid #444', color: '#fff', borderRadius: '6px', marginBottom: '25px', cursor: 'pointer' },
  expHeader: { width: '100%', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#888', marginBottom: '8px' },
  expBarBg: { width: '100%', height: '8px', backgroundColor: '#333', borderRadius: '4px' },
  expBarFill: { width: '72.5%', height: '100%', backgroundColor: '#007bff' },
  chatWrapper: { width: '850px', backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' },
  chatLog: { flex: 1, backgroundColor: '#111', padding: '15px', overflowY: 'auto', marginBottom: '15px', fontSize: '14px' },
  chatInputRow: { display: 'flex', gap: '10px', height: '40px' },
  chatSelect: { width: '100px', backgroundColor: '#222', color: '#ccc', border: '1px solid #444', borderRadius: '4px', padding: '0 5px' },
  chatInput: { flex: 1, backgroundColor: '#111', color: '#fff', border: '1px solid #444', borderRadius: '4px', padding: '0 15px' },
  chatSendBtn: { width: '80px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' },
  tabs: { display: 'flex', width: '100%', backgroundColor: '#222' },
  activeTab: { flex: 1, textAlign: 'center', padding: '12px 0', borderBottom: '2px solid #20c997', color: '#20c997', fontWeight: 'bold', cursor: 'pointer' },
  inactiveTab: { flex: 1, textAlign: 'center', padding: '12px 0', color: '#888', cursor: 'pointer' },
  tableArea: { flex: 1, width: '100%', overflowY: 'auto' },
  tableRow: { display: 'flex', justifyContent: 'space-between', padding: '12px 10px', borderBottom: '1px solid #222', fontSize: '13px' },
  footer: { display: 'flex', justifyContent: 'space-between', marginTop: 'auto' },
  settingBtn: { padding: '8px 20px', backgroundColor: '#222', color: '#888', border: '1px solid #444', borderRadius: '4px', cursor: 'pointer' },
  exitBtn: { padding: '8px 20px', backgroundColor: 'transparent', color: '#ff4d4d', border: '1px solid #ff4d4d', borderRadius: '4px', cursor: 'pointer' }
};