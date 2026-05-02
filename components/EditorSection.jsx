// src/components/EditorSection.jsx
import React from 'react';
import Editor from '@monaco-editor/react';

function EditorSection({ code, onCodeChange }) {
  return (
    <section style={{ flex: 5, display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 7 }}>
        <Editor
          height="100%"
          defaultLanguage="java"
          theme="vs-dark"
          value={code}
          onChange={onCodeChange}
          options={{ fontSize: 15, minimap: { enabled: false } }}
        />
      </div>
      <div style={styles.terminal}>
        <div style={{ color: '#888', fontSize: '12px', marginBottom: '10px' }}>TERMINAL</div>
        <div style={{ color: '#aaa', fontFamily: 'monospace', fontSize: '14px' }}>
          $ java Main.java <br />
          {'>'} 채점 서버(리눅스) 연결 대기 중...
        </div>
      </div>
    </section>
  );
}

const styles = {
  terminal: { flex: 3, backgroundColor: '#121212', borderTop: '2px solid #333', padding: '15px' }
};

export default EditorSection;