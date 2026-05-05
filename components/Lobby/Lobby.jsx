import React, { useState, useEffect, useRef } from 'react';
import CreateRoomModal from './CreateRoomModal'; 

export default function Lobby({ onJoinRoom, onStartPractice }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [rooms, setRooms] = useState([
    { id: 1, title: '파이썬 초보만 오세요', capacity: '1/2', level: 'Level 1', language: 'Python', time: '30분', status: 'STARTED', active: false },
    { id: 2, title: '자바 스프링 고수 구함', capacity: '1/1', level: 'Level 3', language: 'Java', time: '60분', status: 'WAITING', active: true },
    { id: 3, title: 'C++ 알고리즘 대비반', capacity: '2/4', level: 'Level 2', language: 'C++', time: '45분', status: 'WAITING', active: true },
    { id: 4, title: '프론트엔드 장인 구함', capacity: '1/2', level: 'Level 2', language: 'JS', time: '45분', status: 'STARTED', active: false },
  ]);

  const [chatMessages, setChatMessages] = useState([
    { type: 'system', text: '[시스템] 로비에 입장하셨습니다.' },
    { type: 'other', sender: '도안팀장님', text: '와이어프레임대로 잘 나왔네요!' }
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

  const handleCreateRoom = (newRoomData) => {
    const newRoom = {
      id: rooms.length + 1,
      title: newRoomData.title,
      capacity: newRoomData.capacity,
      level: newRoomData.level,
      language: newRoomData.language,
      time: newRoomData.time,
      status: 'WAITING',
      active: true
    };
    setRooms([...rooms, newRoom]); 
    setIsModalOpen(false); 
    onJoinRoom(newRoom); 
  };

  const users = [
    { rank: '🥈', name: '현서 (나)' },
    { rank: '🏆', name: '도안팀장님' },
    { rank: '🥉', name: '자바깎는노인' },
  ];

  return (
    // 🌟 1. 전체 래퍼는 화면을 꽉 채우지만 스크롤을 허용하게 변경 (y축 스크롤)
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        
        {/* 🌟 2. flexWrap 속성이 들어간 상/하단 구역 */}
        <div style={styles.topSection}>
          
          <div style={styles.roomWrapper}>
            {/* 🌟 3. gridTemplateColumns: auto-fit으로 창 크기에 따라 1~2줄 자동 변경 */}
            <div style={styles.grid}>
              {rooms.map(room => (
                <div key={room.id} style={{ ...styles.roomCard, borderColor: room.active ? '#20c997' : '#333' }} onClick={() => onJoinRoom(room)}>
                  <div style={styles.roomLeft}>
                    <div style={styles.roomId}>{room.id}</div>
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
            </div>

            <div style={styles.pagination}>
              <button style={styles.pageBtn}>◀</button>
              <span style={styles.pageText}>1 / N</span>
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
              <input 
                type="text" 
                placeholder="메시지를 입력하세요..." 
                style={styles.chatInput} 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
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
          <CreateRoomModal 
            onClose={() => setIsModalOpen(false)} 
            onCreate={handleCreateRoom}
          />
        )}

      </div>
    </div>
  );
}

// === 🌟 진짜 반응형을 구현한 마법의 스타일 시트 ===
const styles = {
  // 화면이 좁아져서 세로로 길어졌을 때 잘리지 않도록 overflow: auto를 줍니다. (x축 스크롤은 차단)
  pageWrapper: { width: '100%', height: '100vh', backgroundColor: '#0f0f0f', display: 'flex', justifyContent: 'center', overflowX: 'hidden', overflowY: 'auto' },
  
  // 높이를 100%나 고정값으로 주지 않고 minHeight를 주어 컨텐츠에 맞게 세로로 늘어날 수 있게 합니다.
  container: { width: '100%', maxWidth: '1400px', minHeight: '95vh', backgroundColor: '#121212', padding: '20px', margin: '20px', boxSizing: 'border-box', color: '#fff', display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: '"Inter", sans-serif', borderRadius: '12px', boxShadow: '0 0 30px rgba(0,0,0,0.8)' },
  
  // 🌟 핵심 1: flexWrap: 'wrap'을 주어 창이 좁아지면 옆에 있던 요소가 아래로 부드럽게 떨어집니다.
  topSection: { display: 'flex', gap: '20px', flexWrap: 'wrap' },
  bottomSection: { display: 'flex', gap: '20px', flexWrap: 'wrap' },

  // 🌟 핵심 2: flex: '1 1 300px' (최소 300px, 그 이상이면 여백을 채움)
  // 좌측(방목록, 채팅)은 최소 500px을 유지하려 하고, 우측(프로필, 랭킹)은 최소 250px을 유지합니다.
  roomWrapper: { flex: '3 1 500px', backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', minHeight: '300px' },
  profileWrapper: { flex: '1 1 250px', backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '30px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px' },
  
  chatWrapper: { flex: '3 1 500px', backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', minHeight: '250px' },
  socialWrapper: { flex: '1 1 250px', backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: '250px' },

  // 🌟 핵심 3: 방 목록이 화면 크기에 따라 1줄, 2줄, 3줄로 자유자재로 변합니다. (최소 250px)
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }, 
  
  roomCard: { display: 'flex', backgroundColor: '#222', border: '1px solid #333', borderRadius: '6px', cursor: 'pointer', minHeight: '80px' },
  roomLeft: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRight: '1px solid #333', padding: '10px' },
  roomId: { fontSize: '20px', fontWeight: 'bold', marginBottom: '5px' },
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