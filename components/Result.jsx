import React from 'react';

function Result({ onGoLobby }) {
  return (
    <div style={styles.container}>
      <div style={styles.headerBox}>
        <div>
          <span style={{ color: '#888', fontWeight: 'bold', fontSize: '12px' }}>MATCH RESULT</span>
          <h2 style={{ margin: '5px 0', color: 'white' }}>승부 분석 리포트</h2>
          <span style={{ color: '#888', fontSize: '14px' }}>언어: Python · 제한 시간: 45분</span>
        </div>
        <button style={styles.lobbyBtn} onClick={onGoLobby}>로비로 돌아가기</button>
      </div>

      <div style={styles.mainGrid}>
        {/* 왼쪽 상세 점수판 */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>상세 점수판</div>
          <div style={{ padding: '25px' }}>
            {/* 테스트 통과 */}
            <div style={styles.statRow}>
              <div style={styles.statLabel}>테스트 통과<br/><span style={{fontSize:'12px', color:'#666'}}>기준: 100점</span></div>
              <div style={{ flex: 1 }}>
                <div style={styles.barWrap}><div style={{...styles.barMe, width: '100%'}}></div><span style={styles.scoreText}>100점 (나)</span></div>
                <div style={styles.barWrap}><div style={{...styles.barOp, width: '95%'}}></div><span style={styles.scoreText}>95점 (상대)</span></div>
              </div>
            </div>
            {/* 실행 시간 */}
            <div style={styles.statRow}>
              <div style={styles.statLabel}>실행 시간<br/><span style={{fontSize:'12px', color:'#666'}}>기준: 120ms</span></div>
              <div style={{ flex: 1 }}>
                <div style={styles.barWrap}><div style={{...styles.barMe, width: '80%'}}></div><span style={styles.scoreText}>65ms (나)</span></div>
                <div style={styles.barWrap}><div style={{...styles.barOp, width: '75%'}}></div><span style={styles.scoreText}>70ms (상대)</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽 AI 챗봇 */}
        <div style={{...styles.card, display: 'flex', flexDirection: 'column'}}>
          <div style={{...styles.cardHeader, backgroundColor: '#20c997', color: '#121212'}}>AI 리뷰 & 질의응답</div>
          <div style={styles.chatArea}>
            <div style={styles.chatBubbleAi}>
              <strong>AI:</strong> 시간 복잡도는 O(n)으로 훌륭합니다! 딕셔너리를 사용해서 탐색 속도를 높인 점이 승인이네요.
            </div>
            <div style={styles.chatBubbleMe}>
              이 코드를 더 짧게 줄이려면 어떻게 해?
            </div>
          </div>
          <div style={styles.chatInputArea}>
            <input type="text" placeholder="AI에게 질문해보세요..." style={styles.input} />
            <button style={styles.sendBtn}>전송</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '40px', maxWidth: '1200px', margin: '0 auto', fontFamily: '"Inter", sans-serif' },
  headerBox: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1e1e1e', padding: '25px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #333' },
  lobbyBtn: { backgroundColor: 'transparent', color: 'white', border: '1px solid #666', padding: '10px 30px', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' },
  mainGrid: { display: 'flex', gap: '20px' },
  card: { flex: 1, backgroundColor: '#1e1e1e', borderRadius: '10px', overflow: 'hidden', border: '1px solid #333' },
  cardHeader: { backgroundColor: '#121212', color: '#fff', padding: '15px 20px', fontWeight: 'bold', borderBottom: '1px solid #333' },
  statRow: { display: 'flex', marginBottom: '30px' },
  statLabel: { width: '120px', color: 'white', fontWeight: 'bold', fontSize: '14px' },
  barWrap: { display: 'flex', alignItems: 'center', marginBottom: '10px', backgroundColor: '#121212', borderRadius: '5px', height: '16px' },
  barMe: { height: '100%', backgroundColor: '#007bff', borderRadius: '5px' },
  barOp: { height: '100%', backgroundColor: '#ff4d4d', borderRadius: '5px' },
  scoreText: { color: '#aaa', fontSize: '12px', marginLeft: '10px', width: '80px' },
  chatArea: { flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px', backgroundColor: '#1a1a1a', minHeight: '300px' },
  chatBubbleAi: { backgroundColor: '#2e2e2e', color: '#fff', padding: '12px 15px', borderRadius: '10px 10px 10px 0', alignSelf: 'flex-start', maxWidth: '80%', fontSize: '14px', lineHeight: '1.5' },
  chatBubbleMe: { backgroundColor: '#007bff', color: '#fff', padding: '12px 15px', borderRadius: '10px 10px 0 10px', alignSelf: 'flex-end', maxWidth: '80%', fontSize: '14px' },
  chatInputArea: { display: 'flex', padding: '15px', borderTop: '1px solid #333', backgroundColor: '#121212' },
  input: { flex: 1, backgroundColor: '#1e1e1e', border: '1px solid #444', color: 'white', padding: '10px 15px', borderRadius: '5px', outline: 'none' },
  sendBtn: { backgroundColor: '#20c997', color: '#121212', border: 'none', padding: '0 20px', marginLeft: '10px', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }
};

export default Result;