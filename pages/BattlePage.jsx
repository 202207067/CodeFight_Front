import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import useBattleStore from '../store/useBattleStore'; 

export default function BattlePage({ roomData, onExit, onShowResult }) {
  const { codes, setCode: saveCodeToStore } = useBattleStore();

  const getDefaultCode = (qNum) => `def solution(num1, num2):\n    answer = 0\n    # ${qNum}번 문제 로직을 작성하세요.\n    return answer`;

  const [tempCode, setTempCode] = useState(codes[1] || getDefaultCode(1));
  const [currentQIndex, setCurrentQIndex] = useState(1);
  const totalQ = parseInt(roomData?.questionCount) || 5;
  
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [targetQIndex, setTargetQIndex] = useState(null);

  const [isBuilding, setIsBuilding] = useState(false);
  const [buildLogs, setBuildLogs] = useState([]);
  const terminalRef = useRef(null);

  useEffect(() => {
    if (isGameOver) {
      const timer = setTimeout(() => onShowResult(), 3000);
      return () => clearTimeout(timer);
    }
  }, [isGameOver, onShowResult]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [buildLogs]);

  const handleBuild = () => {
    if (isGameOver || isBuilding) return;
    
    setIsBuilding(true);
    setBuildLogs(["------ 빌드 시작: 프로젝트: BattleProject, 구성: Debug Any CPU ------"]);
    
    const logs = [
      "1> 컴파일 중...",
      `1> ${roomData?.language || 'Python'} 환경 구동 중...`,
      "1> 코드 정적 분석 중: 에러 없음.",
      "1> 라이브러리 링크 중...",
      "1> 최적화 단계 수행 중...",
      "1> 배틀 서버로 빌드 아티팩트 전송 중...",
      "========== 빌드: 성공 1, 실패 0, 최신 0, 생략 0 =========="
    ];

    logs.forEach((log, index) => {
      setTimeout(() => {
        setBuildLogs(prev => [...prev, log]);
        if (index === logs.length - 1) setIsBuilding(false);
      }, (index + 1) * 400); 
    });
  };

  const confirmSubmit = () => {
    setShowSubmitModal(false);
    setIsGameOver(true);
  };

  const handleAttemptMove = (nextIndex) => {
    if (nextIndex === currentQIndex) return;
    setTargetQIndex(nextIndex);
    setShowMoveModal(true); 
  };

  const handleConfirmMove = (shouldSave) => {
    if (shouldSave) {
      saveCodeToStore(currentQIndex, tempCode); 
    }
    setCurrentQIndex(targetQIndex); 
    setTempCode(codes[targetQIndex] || getDefaultCode(targetQIndex));
    setShowMoveModal(false); 
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>

        {isGameOver && (
          <div style={styles.gameOverOverlay}>
            <div style={styles.gameOverText}>GAME OVER</div>
          </div>
        )}

        {showSubmitModal && (
          <div style={styles.modalOverlay}>
            <div style={styles.confirmModal}>
              <div style={styles.modalTitle}>최종 제출 확인</div>
              <div style={styles.modalDesc}>작성한 코드를 제출하고 배틀을 종료하시겠습니까?</div>
              <div style={styles.modalBtnRow}>
                <button style={styles.modalCancelBtn} onClick={() => setShowSubmitModal(false)}>취소</button>
                <button style={styles.modalConfirmBtn} onClick={confirmSubmit}>확인 및 제출</button>
              </div>
            </div>
          </div>
        )}

        {showMoveModal && (
          <div style={styles.modalOverlay}>
            <div style={styles.confirmModal}>
              <div style={styles.modalTitle}>임시 저장 확인</div>
              <div style={styles.modalDesc}>
                페이지를 이동하시겠습니까?<br/>
                현재까지 작성한 {currentQIndex}번 문제 코드를 저장할까요?
              </div>
              <div style={styles.modalBtnRow}>
                <button style={styles.modalCancelBtn} onClick={() => handleConfirmMove(false)}>아니오 (그냥 이동)</button>
                <button style={styles.modalConfirmBtn} onClick={() => handleConfirmMove(true)}>예 (저장 후 이동)</button>
              </div>
            </div>
          </div>
        )}

        <div style={styles.header}>
          <div style={styles.headerTitle}>🔥 알고리즘 진검승부</div>
          <div style={styles.timer}>남은 시간 <span style={{ color: isGameOver ? '#ff9f43' : '#ff4d4d', marginLeft: '10px' }}>{isGameOver ? '00:00' : '29:58'}</span></div>
        </div>

        <div style={styles.mainContent}>
          <div style={styles.questionPanel}>
            <div style={styles.panelTitle}>Q{currentQIndex}. 문제 설명</div>
            <div style={styles.questionText}>
              정수 <span style={styles.tag}>num1</span> 과 <span style={styles.tag}>num2</span> 가 매개변수로 주어질 때...<br/><br/>
              <strong>[제한 사항]</strong><br/>
              - 0 &lt; num1 ≤ 100<br/>
              - 0 &lt; num2 ≤ 100
            </div>
          </div>

          <div style={styles.editorPanel}>
            <div style={styles.panelTitle}>내 코드 작성 ({roomData?.language || 'Python'})</div>
            
            <div style={styles.monacoWrapper}>
              <Editor
                height="100%"
                language={(roomData?.language || 'python').toLowerCase()}
                theme="vs-dark"
                value={tempCode} 
                onChange={(value) => setTempCode(value)} 
                options={{
                  fontSize: 16,
                  minimap: { enabled: false },
                  automaticLayout: true,
                  readOnly: isGameOver,
                  padding: { top: 20 }
                }}
              />
            </div>
            
            <div style={styles.terminalPanel} ref={terminalRef}>
              {buildLogs.length === 0 ? (
                <div style={{ color: '#555' }}>빌드 결과가 여기에 표시됩니다.</div>
              ) : (
                buildLogs.map((log, i) => <div key={i} style={log.includes("성공") ? styles.successLog : styles.normalLog}>{log}</div>)
              )}
            </div>

            <div style={styles.editorFooter}>
              <button 
                style={{...styles.buildBtn, opacity: isGameOver || isBuilding ? 0.3 : 1}} 
                onClick={handleBuild}
                disabled={isGameOver || isBuilding}
              >
                {isBuilding ? '빌드 중...' : '▶ 빌드 (Run)'}
              </button>
            </div>
          </div>

          <div style={styles.sidePanel}>
            <div style={styles.panelTitle}>점수판</div>
            <div style={styles.scoreBoard}>
              <div style={styles.scoreRowActive}><span>👾 Hyunseo (나)</span><span style={{ color: '#20c997', fontWeight: 'bold' }}>100점</span></div>
              <div style={styles.scoreRow}><span>😎 도안팀장님</span><span>0점</span></div>
            </div>

            <div style={{ ...styles.panelTitle, borderTop: '1px solid #333' }}>실시간 진행도</div>
            <div style={styles.progressWrapper}>
              
              <div style={styles.progressRow}>
                <span style={styles.progressUser}>나</span>
                <div style={styles.boxRow}>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <div 
                      key={num} 
                      style={num < currentQIndex ? styles.boxDone : num === currentQIndex ? styles.boxSolving : styles.boxEmpty}
                    >
                      {num < currentQIndex ? '✔' : num}
                    </div>
                  ))}
                </div>
                <span style={styles.percentText}>{Math.round(((currentQIndex - 1) / totalQ) * 100)}%</span>
              </div>

              <div style={styles.progressRow}>
                <span style={styles.progressUser}>상대 (예시)</span>
                <div style={styles.boxRow}>
                  {[true, true, false, false, false].map((isDone, idx) => (
                    <div key={idx} style={isDone ? styles.boxDone : (idx === 2 ? styles.boxSolving : styles.boxEmpty)}>
                      {isDone ? '✔' : idx + 1}
                    </div>
                  ))}
                </div>
                <span style={{ ...styles.percentText, color: '#ff9f43' }}>40%</span>
              </div>

            </div>
          </div>
        </div>

        <div style={styles.footer}>
          <div style={styles.footerLeft}></div>
          <div style={styles.footerCenter}>
            <div style={styles.paginationBox}>
              <button style={styles.pageBtn} onClick={() => currentQIndex > 1 && handleAttemptMove(currentQIndex - 1)} disabled={isGameOver}>◀</button>
              <span style={styles.pageText}>{currentQIndex} / {totalQ}</span>
              <button style={styles.pageBtn} onClick={() => currentQIndex < totalQ && handleAttemptMove(currentQIndex + 1)} disabled={isGameOver}>▶</button>
            </div>
            <button style={{...styles.submitBtn, opacity: isGameOver ? 0.3 : 1}} onClick={() => !isGameOver && setShowSubmitModal(true)} disabled={isGameOver}>SUBMIT</button>
          </div>
          <div style={styles.footerRight}>
            <button style={styles.exitBtn} onClick={onExit}>나가기</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: { width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  container: { position: 'relative', width: '1280px', height: '800px', backgroundColor: '#121212', padding: '25px', boxSizing: 'border-box', color: '#fff', display: 'flex', flexDirection: 'column', gap: '20px', borderRadius: '12px', overflow: 'hidden' },
  editorPanel: { flex: 1.5, backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  monacoWrapper: { flex: 1.5, minHeight: 0 },
  terminalPanel: { flex: 0.8, backgroundColor: '#0a0a0a', borderTop: '1px solid #333', padding: '15px', fontFamily: 'Consolas, monospace', fontSize: '13px', overflowY: 'auto', color: '#ccc', lineHeight: '1.5' },
  normalLog: { marginBottom: '4px' },
  successLog: { color: '#20c997', fontWeight: 'bold', marginTop: '10px' },
  editorFooter: { padding: '10px 20px', backgroundColor: '#1a1a1a', borderTop: '1px solid #333', display: 'flex', justifyContent: 'flex-end' },
  buildBtn: { padding: '8px 24px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' },
  gameOverOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(6px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000, borderRadius: '12px' },
  gameOverText: { fontSize: '150px', fontWeight: '900', color: '#ff9f43', textShadow: '0 0 50px rgba(255, 159, 67, 0.8)', fontStyle: 'italic' },
  modalOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 11000 },
  confirmModal: { width: '450px', backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '10px', padding: '30px', textAlign: 'center' },
  modalTitle: { fontSize: '20px', fontWeight: 'bold', color: '#20c997', margin: '0 0 20px 0' },
  modalDesc: { fontSize: '15px', color: '#ccc', marginBottom: '30px', lineHeight: '1.6' },
  modalBtnRow: { display: 'flex', gap: '15px' },
  modalCancelBtn: { flex: 1, padding: '12px', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' },
  modalConfirmBtn: { flex: 1, padding: '12px', backgroundColor: '#20c997', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1a1a1a', padding: '15px 20px', borderRadius: '8px' },
  headerTitle: { fontSize: '18px', fontWeight: 'bold', color: '#20c997' },
  timer: { fontSize: '20px', fontWeight: 'bold' },
  mainContent: { display: 'flex', gap: '20px', flex: 1, minHeight: 0 },
  questionPanel: { flex: 1, backgroundColor: '#151515', border: '1px solid #333', borderRadius: '8px', display: 'flex', flexDirection: 'column' },
  sidePanel: { width: '300px', backgroundColor: '#151515', border: '1px solid #333', borderRadius: '8px', display: 'flex', flexDirection: 'column', overflowY: 'auto' },
  panelTitle: { padding: '15px 20px', backgroundColor: '#1a1a1a', borderBottom: '1px solid #333', fontSize: '15px', fontWeight: 'bold', textAlign: 'center' },
  questionText: { padding: '25px', fontSize: '15px', lineHeight: '1.6', color: '#ddd', overflowY: 'auto' },
  tag: { backgroundColor: '#333', padding: '3px 6px', borderRadius: '4px', fontSize: '13px', fontFamily: 'monospace' },
  scoreBoard: { padding: '15px', display: 'flex', flexDirection: 'column', gap: '10px' },
  scoreRowActive: { display: 'flex', justifyContent: 'space-between', padding: '15px', backgroundColor: 'rgba(32, 201, 151, 0.1)', border: '1px solid #20c997', borderRadius: '6px', fontSize: '14px' },
  scoreRow: { display: 'flex', justifyContent: 'space-between', padding: '15px', backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '6px', fontSize: '14px' },
  footer: { height: '80px', backgroundColor: '#1a1a1a', borderTop: '1px solid #333', display: 'flex', padding: '0 30px', alignItems: 'center' },
  footerLeft: { flex: 1 },
  footerCenter: { flex: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' },
  paginationBox: { display: 'flex', alignItems: 'center', gap: '15px', backgroundColor: '#111', padding: '5px 15px', borderRadius: '6px', border: '1px solid #333' },
  pageBtn: { backgroundColor: '#252525', border: '1px solid #444', color: '#fff', width: '35px', height: '35px', borderRadius: '4px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  pageText: { fontSize: '16px', fontWeight: 'bold', color: '#ccc', width: '50px', textAlign: 'center' },
  submitBtn: { padding: '12px 40px', backgroundColor: '#20c997', color: '#000', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' },
  footerRight: { flex: 1, display: 'flex', justifyContent: 'flex-end' },
  exitBtn: { padding: '10px 25px', backgroundColor: 'transparent', border: '1px solid #ff4d4d', color: '#ff4d4d', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  
  progressWrapper: { padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' },
  progressRow: { display: 'flex', flexDirection: 'column', gap: '8px', backgroundColor: '#1a1a1a', padding: '12px', borderRadius: '6px', border: '1px solid #222' },
  progressUser: { fontSize: '13px', fontWeight: 'bold', color: '#aaa', marginLeft: '2px' },
  boxRow: { display: 'flex', gap: '6px' },
  boxDone: { width: '32px', height: '32px', backgroundColor: '#20c997', color: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' },
  boxSolving: { width: '30px', height: '30px', backgroundColor: '#151515', border: '1.5px solid #ff9f43', color: '#ff9f43', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' },
  boxEmpty: { width: '30px', height: '30px', backgroundColor: '#252525', border: '1px solid #333', color: '#555', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '4px', fontSize: '12px' },
  percentText: { fontSize: '14px', fontWeight: 'bold', color: '#20c997', textAlign: 'right', marginTop: '2px', paddingRight: '2px' }
};