import React, { useState } from 'react';

export default function Battle({ roomData, onExit }) {
  const [code, setCode] = useState(`def solution(arr):\n    answer = []\n    # 여기에 코드를 작성하세요.\n    return answer`);
  
  const [currentQIndex, setCurrentQIndex] = useState(1);
  const totalQ = parseInt(roomData?.questionCount) || 5;

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.headerTitle}>🔥 알고리즘 진검승부</div>
          <div style={styles.timer}>남은 시간 <span style={{ color: '#ff4d4d', marginLeft: '10px' }}>29:58</span></div>
        </div>

        <div style={styles.mainContent}>
          
          <div style={styles.questionPanel}>
            <div style={styles.panelTitle}>Q{currentQIndex}. 두 수의 나눗셈 (Level 1)</div>
            <div style={styles.questionText}>
              정수 <span style={styles.tag}>num1</span> 과 <span style={styles.tag}>num2</span> 가 매개변수로 주어질 때, 
              <span style={styles.tag}>num1</span> 을 <span style={styles.tag}>num2</span> 로 나눈 값에 1,000을 곱한 후 정수 부분을 return 하도록 solution 함수를 완성해주세요.
              <br/><br/>
              <strong>[입출력 예]</strong><br/>
              - num1: 3, num2: 2 👉 result: 1500<br/>
              - num1: 7, num2: 3 👉 result: 2333
            </div>
          </div>

          <div style={styles.editorPanel}>
            <div style={styles.panelTitle}>내 코드 작성 ({roomData?.language || 'Python'})</div>
            
            <textarea 
              style={styles.textArea} 
              value={code} 
              onChange={(e) => setCode(e.target.value)}
              spellCheck="false"
            />
            
            <div style={styles.editorFooter}>
              <button style={styles.buildBtn} onClick={() => alert('코드를 컴파일/실행합니다.')}>
                ▶ 빌드 (Run)
              </button>
            </div>
          </div>

          <div style={styles.sidePanel}>
            <div style={styles.panelTitle}>점수판</div>
            <div style={styles.scoreBoard}>
              <div style={styles.scoreRowActive}>
                <span>👾 오현서 (Hyunseo)</span><span style={{ color: '#20c997', fontWeight: 'bold' }}>100점</span>
              </div>
              <div style={styles.scoreRow}>
                <span>😎 도안팀장님</span><span style={{ color: '#e6b800', fontWeight: 'bold' }}>0점</span>
              </div>
              <div style={styles.scoreRow}>
                <span>🤖 자바깎는노인</span><span style={{ color: '#aaa', fontWeight: 'bold' }}>0점</span>
              </div>
            </div>
          </div>

        </div>

        <div style={styles.footer}>
          <div style={styles.footerLeft}></div>
          
          <div style={styles.footerCenter}>
            <div style={styles.paginationBox}>
              <button 
                style={{...styles.pageBtn, opacity: currentQIndex === 1 ? 0.3 : 1}} 
                onClick={() => setCurrentQIndex(prev => Math.max(1, prev - 1))}
                disabled={currentQIndex === 1}
              >◀</button>
              
              <span style={styles.pageText}>{currentQIndex} / {totalQ}</span>
              
              <button 
                style={{...styles.pageBtn, opacity: currentQIndex === totalQ ? 0.3 : 1}} 
                onClick={() => setCurrentQIndex(prev => Math.min(totalQ, prev + 1))}
                disabled={currentQIndex === totalQ}
              >▶</button>
            </div>
            
            <button style={styles.submitBtn} onClick={() => alert(`${currentQIndex}번 문제를 제출합니다!`)}>
              SUBMIT
            </button>
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
  container: { width: '1280px', height: '800px', backgroundColor: '#0f0f0f', display: 'flex', flexDirection: 'column', color: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 0 40px rgba(0,0,0,0.7)' },
  
  header: { height: '60px', backgroundColor: '#1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 30px', borderBottom: '1px solid #333' },
  headerTitle: { fontSize: '18px', fontWeight: 'bold', color: '#20c997' },
  timer: { fontSize: '20px', fontWeight: 'bold' },
  
  mainContent: { flex: 1, display: 'flex', padding: '20px', gap: '20px', minHeight: 0 },
  
  questionPanel: { flex: 1, backgroundColor: '#151515', border: '1px solid #333', borderRadius: '8px', display: 'flex', flexDirection: 'column' },
  editorPanel: { flex: 1.5, backgroundColor: '#151515', border: '1px solid #333', borderRadius: '8px', display: 'flex', flexDirection: 'column' },
  sidePanel: { width: '300px', backgroundColor: '#151515', border: '1px solid #333', borderRadius: '8px', display: 'flex', flexDirection: 'column' },
  
  panelTitle: { padding: '15px 20px', backgroundColor: '#1a1a1a', borderBottom: '1px solid #333', fontSize: '15px', fontWeight: 'bold', textAlign: 'center', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' },
  
  questionText: { padding: '25px', fontSize: '15px', lineHeight: '1.6', color: '#ddd', overflowY: 'auto' },
  tag: { backgroundColor: '#333', padding: '3px 6px', borderRadius: '4px', fontSize: '13px', fontFamily: 'monospace' },
  
  textArea: { flex: 1, backgroundColor: '#111', color: '#20c997', border: 'none', padding: '20px', fontSize: '16px', fontFamily: 'monospace', outline: 'none', resize: 'none' },
  
  editorFooter: { padding: '12px 20px', backgroundColor: '#1a1a1a', borderTop: '1px solid #333', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px', display: 'flex', justifyContent: 'flex-end' },
  buildBtn: { padding: '8px 24px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', letterSpacing: '0.5px' },
  
  scoreBoard: { padding: '15px', display: 'flex', flexDirection: 'column', gap: '10px' },
  scoreRowActive: { display: 'flex', justifyContent: 'space-between', padding: '15px', backgroundColor: 'rgba(32, 201, 151, 0.1)', border: '1px solid #20c997', borderRadius: '6px', fontSize: '14px' },
  scoreRow: { display: 'flex', justifyContent: 'space-between', padding: '15px', backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '6px', fontSize: '14px' },

  footer: { height: '80px', backgroundColor: '#1a1a1a', borderTop: '1px solid #333', display: 'flex', padding: '0 30px', alignItems: 'center' },
  footerLeft: { flex: 1 },
  footerCenter: { flex: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' },
  
  paginationBox: { display: 'flex', alignItems: 'center', gap: '15px', backgroundColor: '#111', padding: '5px 15px', borderRadius: '6px', border: '1px solid #333' },
  pageBtn: { backgroundColor: '#252525', border: '1px solid #444', color: '#fff', width: '35px', height: '35px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  pageText: { fontSize: '16px', fontWeight: 'bold', color: '#ccc', width: '50px', textAlign: 'center' },
  
  submitBtn: { padding: '12px 40px', backgroundColor: '#20c997', color: '#000', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', letterSpacing: '1px' },
  
  footerRight: { flex: 1, display: 'flex', justifyContent: 'flex-end' },
  exitBtn: { padding: '10px 25px', backgroundColor: 'transparent', border: '1px solid #ff4d4d', color: '#ff4d4d', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }
};