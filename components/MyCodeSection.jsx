import React, { useState } from 'react';
import Editor from '@monaco-editor/react';

// App.jsx에서 onCodeSubmit을 잘 받아오도록 입구에 적혀있습니다.
function MyCodeSection({ code, onCodeChange, onCodeSubmit }) {
  // 터미널 상태 관리 (Run 버튼용)
  const [terminalLogs, setTerminalLogs] = useState([
    { type: 'info', text: '# Python 3.10 환경 준비 완료...' },
    { type: 'cmd', text: '$ 대기 중...' }
  ]);
  const [status, setStatus] = useState('Ready');
  const [statusColor, setStatusColor] = useState('#20c997');

  // Run 버튼을 누를 때 실행되는 가짜 빌드 함수
  const handleBuild = () => {
    setStatus('Running...');
    setStatusColor('#f59f00'); // 주황색
    setTerminalLogs(prev => [
      ...prev,
      { type: 'cmd', text: '\n$ 가상 서버로 코드 전송 중...' }
    ]);

    setTimeout(() => {
      setStatus('Success');
      setStatusColor('#20c997'); // 초록색
      setTerminalLogs(prev => [
        ...prev,
        { type: 'output', text: '> 결과값: [0, 1]' },
        { type: 'output', text: '> 테스트 케이스 1/1 통과 완료! (15ms)' }
      ]);
    }, 2000);
  };

  return (
    <section style={styles.container}>
      <div style={styles.cardHeader}>
        <span style={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '12px' }}>Workspace</span>
        <span style={styles.badge}>Me (Hyeonseo)</span>
      </div>

      <div style={styles.editorWrapper}>
        <Editor
          height="100%"
          defaultLanguage="python"
          theme="vs-dark"
          value={code}
          onChange={onCodeChange}
          options={{ fontSize: 16, minimap: { enabled: false }, fontFamily: '"Fira Code", monospace' }}
        />
      </div>

      <div style={styles.terminalContainer}>
        <div style={styles.terminalHeader}>Execution Output</div>
        <div style={styles.terminalBody}>
          {terminalLogs.map((log, index) => (
            <div key={index} style={{
              color: log.type === 'info' ? '#888' : log.type === 'cmd' ? '#20c997' : '#f8f9fa',
              marginBottom: '2px'
            }}>
              {log.text}
            </div>
          ))}
        </div>
        <div style={styles.terminalFooter}>
          <span style={{ color: '#aaa', fontSize: '11px' }}>Words: {code.length} | Lines: {code.split('\n').length}</span>
          <span style={{ color: statusColor, fontWeight: 'bold' }}>Status: {status}</span>
        </div>
      </div>

      <div style={styles.buttonRow}>
        {/* Run 버튼은 가짜 빌드(handleBuild)를 실행합니다 */}
        <button style={styles.buildBtn} onClick={handleBuild}>Run (빌드 테스트)</button>
        
        {/* SUBMIT 버튼은 팝업을 띄우지 않고, 곧바로 App.jsx의 화면 이동 명령(onCodeSubmit)을 실행합니다 */}
        <button style={styles.submitBtn} onClick={onCodeSubmit}>SUBMIT</button>
      </div>
    </section>
  );
}

const styles = {
  container: { flex: 1, backgroundColor: '#1e1e1e', borderRadius: '8px', border: '1px solid #333', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', fontFamily: '"Inter", sans-serif' },
  cardHeader: { backgroundColor: '#121212', color: 'white', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333' },
  badge: { backgroundColor: '#0d6efd', color: 'white', padding: '3px 12px', borderRadius: '15px', fontSize: '11px', fontWeight: 'bold' },
  editorWrapper: { height: '350px', borderBottom: '1px solid #333' },
  terminalContainer: { backgroundColor: '#121212', margin: '15px', borderRadius: '5px', padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', fontFamily: '"Fira Code", monospace', fontSize: '13px', lineHeight: '1.5', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)', overflowY: 'auto' },
  terminalHeader: { fontSize: '11px', color: '#555', borderBottom: '1px solid #2e2e2e', paddingBottom: '8px', marginBottom: '8px', textTransform: 'uppercase' },
  terminalBody: { flex: 1, color: '#f8f9fa', overflowY: 'auto' },
  terminalFooter: { textAlign: 'right', marginTop: '10px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #2e2e2e', paddingTop: '8px' },
  buttonRow: { padding: '0 15px 15px 15px', display: 'flex', justifyContent: 'flex-end', gap: '10px' },
  buildBtn: { padding: '8px 20px', backgroundColor: 'white', color: '#1e1e1e', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' },
  submitBtn: { padding: '8px 30px', backgroundColor: '#20c997', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', textTransform: 'uppercase' }
};

export default MyCodeSection;