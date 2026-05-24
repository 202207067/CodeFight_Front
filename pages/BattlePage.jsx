import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import useBattleStore from '../store/useBattleStore';

export default function BattlePage({ roomData, onExit, onShowResult }) {
  const { codes, setCode: saveCodeToStore, myCharacter } = useBattleStore();
  const [currentQIndex, setCurrentQIndex] = useState(1);
  const [tempCode, setTempCode] = useState(codes[currentQIndex] || '# 코드를 작성하세요.');

  const [showMoveModal, setShowMoveModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [targetIndex, setTargetIndex] = useState(null);

  // 🌟 관전 모드 상태 관리
  const [isSpectating, setIsSpectating] = useState(false);
  const [spectatingTarget, setSpectatingTarget] = useState(null);

  const [chatMessages, setChatMessages] = useState([
    { sender: 'System', text: '배틀에 입장하셨습니다.', type: 'system' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  
  const chatEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const opponentsData = roomData?.players || [
    { name: "코드마스터Hyun", tierIcon: "💎", tierColor: "#00dfff", progress: 80, codeIdx: 0 },
    { name: "도안팀장님", tierIcon: "✨", tierColor: "#e5e4e2", progress: 60, codeIdx: 1 },
    { name: "코딩하는고양이", tierIcon: "🥇", tierColor: "#ffcf40", progress: 40, codeIdx: 2 },
    { name: "자바새내기", tierIcon: "🥉", tierColor: "#cd7f32", progress: 20, codeIdx: 3 },
    { name: "늦게온사람", tierIcon: "🥈", tierColor: "#c0c0c0", progress: 0, codeIdx: 0 }
  ];

  const fakeOpponentCodes = [
    "def solution(arr):\n  answer = []\n  for i in arr:\n    if i > 0:\n      answer.append(i)\n  return answer",
    "def solution(arr):\n  # 고민중...\n  pass\n  # 어떻게 하더라...",
    "def solution(arr):\n  res = 0\n  for x in arr:\n    res += x\n  # 거의 다 풀었음\n  return res",
    "def solution(arr):\n  return [x for x in arr]\n  # 한줄 컷"
  ];

  useEffect(() => {
    if (isChatExpanded) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatExpanded]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatContainerRef.current && !chatContainerRef.current.contains(event.target)) {
        setIsChatExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAttemptMove = (nextIndex) => {
    if (isSpectating) return; // 관전 모드일 땐 이동 금지
    if (nextIndex < 1 || nextIndex > 5 || nextIndex === currentQIndex) return;
    setTargetIndex(nextIndex);
    setShowMoveModal(true);
  };

  const confirmMove = (shouldSave) => {
    if (shouldSave) saveCodeToStore(currentQIndex, tempCode);
    setCurrentQIndex(targetIndex);
    setTempCode(codes[targetIndex] || '# 코드를 작성하세요.');
    setShowMoveModal(false);
  };

  // 🌟 제출 시 관전 모드로 전환!
  const confirmSubmit = () => {
    saveCodeToStore(currentQIndex, tempCode);
    setShowSubmitModal(false);
    setIsSpectating(true); // 관전 모드 ON
    setSpectatingTarget(0); // 기본으로 첫 번째 플레이어 관전
    setChatMessages(prev => [...prev, { sender: 'System', text: '코드 제출 완료! 관전 모드로 전환됩니다.', type: 'system' }]);
  };

  // 🌟 수동으로 결과창으로 넘어가는 함수 (관전하다가 원할 때)
  const goToResults = () => {
    const mockResults = [
      { name: '현서 (나)', score: 95 },
      { name: '자바깎는노인', score: 80 },
      { name: '도안팀장님', score: 65 },
      { name: '뉴비123', score: 40 }
    ];
    if (onShowResult) onShowResult(mockResults);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, { sender: '나', text: chatInput, type: 'user' }]);
    setChatInput('');
  };

  return (
    <div style={styles.pageWrapper}>
      
      {showMoveModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.confirmModal}>
            <h3 style={styles.modalTitle}>임시 저장 확인</h3>
            <p style={styles.modalDesc}>
              페이지를 이동하시겠습니까?<br />
              현재 작성 중인 {currentQIndex}번 문제 코드를 저장할까요?
            </p>
            <div style={styles.modalBtnRow}>
              <button style={styles.modalCancelBtn} onClick={() => confirmMove(false)}>아니오 (그냥 이동)</button>
              <button style={styles.modalConfirmBtn} onClick={() => confirmMove(true)}>예 (저장 후 이동)</button>
            </div>
          </div>
        </div>
      )}

      {showSubmitModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.confirmModal}>
            <h3 style={styles.modalTitle}>최종 제출 확인</h3>
            <p style={styles.modalDesc}>
              작성한 코드를 제출하고 관전 모드로 전환하시겠습니까?
            </p>
            <div style={styles.modalBtnRow}>
              <button style={styles.modalCancelBtn} onClick={() => setShowSubmitModal(false)}>취소</button>
              <button style={styles.modalConfirmBtn} onClick={confirmSubmit}>제출 및 관전하기</button>
            </div>
          </div>
        </div>
      )}

      <div style={styles.leftSection}>
        {/* 🌟 관전 모드에 따른 헤더 변경 */}
        <h3 style={{...styles.headerTitle, color: isSpectating ? '#ff9f43' : '#20c997'}}>
          {isSpectating 
            ? `👀 관전 중: ${spectatingTarget !== null ? opponentsData[spectatingTarget].name : '플레이어를 선택하세요'}` 
            : 'My Code'}
        </h3>
        
        <div style={{...styles.editorWrapper, flex: isChatExpanded ? 2 : 1}}>
          <Editor
            height="100%"
            theme="vs-dark"
            language={roomData?.language?.toLowerCase() || 'python'}
            // 🌟 관전 모드면 상대방 코드를 띄워주고, 아니면 내 코드를 띄움
            value={isSpectating && spectatingTarget !== null 
              ? fakeOpponentCodes[opponentsData[spectatingTarget].codeIdx % fakeOpponentCodes.length] 
              : tempCode}
            onChange={isSpectating ? undefined : setTempCode}
            options={{ 
              fontSize: 14, 
              automaticLayout: true, 
              formatOnType: true, 
              minimap: { enabled: false },
              readOnly: isSpectating // 관전 중에는 수정 불가
            }}
          />
          {!isSpectating && <button style={styles.buildBtn}>▶ 빌드 (Run)</button>}
        </div>

        <div 
          ref={chatContainerRef} 
          style={{
            ...styles.chatWrapper, 
            flex: isChatExpanded ? 1 : 'none', 
            height: isChatExpanded ? 'auto' : '40px' 
          }}
        >
          <div style={styles.chatMessageList}>
            {chatMessages.map((msg, idx) => (
              <div key={idx} style={styles.chatMessageItem}>
                <span style={msg.type === 'system' ? styles.chatSystemSender : styles.chatSender}>
                  {msg.sender === 'System' ? '💬 ' : ''}{msg.sender}
                </span>
                <span style={msg.type === 'system' ? styles.chatSystemText : styles.chatText}>
                  {msg.text}
                </span>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <form style={styles.chatInputForm} onSubmit={handleSendMessage}>
            <input 
              style={styles.chatInput} 
              value={chatInput} 
              onChange={e => setChatInput(e.target.value)} 
              onFocus={() => setIsChatExpanded(true)}
              placeholder="메시지를 입력하세요..." 
            />
            <button type="submit" style={styles.chatSendBtn}>전송</button>
          </form>
        </div>
        
        <div style={styles.footerNav}>
          {isSpectating ? (
            // 🌟 관전 모드일 때 보여질 하단 버튼
            <button style={{...styles.submitBtn, backgroundColor: '#ff9f43', color: '#000'}} onClick={goToResults}>
              🏆 최종 결과 화면으로 이동
            </button>
          ) : (
            // 🌟 코딩 중일 때 보여질 기존 네비게이션
            <>
              <button style={styles.navBtn} onClick={() => handleAttemptMove(currentQIndex - 1)}>◀</button>
              <span style={{color: '#fff', fontWeight: 'bold'}}>{currentQIndex} / 5</span>
              <button style={styles.navBtn} onClick={() => handleAttemptMove(currentQIndex + 1)}>▶</button>
              <button style={styles.submitBtn} onClick={() => setShowSubmitModal(true)}>SUBMIT</button>
            </>
          )}
        </div>
      </div>

      <div style={styles.rightSection}>
        <div style={styles.otherPlayersBox}>
          <h3 style={styles.headerTitle}>Other Players {isSpectating && <span style={{fontSize: '12px', color: '#aaa'}}>(클릭하여 관전)</span>}</h3>
          
          <div style={{
            ...styles.playerGrid, 
            gridTemplateColumns: opponentsData.length === 1 ? '1fr' : '1fr 1fr'
          }}>
            {opponentsData.map((opp, idx) => (
              <div 
                key={idx} 
                style={{
                  ...styles.playerSlot, 
                  // 🌟 관전 모드일 때 마우스 올리면 포인터 뜨게 & 선택된 사람 하이라이트
                  cursor: isSpectating ? 'pointer' : 'default',
                  borderColor: isSpectating && spectatingTarget === idx ? '#ff9f43' : '#333',
                  boxShadow: isSpectating && spectatingTarget === idx ? '0 0 10px rgba(255,159,67,0.3)' : 'none'
                }}
                onClick={() => {
                  if (isSpectating) setSpectatingTarget(idx);
                }}
              >
                <div style={styles.playerInfoHead}>
                  <div style={styles.playerLeftInfo}>
                    <span style={{...styles.playerTierIcon, color: opp.tierColor}}>{opp.tierIcon}</span>
                    <span style={styles.playerNick}>{opp.name}</span>
                  </div>
                  
                  <div style={styles.progressBarContainer}>
                    <div style={{...styles.progressBarFill, width: `${opp.progress}%`}}></div>
                    <div style={styles.progressText}>{opp.progress}%</div>
                  </div>
                </div>
                
                <div style={styles.blurCodeBody}>
                  {fakeOpponentCodes[opp.codeIdx % fakeOpponentCodes.length]}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.problemBox}>
          <h3 style={styles.headerTitle}>Q{currentQIndex}. 배열의 중앙값 구하기</h3>
          <div style={styles.infoTable}>
            <div><span>언어:</span> {roomData?.language || 'Python'}</div>
            <div><span>난이도:</span> {roomData?.level || 'Level 1'}</div>
            <div><span>제한 시간:</span> {roomData?.time || '30분'}</div>
          </div>
          <p style={{fontSize: '14px', color: '#ccc', marginTop: '10px'}}>정수 배열 array가 매개변수로 주어질 때...</p>
          <button style={styles.exitBtn} onClick={onExit}>나가기</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: { display: 'flex', width: '100vw', height: '100vh', backgroundColor: '#0d0d0d', color: '#fff', padding: '15px', gap: '15px', boxSizing: 'border-box', overflow: 'hidden' },
  headerTitle: { color: '#20c997', margin: '0 0 10px 0', fontSize: '18px', flexShrink: 0 },
  leftSection: { flex: 3, display: 'flex', flexDirection: 'column', gap: '10px', minHeight: 0 },
  
  editorWrapper: { position: 'relative', border: '1px solid #333', minHeight: 0, overflow: 'hidden', borderRadius: '4px', transition: 'flex 0.3s ease' },
  buildBtn: { position: 'absolute', right: '15px', bottom: '15px', padding: '8px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', cursor: 'pointer', zIndex: 10, borderRadius: '4px' },
  
  chatWrapper: { border: '1px solid #333', backgroundColor: '#111', borderRadius: '4px', display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden', transition: 'flex 0.3s ease, height 0.3s ease' },
  chatMessageList: { flex: 1, padding: '10px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' },
  chatMessageItem: { fontSize: '13px', lineHeight: '1.4' },
  chatSender: { fontWeight: 'bold', color: '#aaa', marginRight: '6px' },
  chatText: { color: '#eee' },
  chatSystemSender: { fontWeight: 'bold', color: '#20c997', marginRight: '6px' },
  chatSystemText: { color: '#20c997', fontStyle: 'italic' },
  chatInputForm: { display: 'flex', borderTop: '1px solid #333', height: '40px', flexShrink: 0 },
  chatInput: { flex: 1, backgroundColor: 'transparent', border: 'none', color: '#fff', padding: '0 15px', outline: 'none', fontSize: '13px' },
  chatSendBtn: { backgroundColor: '#222', color: '#fff', border: 'none', borderLeft: '1px solid #333', padding: '0 20px', cursor: 'pointer', fontWeight: 'bold', transition: 'background 0.2s' },

  footerNav: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', padding: '10px', flexShrink: 0 },
  navBtn: { background: '#222', color: '#fff', border: '1px solid #444', padding: '5px 15px', cursor: 'pointer', borderRadius: '4px' },
  submitBtn: { padding: '8px 30px', backgroundColor: '#20c997', border: 'none', fontWeight: 'bold', cursor: 'pointer', color: '#000', borderRadius: '4px' },
  
  rightSection: { flex: 2, display: 'flex', flexDirection: 'column', gap: '15px', minHeight: 0 },
  otherPlayersBox: { flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 },
  
  playerGrid: { display: 'grid', gap: '10px', flex: 1, minHeight: 0, overflowY: 'auto', gridAutoRows: 'minmax(130px, 1fr)' },
  playerSlot: { display: 'flex', flexDirection: 'column', border: '1px solid #333', backgroundColor: '#111', borderRadius: '4px', overflow: 'hidden', transition: 'all 0.2s ease' },
  
  playerInfoHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', backgroundColor: '#1a1a1a', borderBottom: '1px solid #2a2a2a', width: '100%', boxSizing: 'border-box', flexShrink: 0 },
  playerLeftInfo: { display: 'flex', alignItems: 'center', gap: '6px' },
  playerTierIcon: { fontSize: '14px', filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.2))' },
  playerNick: { fontSize: '13px', fontWeight: 'bold', color: '#fff', marginRight: '5px' },
  
  progressBarContainer: { position: 'relative', width: '35%', minWidth: '60px', height: '14px', backgroundColor: '#333', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 },
  progressBarFill: { height: '100%', backgroundColor: '#20c997', transition: 'width 0.5s ease-out' },
  progressText: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold', color: '#fff', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' },
  
  blurCodeBody: { flex: 1, padding: '10px', color: '#569cd6', fontFamily: 'monospace', fontSize: '11px', whiteSpace: 'pre', textAlign: 'left', filter: 'blur(3px)', opacity: 0.5, pointerEvents: 'none', overflow: 'hidden' },

  problemBox: { flex: 1, border: '1px solid #333', padding: '15px', display: 'flex', flexDirection: 'column', minHeight: 0, borderRadius: '4px' },
  infoTable: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', backgroundColor: '#1a1a1a', padding: '10px', fontSize: '12px', flexShrink: 0 },
  exitBtn: { marginTop: 'auto', padding: '10px', backgroundColor: 'transparent', border: '1px solid #ff4d4d', color: '#ff4d4d', cursor: 'pointer', borderRadius: '4px', flexShrink: 0 },

  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  confirmModal: { width: '400px', backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '10px', padding: '30px', textAlign: 'center', color: '#fff', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' },
  modalTitle: { margin: '0 0 15px 0', fontSize: '20px', fontWeight: 'bold', color: '#20c997' },
  modalDesc: { margin: '0 0 25px 0', fontSize: '15px', color: '#ccc', lineHeight: '1.5' },
  modalBtnRow: { display: 'flex', gap: '15px', justifyContent: 'center' },
  modalCancelBtn: { flex: 1, padding: '12px 0', backgroundColor: '#333', color: '#fff', border: '1px solid #444', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  modalConfirmBtn: { flex: 1, padding: '12px 0', backgroundColor: '#20c997', color: '#000', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }
};