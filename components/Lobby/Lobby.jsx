import React, { useState, useEffect, useRef } from 'react';
import CreateRoomModal from './CreateRoomModal'; 

// 🌟 Firebase 실시간 통신을 위한 마법의 함수들 가져오기
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
// 🌟 아까 만든 firebase.js의 위치를 잘 맞춰주세요! (src/components/Lobby/Lobby.jsx 기준)
import { db } from '../../firebase'; 

export default function Lobby({ onJoinRoom, onStartPractice }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🌟 가짜 데이터 삭제! 처음엔 빈 배열로 시작합니다.
  const [rooms, setRooms] = useState([]);

  const [chatMessages, setChatMessages] = useState([
    { type: 'system', text: '[시스템] 로비에 입장하셨습니다.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatLogRef = useRef(null);

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

  // ==========================================
  // 🌟 [안테나] Firebase에서 실시간으로 방 목록 훔쳐보기
  // ==========================================
  useEffect(() => {
    // 'rooms'라는 방 목록 폴더를 최신순으로 가져오는 쿼리
    const q = query(collection(db, 'rooms'), orderBy('createdAt', 'desc'));

    // DB에 방이 생기거나 지워질 때마다 알아서 실행됨!
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const roomDataFromDB = snapshot.docs.map(doc => ({
        id: doc.id, // Firebase가 만들어준 고유 문자열 ID
        ...doc.data()
      }));
      setRooms(roomDataFromDB); // 내 화면 즉시 업데이트!
    });

    return () => unsubscribe(); // 로비 화면 나갈 때 안테나 끄기
  }, []);

  // ==========================================
  // 🌟 [방 만들기] 누르면 Firebase로 데이터 쏘기
  // ==========================================
  const handleCreateRoom = async (newRoomData) => {
    try {
      // Firebase 'rooms' 폴더에 방 정보 밀어넣기
      const docRef = await addDoc(collection(db, 'rooms'), {
        title: newRoomData.title,
        capacity: newRoomData.capacity,
        level: newRoomData.level,
        language: newRoomData.language,
        time: newRoomData.time,
        status: 'WAITING',
        active: true,
        createdAt: serverTimestamp() // 지금 시간 기록
      });

      setIsModalOpen(false); 
      // 생성된 방의 진짜 ID를 가지고 대기실로 이동!
      onJoinRoom({ id: docRef.id, ...newRoomData, status: 'WAITING' }); 

    } catch (error) {
      console.error("방 생성 중 에러 발생:", error);
      alert("서버 연결에 실패했습니다.");
    }
  };

  const users = [
    { rank: '🥈', name: '현서 (나)' },
    { rank: '🏆', name: '도안팀장님' },
    { rank: '🥉', name: '자바깎는노인' },
  ];

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        
        <div style={styles.topSection}>
          <div style={styles.roomWrapper}>
            
            <div style={styles.grid}>
              {rooms.map(room => (
                <div key={room.id} style={{ ...styles.roomCard, borderColor: room.active ? '#20c997' : '#333' }} onClick={() => onJoinRoom(room)}>
                  <div style={styles.roomLeft}>
                    {/* 🌟 방 번호가 길어질 수 있어서 UI 살짝 조정 */}
                    <div style={styles.roomId}>Room</div>
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
              
              {/* 방이 1개도 없을 때 보여줄 안내문 */}
              {rooms.length === 0 && (
                <div style={{ color: '#888', gridColumn: '1 / -1', textAlign: 'center', marginTop: '50px' }}>
                  현재 생성된 방이 없습니다. 첫 번째 방을 만들어보세요!
                </div>
              )}
            </div>

            <div style={styles.pagination}>
              <button style={styles.pageBtn}>◀</button>
              <span style={styles.pageText}>1 / 1</span>
              <button style={styles.pageBtn}>▶</button>
            </div>

            <div style={styles.actionRow}>
              <button style={styles.createBtn} onClick={() => setIsModalOpen(true)}>방만들기</button>
              <button style={styles.normalBtn}>모드 선택</button>
              <button style={styles.normalBtn} onClick={onStartPractice}>연습모드</button>
            </div>
          </div>

          <div style={styles.profileWrapper}>
            <div style={styles.avatar}>ME</div>
            <div style={styles.profileName}>현서 (Hyeonseo)</div>
            <div style={styles.profileRank}>Silver II</div>
            <div style={styles.expHeader}><span>경험치</span><span>1450 / 2000</span></div>
            <div style={styles.expBarBg}><div style={styles.expBarFill}></div></div>
          </div>
        </div>

        <div style={styles.bottomSection}>
          <div style={styles.chatWrapper}>
            <div style={styles.chatLog} ref={chatLogRef}>
              {chatMessages.map((msg, idx) => (
                <div key={idx} style={{ marginBottom: '8px', wordBreak: 'break-word', textAlign: 'left' }}>
                  {msg.type === 'system' && <span style={{ color: '#aaa' }}>{msg.text}</span>}
                  {msg.type === 'other' && <><span style={{ color: '#e6b800' }}>[{msg.sender}]</span> {msg.text}</>}
                  {msg.type === 'me' && <><span style={{ color: '#007bff' }}>[{msg.sender}]</span> {msg.text}</>}
                </div>
              ))}
            </div>
            <div style={styles.chatInputRow}>
              <select style={styles.chatSelect}><option>전체</option></select>
              <input type="text" placeholder="메시지를 입력하세요..." style={styles.chatInput} value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={handleKeyDown} />
              <button style={styles.chatSendBtn} onClick={handleSendMessage}>전송</button>
            </div>
          </div>

          <div style={styles.socialWrapper}>
            <div style={styles.tabs}><div style={styles.activeTab}>일반</div><div style={styles.inactiveTab}>랭킹</div></div>
            <div style={styles.tableHeader}><span style={{ flex: 1, textAlign: 'center' }}>랭크 마크</span><span style={{ flex: 2, textAlign: 'center' }}>닉네임</span></div>
            <div style={styles.tableBody}>
              {users.map((user, idx) => (
                <div key={idx} style={styles.tableRow}>
                  <span style={{ flex: 1, textAlign: 'center', fontSize: '18px' }}>{user.rank}</span>
                  <span style={{ flex: 2, textAlign: 'center', color: '#ccc' }}>{user.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={styles.footer}>
          <button style={styles.settingBtn}>도움말 / 설정</button>
          <button style={styles.exitBtn}>종료</button>
        </div>

        {isModalOpen && (
          <CreateRoomModal onClose={() => setIsModalOpen(false)} onCreate={handleCreateRoom} />
        )}
      </div>
    </div>
  );
}

// === 반응형 디자인 (기존과 동일) ===
const styles = {
  pageWrapper: { width: '100%', height: '100vh', backgroundColor: '#0f0f0f', display: 'flex', justifyContent: 'center', overflowX: 'hidden', overflowY: 'auto' },
  container: { width: '100%', maxWidth: '1400px', minHeight: '95vh', backgroundColor: '#121212', padding: '20px', margin: '20px', boxSizing: 'border-box', color: '#fff', display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: '"Inter", sans-serif', borderRadius: '12px', boxShadow: '0 0 30px rgba(0,0,0,0.8)' },
  topSection: { display: 'flex', gap: '20px', flexWrap: 'wrap' },
  bottomSection: { display: 'flex', gap: '20px', flexWrap: 'wrap' },
  roomWrapper: { flex: '3 1 500px', backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', minHeight: '300px' },
  profileWrapper: { flex: '1 1 250px', backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '30px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px' },
  chatWrapper: { flex: '3 1 500px', backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', minHeight: '250px' },
  socialWrapper: { flex: '1 1 250px', backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: '250px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }, 
  roomCard: { display: 'flex', backgroundColor: '#222', border: '1px solid #333', borderRadius: '6px', cursor: 'pointer', minHeight: '80px' },
  roomLeft: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRight: '1px solid #333', padding: '10px' },
  roomId: { fontSize: '16px', fontWeight: 'bold', marginBottom: '5px' },
  roomCap: { fontSize: '12px', color: '#888' },
  roomRight: { flex: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '10px' },
  roomTitle: { fontSize: '14px', color: '#ccc', marginBottom: '8px', fontWeight: 'bold', textAlign: 'center' },
  roomStatus: { fontSize: '15px', fontWeight: '900' },
  pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', margin: '20px 0' },
  pageBtn: { backgroundColor: '#222', border: '1px solid #444', color: '#fff', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer' },
  pageText: { fontSize: '14px', fontWeight: 'bold' },
  actionRow: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  createBtn: { flex: '1 1 120px', padding: '12px', backgroundColor: '#20c997', color: '#000', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' },
  normalBtn: { flex: '1 1 120px', padding: '12px', backgroundColor: '#2a2a2a', color: '#aaa', border: '1px solid #444', borderRadius: '6px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' },
  avatar: { width: '80px', height: '80px', backgroundColor: '#007bff', borderRadius: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '24px', fontWeight: 'bold', marginBottom: '15px' },
  profileName: { fontSize: '20px', fontWeight: 'bold', marginBottom: '8px', textAlign: 'center' },
  profileRank: { fontSize: '14px', color: '#20c997', fontWeight: 'bold', marginBottom: '20px' },
  expHeader: { width: '100%', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#aaa', marginBottom: '8px' },
  expBarBg: { width: '100%', height: '8px', backgroundColor: '#333', borderRadius: '4px', overflow: 'hidden' },
  expBarFill: { width: '72.5%', height: '100%', backgroundColor: '#007bff' },
  chatLog: { flex: 1, backgroundColor: '#111', border: '1px solid #222', borderRadius: '6px', padding: '15px', fontSize: '14px', marginBottom: '15px', overflowY: 'auto', minHeight: '150px', textAlign: 'left' },
  chatInputRow: { display: 'flex', gap: '10px', height: '40px', flexShrink: 0 },
  chatSelect: { width: '70px', backgroundColor: '#222', color: '#fff', border: '1px solid #444', borderRadius: '4px', padding: '0 5px', fontSize: '13px' },
  chatInput: { flex: 1, backgroundColor: '#111', color: '#fff', border: '1px solid #444', borderRadius: '4px', padding: '0 15px', fontSize: '13px', minWidth: 0 },
  chatSendBtn: { width: '70px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' },
  tabs: { display: 'flex', flexShrink: 0 },
  activeTab: { flex: 1, textAlign: 'center', padding: '12px 0', borderBottom: '2px solid #20c997', fontWeight: 'bold', fontSize: '14px' },
  inactiveTab: { flex: 1, textAlign: 'center', padding: '12px 0', borderBottom: '1px solid #333', color: '#888', fontSize: '14px' },
  tableHeader: { display: 'flex', padding: '10px 0', fontSize: '12px', color: '#888', borderBottom: '1px solid #333', flexShrink: 0 },
  tableBody: { flex: 1, overflowY: 'auto' },
  tableRow: { display: 'flex', padding: '12px 0', borderBottom: '1px solid #222', alignItems: 'center' },
  footer: { display: 'flex', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '10px', flexShrink: 0 },
  settingBtn: { padding: '8px 20px', backgroundColor: '#222', border: '1px solid #444', color: '#ccc', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' },
  exitBtn: { padding: '8px 20px', backgroundColor: 'transparent', border: '1px solid #ff4d4d', color: '#ff4d4d', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }
};