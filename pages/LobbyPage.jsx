import React, { useState, useEffect, useRef } from 'react';
import Modal from "../components/common/Modal";
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../utils/firebase'; 

export default function LobbyPage({ onJoinRoom, onStartPractice }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShopModalOpen, setIsShopModalOpen] = useState(false);
  const [myCoins, setMyCoins] = useState(500);

  const [rooms, setRooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 4; 
  const [activeTab, setActiveTab] = useState('friends');

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
    setChatMessages([...chatMessages, { type: 'me', sender: 'Hyunseo', scope: chatScope, text: chatInput }]);
    setChatInput('');
  };

  // 🌟 방 생성 시 "방장(나)" 딱 1명만 넣어서 저장합니다.
  const handleCreateRoom = async (newRoomData) => {
    try {
      const maxCap = Number(newRoomData.capacity) || 4;
      
      const initialPlayers = [
        { id: 1, name: "오현서 (Hyunseo)", status: "HOST", char: "👾", isHost: true }
      ];

      const docRef = await addDoc(collection(db, 'rooms'), {
        title: newRoomData.title,
        capacity: maxCap, 
        level: newRoomData.level,
        language: newRoomData.language,
        time: newRoomData.time,
        status: 'WAITING',
        active: true,
        players: initialPlayers, // 나 혼자 들어간 상태로 DB에 저장
        createdAt: serverTimestamp()
      });
      setIsModalOpen(false); 
      
      onJoinRoom({ id: docRef.id, ...newRoomData, capacity: maxCap, players: initialPlayers, status: 'WAITING' }); 
    } catch (error) {
      console.error("방 생성 실패:", error);
    }
  };

  const handleBuyItem = (itemName, price) => {
    if (myCoins >= price) {
      setMyCoins(prev => prev - price);
      alert(`[${itemName}] 아이템을 구매했습니다! (인벤토리에 추가됨)`);
    } else {
      alert('코인이 부족합니다! 게임을 플레이하여 코인을 모으세요.');
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
              {currentRooms.map(room => {
                const isWaiting = room.status === 'WAITING';
                const maxCap = Number(room.capacity) || 4; // 옛날 방은 4로 뜸
                const currentCount = room.players ? room.players.length : 1;

                return (
                  <div 
                    key={room.id} 
                    style={{ 
                      ...styles.roomCard, 
                      borderColor: isWaiting ? '#20c997' : '#333',
                      opacity: isWaiting ? 1 : 0.4, 
                      cursor: isWaiting ? 'pointer' : 'not-allowed'
                    }} 
                    onClick={() => {
                      if (isWaiting) onJoinRoom(room);
                    }}
                  >
                    <div style={styles.roomLeft}>
                      {/* 🌟 1 / 8 형태로 렌더링 */}
                      <div style={styles.roomId}>{currentCount} / {maxCap}</div>
                    </div>
                    <div style={styles.roomRight}>
                      <div style={styles.roomTitle}>{room.title}</div>
                      <div style={{ ...styles.roomStatus, color: isWaiting ? '#20c997' : '#555' }}>
                        {room.status}
                      </div>
                    </div>
                  </div>
                );
              })}
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

            <div style={styles.itemShopBox}>
              <div style={styles.shopHeader}>
                <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#20c997' }}>🛒 배틀 아이템 상점</span>
                <span style={{ fontSize: '12px', color: '#ffcf40', fontWeight: 'bold' }}>💰 {myCoins} C</span>
              </div>
              <button style={styles.shopBtn} onClick={() => setIsShopModalOpen(true)}>
                아이템 구매하기
              </button>
            </div>
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
              <select style={styles.chatSelect} value={chatScope} onChange={e => setChatScope(e.target.value)}>
                <option value="모두에게">모두에게</option><option value="친구에게">친구에게</option><option value="귓속말">귓속말</option>
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

        {isShopModalOpen && (
          <div style={styles.modalOverlay}>
            <div style={styles.shopModal}>
              <div style={styles.shopModalHeader}>
                <h3 style={styles.shopModalTitle}>🛒 아이템 상점</h3>
                <span style={styles.shopModalCoin}>💰 내 코인: {myCoins} C</span>
              </div>
              <p style={styles.shopModalDesc}>배틀에서 상대를 방해할 전략적인 아이템을 구매하세요.</p>
              
              <div style={styles.itemList}>
                <div style={styles.itemRow}>
                  <div style={styles.itemInfo}><div style={styles.itemName}>📏 라인 방해 아이템</div><div style={styles.itemDesc}>상대 코드 한 줄에 수류탄/연막탄 투척</div></div>
                  <button style={styles.buyBtn} onClick={() => handleBuyItem('라인 방해', 100)}>100 C</button>
                </div>
                <div style={styles.itemRow}>
                  <div style={styles.itemInfo}><div style={styles.itemName}>🔣 특수기호 아이템</div><div style={styles.itemDesc}>상대방 코드의 괄호나 세미콜론 조작</div></div>
                  <button style={styles.buyBtn} onClick={() => handleBuyItem('특수기호', 150)}>150 C</button>
                </div>
                <div style={styles.itemRow}>
                  <div style={styles.itemInfo}><div style={styles.itemName}>🛑 빌드 제한 아이템</div><div style={styles.itemDesc}>대상 플레이어 빌드 횟수 5회 제한</div></div>
                  <button style={{...styles.buyBtn, backgroundColor: '#ff4d4d', color: '#fff'}} onClick={() => handleBuyItem('빌드 제한', 300)}>300 C</button>
                </div>
              </div>

              <button style={styles.modalCloseBtn} onClick={() => setIsShopModalOpen(false)}>상점 닫기</button>
            </div>
          </div>
        )}
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
  roomCard: { display: 'flex', backgroundColor: '#222', border: '1px solid #333', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s ease' },
  emptyCardSlot: { display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#151515', border: '1px dashed #333', borderRadius: '6px', color: '#444' },
  roomLeft: { width: '90px', borderRight: '1px solid #333', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' },
  roomId: { fontSize: '18px', fontWeight: '900', color: '#aaa', letterSpacing: '2px' },
  roomRight: { flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  roomTitle: { fontSize: '15px', fontWeight: 'bold', marginBottom: '8px' },
  roomStatus: { fontSize: '14px', fontWeight: 'bold' },
  pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', margin: '25px 0' },
  pageBtn: { backgroundColor: '#252525', color: '#fff', border: '1px solid #444', padding: '5px 15px', cursor: 'pointer' },
  pageText: { fontSize: '14px', fontWeight: 'bold' },
  actionRow: { display: 'flex', gap: '10px' },
  createBtn: { flex: 1, padding: '14px', backgroundColor: '#20c997', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  normalBtn: { flex: 1, padding: '14px', backgroundColor: '#2a2a2a', color: '#aaa', border: '1px solid #444', borderRadius: '6px', cursor: 'pointer' },
  avatar: { width: '80px', height: '80px', backgroundColor: '#007bff', borderRadius: '50%', marginBottom: '15px', border: '3px solid #1a1a1a', boxShadow: '0 0 0 2px #007bff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '20px' },
  profileName: { fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' },
  profileRank: { fontSize: '13px', color: '#20c997', marginBottom: '20px' },
  viewCodeBtn: { width: '100%', padding: '10px', backgroundColor: '#252525', border: '1px solid #444', color: '#fff', borderRadius: '6px', marginBottom: '25px', cursor: 'pointer' },
  expHeader: { width: '100%', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#888', marginBottom: '8px' },
  expBarBg: { width: '100%', height: '8px', backgroundColor: '#333', borderRadius: '4px' },
  expBarFill: { width: '72.5%', height: '100%', backgroundColor: '#007bff', borderRadius: '4px' },
  itemShopBox: { width: '100%', backgroundColor: '#222', border: '1px solid #333', borderRadius: '8px', padding: '15px', marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '15px', boxSizing: 'border-box' },
  shopHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  shopBtn: { width: '100%', padding: '12px', backgroundColor: '#111', border: '1px solid #20c997', color: '#20c997', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s' },
  chatWrapper: { width: '850px', backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' },
  chatLog: { flex: 1, backgroundColor: '#111', padding: '15px', overflowY: 'auto', marginBottom: '15px', fontSize: '14px', borderRadius: '4px', border: '1px solid #222' },
  chatInputRow: { display: 'flex', gap: '10px', height: '40px' },
  chatSelect: { width: '100px', backgroundColor: '#222', color: '#ccc', border: '1px solid #444', borderRadius: '4px', padding: '0 5px' },
  chatInput: { flex: 1, backgroundColor: '#111', color: '#fff', border: '1px solid #444', borderRadius: '4px', padding: '0 15px' },
  chatSendBtn: { width: '80px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' },
  tabs: { display: 'flex', width: '100%', backgroundColor: '#222', borderRadius: '4px 4px 0 0', overflow: 'hidden' },
  activeTab: { flex: 1, textAlign: 'center', padding: '12px 0', borderBottom: '2px solid #20c997', color: '#20c997', fontWeight: 'bold', cursor: 'pointer' },
  inactiveTab: { flex: 1, textAlign: 'center', padding: '12px 0', color: '#888', cursor: 'pointer' },
  tableArea: { flex: 1, width: '100%', overflowY: 'auto', backgroundColor: '#111', borderRadius: '0 0 4px 4px', border: '1px solid #222', borderTop: 'none' },
  tableRow: { display: 'flex', justifyContent: 'space-between', padding: '12px 15px', borderBottom: '1px solid #222', fontSize: '13px' },
  footer: { display: 'flex', justifyContent: 'space-between', marginTop: 'auto' },
  settingBtn: { padding: '8px 20px', backgroundColor: '#222', color: '#888', border: '1px solid #444', borderRadius: '4px', cursor: 'pointer' },
  exitBtn: { padding: '8px 20px', backgroundColor: 'transparent', color: '#ff4d4d', border: '1px solid #ff4d4d', borderRadius: '4px', cursor: 'pointer' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  shopModal: { width: '500px', backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', padding: '30px', color: '#fff', boxShadow: '0 15px 40px rgba(0,0,0,0.8)' },
  shopModalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333', paddingBottom: '15px', marginBottom: '15px' },
  shopModalTitle: { margin: 0, fontSize: '22px', color: '#20c997' },
  shopModalCoin: { fontSize: '16px', fontWeight: 'bold', color: '#ffcf40', backgroundColor: '#222', padding: '5px 12px', borderRadius: '20px', border: '1px solid #444' },
  shopModalDesc: { fontSize: '14px', color: '#aaa', marginBottom: '25px', textAlign: 'center' },
  itemList: { display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' },
  itemRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#222', padding: '15px 20px', borderRadius: '8px', border: '1px solid #444' },
  itemInfo: { display: 'flex', flexDirection: 'column', gap: '5px' },
  itemName: { fontSize: '16px', fontWeight: 'bold', color: '#fff' },
  itemDesc: { fontSize: '12px', color: '#888' },
  buyBtn: { padding: '8px 20px', backgroundColor: '#ffcf40', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer', transition: 'transform 0.1s' },
  modalCloseBtn: { width: '100%', padding: '12px', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }
};