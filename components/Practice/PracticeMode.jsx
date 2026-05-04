import React from 'react';

export default function PracticeMode({ onExit }) {
  return (
    <div style={styles.container}>
      
      {/* 🌟 상단 헤더 영역 */}
      <div style={styles.header}>
        <div style={styles.headerTitle}>🎯 연습 모드 (혼자 풀기)</div>
        <button style={styles.exitBtn} onClick={onExit}>로비로 돌아가기</button>
      </div>

      {/* 🌟 메인 2분할 영역 */}
      <div style={styles.mainContent}>
        
        {/* [좌측] 문제 설명 영역 */}
        <div style={styles.problemSection}>
          <div style={styles.boxTitle}>Q. 두 수의 나눗셈 (Level 1)</div>
          <div style={styles.problemDesc}>
            정수 <code>num1</code>과 <code>num2</code>가 매개변수로 주어질 때, <code>num1</code>을 <code>num2</code>로 나눈 값에 1,000을 곱한 후 정수 부분을 return 하도록 solution 함수를 완성해주세요.<br/><br/>
            <span style={{ color: '#888', fontWeight: 'bold' }}>[입출력 예]</span><br/>
            - num1: 3, num2: 2  👉  result: 1500<br/>
            - num1: 7, num2: 3  👉  result: 2333<br/><br/>
            <span style={{ color: '#888', fontWeight: 'bold' }}>[제한사항]</span><br/>
            - 0 &lt; num1 &lt;= 100<br/>
            - 0 &lt; num2 &lt;= 100
          </div>
        </div>

        {/* [우측] 코드 작성 및 제출 영역 */}
        <div style={styles.editorSection}>
          <div style={styles.boxTitle}>코드 작성 (Python)</div>
          
          <textarea
            style={styles.codeEditor}
            defaultValue="def solution(num1, num2):&#10;    answer = 0&#10;    # 여기에 로직을 작성하세요.&#10;    return answer"
            spellCheck={false}
          />

          {/* 우측 하단 컨트롤 버튼 */}
          <div style={styles.actionRow}>
            <button style={styles.submitBtn}>🚀 코드 제출</button>
            <button style={styles.nextBtn}>다음 문제 ▶</button>
          </div>
        </div>

      </div>
    </div>
  );
}

// === 스타일 시트 ===
const styles = {
  container: { backgroundColor: '#121212', height: '100vh', padding: '20px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: '"Inter", sans-serif', color: '#fff' },
  
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '15px 25px' },
  headerTitle: { fontSize: '18px', fontWeight: 'bold', color: '#20c997' },
  exitBtn: { padding: '8px 20px', backgroundColor: 'transparent', border: '1px solid #ff4d4d', color: '#ff4d4d', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },

  mainContent: { display: 'flex', gap: '20px', flex: 1, minHeight: 0 }, // 좌우 분할

  // 좌측 (문제)
  problemSection: { flex: 4, backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '25px', display: 'flex', flexDirection: 'column', overflowY: 'auto' },
  boxTitle: { fontSize: '16px', fontWeight: 'bold', marginBottom: '20px', color: '#fff', borderBottom: '1px solid #333', paddingBottom: '10px' },
  problemDesc: { color: '#ccc', fontSize: '15px', lineHeight: '1.8', wordBreak: 'keep-all' },

  // 우측 (코드)
  editorSection: { flex: 6, backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '25px', display: 'flex', flexDirection: 'column' },
  codeEditor: { flex: 1, backgroundColor: '#151515', color: '#20c997', border: '1px solid #333', borderRadius: '6px', padding: '20px', fontFamily: '"D2Coding", "Fira Code", monospace', fontSize: '16px', outline: 'none', resize: 'none', lineHeight: '1.6', marginBottom: '20px' },
  
  actionRow: { display: 'flex', justifyContent: 'flex-end', gap: '15px' },
  submitBtn: { padding: '15px 35px', backgroundColor: '#20c997', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' },
  nextBtn: { padding: '15px 35px', backgroundColor: '#333', color: '#fff', border: '1px solid #444', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }
};