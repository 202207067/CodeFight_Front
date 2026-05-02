import React from 'react';

export default function MyCodeSection() {
  return (
    <div style={styles.codePanel}>
      <div style={styles.panelTitle}>내 코드 작성</div>
      {/* 실제 개발 시 여기 textarea 대신 Monaco Editor 같은 라이브러리가 들어갑니다 */}
      <textarea 
        style={styles.editorArea} 
        defaultValue="def solution(arr):&#10;    answer = []&#10;    # 여기에 코드를 작성하세요.&#10;    return answer"
        spellCheck="false"
      />
    </div>
  );
}

const styles = {
  codePanel: { flex: 2, border: '1px solid #333', borderRadius: '8px', display: 'flex', flexDirection: 'column', backgroundColor: '#151515', overflow: 'hidden' },
  panelTitle: { textAlign: 'center', padding: '15px', borderBottom: '1px solid #333', color: '#fff', fontWeight: 'bold', backgroundColor: '#111' },
  editorArea: { flex: 1, padding: '20px', backgroundColor: '#1a1a1a', color: '#20c997', border: 'none', resize: 'none', outline: 'none', fontFamily: '"Fira Code", monospace', fontSize: '15px', lineHeight: '1.5' },
};