import React from 'react';

export default function Result({ onReturnLobby }) {
  // 가상의 게임 결과 데이터
  const winTeam = [
    { id: 1, name: '현서 (나)', scoreChange: '+ 25', isMe: true },
    { id: 2, name: '자바깎는노인', scoreChange: '+ 20', isMe: false },
  ];
  const loseTeam = [
    { id: 3, name: '도안팀장님', scoreChange: '- 15', isMe: false },
    { id: 4, name: '뉴비123', scoreChange: '- 10', isMe: false },
  ];

  return (
    <div style={styles.container}>
      {/* 상단: 승패 결과 및 코드 보기 */}
      <div style={styles.topSection}>
        
        {/* WIN 패널 */}
        <div style={{ ...styles.resultBox, border: '1px solid #20c997' }}>
          <div style={styles.userList}>
            {winTeam.map(user => (
              <div key={user.id} style={{ ...styles.userRow, borderColor: user.isMe ? '#20c997' : '#333' }}>
                <div style={styles.icon}>👾</div>
                <div style={{ ...styles.name, color: user.isMe ? '#20c997' : '#fff', fontWeight: user.isMe ? 'bold' : 'normal' }}>{user.name}</div>
                <div style={styles.scoreChange}>기존 점수 <span style={{ color: '#20c997', fontWeight: 'bold' }}>{user.scoreChange}점</span></div>
              </div>
            ))}
          </div>
          <div style={styles.resultTextWin}>WIN <span style={{ fontSize: '24px' }}>+ 25점</span></div>
        </div>

        {/* LOST 패널 */}
        <div style={{ ...styles.resultBox, border: '1px solid #ff4d4d' }}>
          <div style={styles.userList}>
            {loseTeam.map(user => (
              <div key={user.id} style={styles.userRow}>
                <div style={styles.icon}>💀</div>
                <div style={styles.name}>{user.name}</div>
                <div style={styles.scoreChange}>기존 점수 <span style={{ color: '#ff4d4d', fontWeight: 'bold' }}>{user.scoreChange}점</span></div>
              </div>
            ))}
          </div>
          <div style={styles.resultTextLose}>LOST <span style={{ fontSize: '24px' }}>- 15점</span></div>
        </div>

        {/* 코드 보기 패널 */}
        <div style={styles.codeViewBox}>
          <div style={{ color: '#888', fontSize: '12px', textAlign: 'center', marginBottom: '10px' }}>참가자 코드 리뷰</div>
          {[...winTeam, ...loseTeam].map(user => (
            <div key={`code-${user.id}`} style={styles.codeBtnRow}>
              <div style={styles.iconSmall}>{user.id > 2 ? '💀' : '👾'}</div>
              <button style={styles.codeBtn}>코드 보기</button>
            </div>
          ))}
        </div>
      </div>

      {/* 하단: 채팅 및 액션 */}
      <div style={styles.bottomSection}>
        {/* 채팅 창 */}
        <div style={styles.chatArea}>
          <div style={styles.chatBox}>
            <span style={{ color: '#888' }}>결과창 채팅이 시작되었습니다.</span>
          </div>
          <div style={styles.chatInputRow}>
            <button style={styles.chatModeBtn}>채팅모드</button>
            <input type="text" placeholder="메시지를 입력하세요" style={styles.chatInput} />
          </div>
        </div>

        {/* 참가자 목록 및 컨트롤 버튼 */}
        <div style={styles.actionArea}>
          <div style={styles.participantBox}>
            <div style={{ color: '#aaa', fontSize: '12px', fontWeight: 'bold', borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '10px' }}>참가자 현황</div>
            {[...winTeam, ...loseTeam].map(u => (
              <div key={`p-${u.id}`} style={{ color: '#fff', fontSize: '13px', padding: '5px 0' }}>{u.name}</div>
            ))}
          </div>
          <div style={styles.buttonRow}>
            <button style={styles.actionBtn}>다시하기</button>
            <button style={styles.exitBtn} onClick={onReturnLobby}>나가기</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#0f0f0f', padding: '20px', gap: '20px', boxSizing: 'border-box', fontFamily: '"Inter", sans-serif' },
  
  topSection: { display: 'flex', gap: '20px', flex: 6, minHeight: 0 },
  resultBox: { flex: 2, borderRadius: '8px', display: 'flex', flexDirection: 'column', backgroundColor: '#151515', padding: '20px' },
  userList: { flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto' },
  userRow: { display: 'flex', alignItems: 'center', border: '1px solid #333', borderRadius: '6px', padding: '12px', backgroundColor: '#111' },
  icon: { width: '36px', height: '36px', backgroundColor: '#222', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '15px' },
  name: { flex: 1, color: '#fff', fontSize: '15px' },
  scoreChange: { color: '#aaa', fontSize: '13px' },
  resultTextWin: { textAlign: 'center', fontSize: '40px', fontWeight: 'bold', color: '#20c997', marginTop: '20px', textShadow: '0 0 20px rgba(32, 201, 151, 0.4)' },
  resultTextLose: { textAlign: 'center', fontSize: '40px', fontWeight: 'bold', color: '#ff4d4d', marginTop: '20px', textShadow: '0 0 20px rgba(255, 77, 77, 0.4)' },

  codeViewBox: { flex: 1, border: '1px solid #333', borderRadius: '8px', backgroundColor: '#151515', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto' },
  codeBtnRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  iconSmall: { width: '30px', height: '30px', backgroundColor: '#222', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  codeBtn: { flex: 1, padding: '10px', border: '1px solid #444', borderRadius: '4px', backgroundColor: '#111', color: '#ccc', cursor: 'pointer', transition: 'all 0.2s', ':hover': { backgroundColor: '#222' } },

  bottomSection: { display: 'flex', gap: '20px', flex: 4, minHeight: 0 },
  chatArea: { flex: 3, border: '1px solid #333', borderRadius: '8px', backgroundColor: '#151515', display: 'flex', flexDirection: 'column', padding: '15px', gap: '15px' },
  chatBox: { flex: 1, border: '1px solid #222', borderRadius: '6px', backgroundColor: '#111', padding: '15px', overflowY: 'auto', fontFamily: '"Fira Code", monospace', fontSize: '13px' },
  chatInputRow: { display: 'flex', gap: '10px' },
  chatModeBtn: { padding: '12px 20px', border: '1px solid #444', backgroundColor: '#222', color: '#aaa', borderRadius: '4px', fontWeight: 'bold' },
  chatInput: { flex: 1, padding: '12px', border: '1px solid #444', backgroundColor: '#111', color: '#fff', borderRadius: '4px', outline: 'none', fontFamily: '"Fira Code", monospace' },

  actionArea: { flex: 1, display: 'flex', flexDirection: 'column', gap: '15px' },
  participantBox: { flex: 1, border: '1px solid #333', borderRadius: '8px', backgroundColor: '#151515', padding: '15px', overflowY: 'auto' },
  buttonRow: { display: 'flex', gap: '10px' },
  actionBtn: { flex: 1, padding: '15px', border: 'none', borderRadius: '6px', backgroundColor: '#20c997', color: '#000', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' },
  exitBtn: { flex: 1, padding: '15px', border: '1px solid #ff4d4d', borderRadius: '6px', backgroundColor: '#441111', color: '#ff4d4d', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }
};