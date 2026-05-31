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

  // 🌟 채팅 상태
  const [chatMessages, setChatMessages] = useState([{ sender: 'System', text: '배틀에 입장하셨습니다.', type: 'system' }]);
  const [chatInput, setChatInput] = useState('');
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const chatEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // 🌟 관전 모드 (제출 후)
  const [isSpectating, setIsSpectating] = useState(false);
  const [spectatingTarget, setSpectatingTarget] = useState(null);

  // 🌟 아이템 공격 시스템 상태
  const [attackTarget, setAttackTarget] = useState(null); // 공격할 대상 index
  const [itemStep, setItemStep] = useState('none'); // 'none' | 'main_select' | 'reveal_10s' | 'sub_select'
  const [selectedMainItem, setSelectedMainItem] = useState(null); // 'line' | 'symbol' | 'build'
  const [revealTimer, setRevealTimer] = useState(10);
  const [selectedLine, setSelectedLine] = useState(null); // 클릭한 줄 번호
  const editorRef = useRef(null);

  const opponentsData = roomData?.players || [
    { name: "코드마스터Hyun", tierIcon: "💎", tierColor: "#00dfff", progress: 80, codeIdx: 0 },
    { name: "도안팀장님", tierIcon: "✨", tierColor: "#e5e4e2", progress: 60, codeIdx: 1 },
    { name: "코딩하는고양이", tierIcon: "🥇", tierColor: "#ffcf40", progress: 40, codeIdx: 2 },
    { name: "자바새내기", tierIcon: "🥉", tierColor: "#cd7f32", progress: 20, codeIdx: 3 }
  ];

  const fakeOpponentCodes = [
    "def solution(arr):\n  answer = []\n  for i in arr:\n    if i > 0:\n      answer.append(i)\n  return answer",
    "def solution(arr):\n  # 고민중...\n  pass\n  # 어떻게 하더라...",
    "def solution(arr):\n  res = 0\n  for x in arr:\n    res += x\n  # 거의 다 풀었음\n  return res",
    "def solution(arr):\n  return [x for x in arr]\n  # 한줄 컷"
  ];

  // 채팅 스크롤 및 외부 클릭 감지
  useEffect(() => { if (isChatExpanded) chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatMessages, isChatExpanded]);
  useEffect(() => {
    const handleClickOutside = (e) => { if (chatContainerRef.current && !chatContainerRef.current.contains(e.target)) setIsChatExpanded(false); };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 10초 타이머 로직 (아이템 사용 시 상대 코드 오픈)
  useEffect(() => {
    let timer;
    if (itemStep === 'reveal_10s' && revealTimer > 0) {
      timer = setInterval(() => setRevealTimer(p => p - 1), 1000);
    } else if (itemStep === 'reveal_10s' && revealTimer === 0) {
      alert('아이템 사용 시간이 초과되었습니다!');
      cancelAttack();
    }
    return () => clearInterval(timer);
  }, [itemStep, revealTimer]);

  // Monaco Editor 마운트 시 (줄 클릭 이벤트 연동)
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    editor.onMouseDown((e) => {
      if (itemStep === 'reveal_10s' && selectedMainItem !== 'build') {
        const lineNumber = e.target.position?.lineNumber;
        if (lineNumber) {
          setSelectedLine(lineNumber);
          setItemStep('sub_select');
        }
      }
    });
  };

  const cancelAttack = () => {
    setAttackTarget(null);
    setItemStep('none');
    setSelectedMainItem(null);
    setRevealTimer(10);
    setSelectedLine(null);
  };

  const handlePlayerClick = (idx) => {
    if (isSpectating) {
      setSpectatingTarget(idx);
    } else {
      setAttackTarget(idx);
      setItemStep('none');
    }
  };

  const executeItemAttack = (subItemName) => {
    alert(`${opponentsData[attackTarget].name}님에게 [${subItemName}] 공격 성공! (대상 줄: ${selectedLine}번째 줄)`);
    cancelAttack(); 
  };

  // 🌟 복구된 로직 1: 페이지 이동 시도 시 모달 호출
  const handleAttemptMove = (nextIndex) => {
    // 관전 중이거나 공격 타겟팅 중일 때는 문제 이동 금지
    if (isSpectating || attackTarget !== null) return;
    if (nextIndex < 1 || nextIndex > 5 || nextIndex === currentQIndex) return;
    
    setTargetIndex(nextIndex);
    setShowMoveModal(true);
  };

  // 🌟 복구된 로직 2: 모달에서 예/아니오 선택 시 동작
  const confirmMove = (shouldSave) => {
    if (shouldSave) saveCodeToStore(currentQIndex, tempCode);
    setCurrentQIndex(targetIndex);
    setTempCode(codes[targetIndex] || '# 코드를 작성하세요.');
    setShowMoveModal(false);
  };

  const confirmSubmit = () => {
    saveCodeToStore(currentQIndex, tempCode);
    setShowSubmitModal(false);
    setIsSpectating(true);
    setSpectatingTarget(0);
    setChatMessages(prev => [...prev, { sender: 'System', text: '제출 완료! 관전 모드로 전환됩니다.', type: 'system' }]);
  };

  return (
    <div style={styles.pageWrapper}>
      
      {/* 🌟 임시 저장 모달 (복구 완료) */}
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

      {/* 최종 제출 모달 */}
      {showSubmitModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.confirmModal}>
            <h3 style={styles.modalTitle}>최종 제출 확인</h3>
            <p style={styles.modalDesc}>작성한 코드를 제출하시겠습니까?</p>
            <div style={styles.modalBtnRow}>
              <button style={styles.modalCancelBtn} onClick={() => setShowSubmitModal(false)}>취소</button>
              <button style={styles.modalConfirmBtn} onClick={confirmSubmit}>제출 및 관전하기</button>
            </div>
          </div>
        </div>
      )}

      {/* 메인 아이템 선택 모달 */}
      {itemStep === 'main_select' && (
        <div style={styles.modalOverlay}>
          <div style={styles.itemModal}>
            <h3 style={{...styles.modalTitle, color: '#ff4d4d'}}>⚔️ 아이템 선택</h3>
            <p style={styles.modalDesc}>{opponentsData[attackTarget].name}님을 공격할 아이템을 선택하세요.</p>
            <div style={{display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px'}}>
              <button style={styles.itemSelectBtn} onClick={() => { setSelectedMainItem('line'); setItemStep('reveal_10s'); }}>
                📏 라인 아이템 (특정 줄 방해)
              </button>
              <button style={styles.itemSelectBtn} onClick={() => { setSelectedMainItem('symbol'); setItemStep('reveal_10s'); }}>
                🔣 특수기호 아이템 (문자 추가/삭제)
              </button>
              <button style={styles.itemSelectBtn} onClick={() => {
                alert(`${opponentsData[attackTarget].name}님의 빌드 횟수를 5회로 제한했습니다!`);
                cancelAttack();
              }}>
                🛑 빌드제한 아이템 (빌드 5회 제한)
              </button>
            </div>
            <button style={styles.modalCancelBtn} onClick={cancelAttack}>공격 취소</button>
          </div>
        </div>
      )}

      {/* 서브 아이템 선택 모달 (줄 선택 후) */}
      {itemStep === 'sub_select' && (
        <div style={styles.modalOverlay}>
          <div style={styles.itemModal}>
            <h3 style={{...styles.modalTitle, color: '#ff4d4d'}}>💣 {selectedLine}번째 줄 공격</h3>
            
            {selectedMainItem === 'line' && (
              <div style={{display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px'}}>
                <button style={styles.itemSelectBtn} onClick={() => executeItemAttack('수류탄')}>🧨 수류탄 (해당 줄 삭제)</button>
                <button style={styles.itemSelectBtn} onClick={() => executeItemAttack('연막탄')}>💨 연막탄 (10초간 흐릿하게)</button>
                <button style={styles.itemSelectBtn} onClick={() => executeItemAttack('섬광탄')}>✨ 섬광탄 (10초간 눈부심)</button>
              </div>
            )}

            {selectedMainItem === 'symbol' && (
              <div style={{display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px'}}>
                <button style={styles.itemSelectBtn} onClick={() => executeItemAttack('세미콜론 삭제')}>; 세미콜론 파괴</button>
                <button style={styles.itemSelectBtn} onClick={() => executeItemAttack('괄호 추가')}>) 괄호 억지 추가</button>
                <button style={styles.itemSelectBtn} onClick={() => executeItemAttack('들여쓰기 파괴')}>↹ 들여쓰기 박살</button>
              </div>
            )}
            
            <button style={styles.modalCancelBtn} onClick={() => setItemStep('reveal_10s')}>뒤로 가기</button>
          </div>
        </div>
      )}

      {/* 좌측 메인 영역 */}
      <div style={styles.leftSection}>
        {/* 헤더 동적 렌더링 */}
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h3 style={{
            ...styles.headerTitle, 
            color: isSpectating ? '#ff9f43' : (attackTarget !== null ? '#ff4d4d' : '#20c997')
          }}>
            {isSpectating ? `👀 관전 중: ${opponentsData[spectatingTarget]?.name}` 
             : attackTarget !== null ? `⚔️ 공격 모드: ${opponentsData[attackTarget]?.name} (타겟팅 중)` 
             : 'My Code'}
          </h3>

          {/* 10초 카운트다운 경고문 */}
          {itemStep === 'reveal_10s' && (
            <span style={{color: '#ff4d4d', fontWeight: 'bold', fontSize: '18px', animation: 'blink 1s infinite'}}>
              ⏳ 타임 어택: {revealTimer}초 남음! (공격할 줄을 클릭하세요)
            </span>
          )}
        </div>
        
        <div style={{...styles.editorWrapper, flex: isChatExpanded ? 2 : 1}}>
          {/* 타겟의 코드가 10초간 드러나기 전에는 블러 처리 */}
          {attackTarget !== null && itemStep === 'none' && (
             <div style={styles.bigBlurOverlay}>
               <h2 style={{color: '#fff', marginBottom: '20px'}}>대상의 코드가 암호화되어 있습니다.</h2>
               <button style={styles.useItemBtn} onClick={() => setItemStep('main_select')}>
                 💣 아이템 사용하기
               </button>
               <button style={{...styles.modalCancelBtn, marginTop: '10px'}} onClick={cancelAttack}>돌아가기</button>
             </div>
          )}

          <Editor
            height="100%"
            theme="vs-dark"
            language={roomData?.language?.toLowerCase() || 'python'}
            onMount={handleEditorDidMount}
            value={
              isSpectating ? fakeOpponentCodes[opponentsData[spectatingTarget]?.codeIdx % 4] 
              : attackTarget !== null ? fakeOpponentCodes[opponentsData[attackTarget]?.codeIdx % 4] 
              : tempCode
            }
            onChange={!isSpectating && attackTarget === null ? setTempCode : undefined}
            options={{ 
              fontSize: 14, automaticLayout: true, minimap: { enabled: false },
              readOnly: isSpectating || attackTarget !== null
            }}
          />
          {!isSpectating && attackTarget === null && <button style={styles.buildBtn}>▶ 빌드 (Run)</button>}
        </div>

        {/* 채팅 입력칸 */}
        <div ref={chatContainerRef} style={{...styles.chatWrapper, flex: isChatExpanded ? 1 : 'none', height: isChatExpanded ? 'auto' : '40px' }}>
          <div style={styles.chatMessageList}>
            {chatMessages.map((msg, idx) => (
              <div key={idx} style={styles.chatMessageItem}>
                <span style={msg.type === 'system' ? styles.chatSystemSender : styles.chatSender}>{msg.sender === 'System' ? '💬 ' : ''}{msg.sender}</span>
                <span style={msg.type === 'system' ? styles.chatSystemText : styles.chatText}>{msg.text}</span>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <form style={styles.chatInputForm} onSubmit={(e) => { e.preventDefault(); if(chatInput){ setChatMessages(p=>[...p, {sender:'나', text:chatInput, type:'user'}]); setChatInput(''); }}}>
            <input style={styles.chatInput} value={chatInput} onChange={e => setChatInput(e.target.value)} onFocus={() => setIsChatExpanded(true)} placeholder="메시지를 입력하세요..." />
            <button type="submit" style={styles.chatSendBtn}>전송</button>
          </form>
        </div>
        
        {/* 🌟 하단 네비게이션 연동 부분 (복구 완료) */}
        <div style={styles.footerNav}>
          {isSpectating ? (
            <button style={{...styles.submitBtn, backgroundColor: '#ff9f43', color: '#000'}} onClick={() => onShowResult([])}>🏆 최종 결과 화면으로 이동</button>
          ) : attackTarget !== null ? (
            <button style={styles.modalCancelBtn} onClick={cancelAttack}>공격 취소하고 내 코드로 돌아가기</button>
          ) : (
            <>
              {/* 이전처럼 숫자가 바로 바뀌는게 아니라 handleAttemptMove를 호출합니다 */}
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
          <h3 style={styles.headerTitle}>Other Players <span style={{fontSize: '12px', color: '#aaa'}}>(클릭하여 공격/관전)</span></h3>
          <div style={{...styles.playerGrid, gridTemplateColumns: opponentsData.length === 1 ? '1fr' : '1fr 1fr'}}>
            {opponentsData.map((opp, idx) => {
              const isTargeted = (isSpectating && spectatingTarget === idx) || (!isSpectating && attackTarget === idx);
              return (
                <div 
                  key={idx} 
                  style={{
                    ...styles.playerSlot, 
                    cursor: 'pointer',
                    borderColor: isTargeted ? (isSpectating ? '#ff9f43' : '#ff4d4d') : '#333',
                    boxShadow: isTargeted ? (isSpectating ? '0 0 10px rgba(255,159,67,0.3)' : '0 0 10px rgba(255,77,77,0.3)') : 'none'
                  }}
                  onClick={() => handlePlayerClick(idx)}
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
              )
            })}
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

// 스타일 정의 
const styles = {
  pageWrapper: { display: 'flex', width: '100vw', height: '100vh', backgroundColor: '#0d0d0d', color: '#fff', padding: '15px', gap: '15px', boxSizing: 'border-box', overflow: 'hidden' },
  headerTitle: { color: '#20c997', margin: '0 0 10px 0', fontSize: '18px', flexShrink: 0 },
  leftSection: { flex: 3, display: 'flex', flexDirection: 'column', gap: '10px', minHeight: 0 },
  
  editorWrapper: { position: 'relative', border: '1px solid #333', minHeight: 0, overflow: 'hidden', borderRadius: '4px', transition: 'flex 0.3s ease' },
  buildBtn: { position: 'absolute', right: '15px', bottom: '15px', padding: '8px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', cursor: 'pointer', zIndex: 10, borderRadius: '4px' },
  
  bigBlurOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 20, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' },
  useItemBtn: { padding: '15px 40px', fontSize: '20px', fontWeight: 'bold', backgroundColor: '#ff4d4d', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', boxShadow: '0 5px 15px rgba(255, 77, 77, 0.4)' },
  itemModal: { width: '450px', backgroundColor: '#1a1a1a', border: '1px solid #ff4d4d', borderRadius: '10px', padding: '30px', textAlign: 'center', color: '#fff', boxShadow: '0 10px 30px rgba(255,77,77,0.2)' },
  itemSelectBtn: { width: '100%', padding: '15px', backgroundColor: '#222', border: '1px solid #444', color: '#fff', fontSize: '15px', fontWeight: 'bold', borderRadius: '6px', cursor: 'pointer', textAlign: 'left', transition: 'background 0.2s' },

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