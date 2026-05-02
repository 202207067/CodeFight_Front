import React from 'react';

export default function OpponentSection() {
  return (
    <div style={styles.codePanel}>
      <div style={styles.panelTitle}>상대 코드 <span style={styles.badge}>블라인드</span></div>
      {/* CSS filter 속성으로 블러 효과 적용 */}
      <div style={styles.blurWrapper}>
        <textarea 
          style={styles.editorAreaBlurred} 
          disabled
          value="def solution(arr):&#10;    result = sorted(arr)&#10;    for i in range(len(result)):&#10;        pass&#10;    return result"
        />
      </div>
    </div>
  );
}

const styles = {
  codePanel: { flex: 2, border: '1px solid #333', borderRadius: '8px', display: 'flex', flexDirection: 'column', backgroundColor: '#151515', overflow: 'hidden' },
  panelTitle: { textAlign: 'center', padding: '15px', borderBottom: '1px solid #333', color: '#fff', fontWeight: 'bold', backgroundColor: '#111', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' },
  badge: { fontSize: '11px', backgroundColor: '#ff4d4d', color: '#fff', padding: '2px 6px', borderRadius: '4px' },
  blurWrapper: { flex: 1, position: 'relative', overflow: 'hidden', backgroundColor: '#1a1a1a' },
  editorAreaBlurred: { width: '100%', height: '100%', padding: '20px', backgroundColor: 'transparent', color: '#888', border: 'none', resize: 'none', outline: 'none', fontFamily: '"Fira Code", monospace', fontSize: '15px', lineHeight: '1.5', filter: 'blur(6px)', userSelect: 'none' },
};