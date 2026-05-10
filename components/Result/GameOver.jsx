import React, { useState, useRef, useEffect } from 'react';

export default function GameOver({ onPlayAgain, onExit }) {
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { type: 'system', text: '결과창 채팅이 시작되었습니다.' }
  ]);
  const chatLogRef = useRef(null);

  useEffect(() => {
    if (chatLogRef.current) chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
  }, [chatMessages]);

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    setChatMessages([...chatMessages, { type: 'me', sender: '현서', text: chatInput }]);
    setChatInput('');
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        
        {/* 🌟 상단 구역 (승리 / 패배 / 코드 리뷰) */}
        <div style={styles.topSection}>
          
          {/* WIN 패널 */}
          <div style={styles.winPanel}>
            {/* '나'의 행 (초록색 테두리) */}
            <div style={{ ...styles.userRow, border: '1px solid #20c997' }}>
              <div style={styles.userInfo}>
                <span style={styles.avatarPurple}>👾</span>
                <span style={{ color: '#20c997', fontWeight: 'bold' }}>현서 (나)</span>
              </div>
              <div style={styles.scoreInfo}>
                <span style={{ color: '#aaa' }}>기존 점수</span>
                <span style={{ color: '#20c997', fontWeight: 'bold', marginLeft: '8px' }}>+ 25점</span>
              </div>
            </div>
            {/* 팀원 행 */}
            <div style={styles.userRow}>
              <div style={styles.userInfo}>
                <span style={styles.avatarPurple}>👾</span>
                <span style={{ color: '#fff' }}>자바깎는노인</span>
              </div>
              <div style={styles.scoreInfo}>
                <span style={{ color: '#aaa' }}>기존 점수</span>
                <span style={{ color: '#20c997', fontWeight: 'bold', marginLeft: '8px' }}>+ 20점</span>
              </div>
            </div>
            {/* 하단 큰 텍스트 */}
            <div style={{ ...styles.bigResultText, color: '#20c997' }}>WIN <span style={{ fontSize: '24px' }}>+ 25점</span></div>
          </div>

          {/* LOST 패널 */}
          <div style={styles.lostPanel}>
            <div style={styles.userRow}>
              <div style={styles.userInfo}>
                <span style={styles.avatarSkull}>💀</span>
                <span style={{ color: '#fff' }}>도안팀장님</span>
              </div>
              <div style={styles.scoreInfo}>
                <span style={{ color: '#aaa' }}>기존 점수</span>
                <span style={{ color: '#ff4d4d', fontWeight: 'bold', marginLeft: '8px' }}>- 15점</span>
              </div>
            </div>
            <div style={styles.userRow}>
              <div style={styles.userInfo}>
                <span style={styles.avatarSkull}>💀</span>
                <span style={{ color: '#fff' }}>뉴비123</span>
              </div>
              <div style={styles.scoreInfo}>
                <span style={{ color: '#aaa' }}>기존 점수</span>
                <span style={{ color: '#ff4d4d', fontWeight: 'bold', marginLeft: '8px' }}>- 10점</span>
              </div>
            </div>
            {/* 하단 큰 텍스트 */}
            <div style={{ ...styles.bigResultText, color: '#ff4d4d' }}>LOST <span style={{ fontSize: '24px' }}>- 15점</span></div>
          </div>

          {/* 코드 리뷰 패널 */}
          <div style={styles.sidePanel}>
            <div style={styles.panelHeader}>참가자 코드 리뷰</div>
            <div style={styles.codeReviewList}>
              <div style={styles.codeBtnRow}><span style={styles.avatarPurpleSm}>👾</span><button style={styles.codeBtn}>코드 보기</button></div>
              <div style={styles.codeBtnRow}><span style={styles.avatarPurpleSm}>👾</span><button style={styles.codeBtn}>코드 보기</button></div>
              <div style={styles.codeBtnRow}><span style={styles.avatarSkullSm}>💀</span><button style={styles.codeBtn}>코드 보기</button></div>
              <div style={styles.codeBtnRow}><span style={styles.avatarSkullSm}>💀</span><button style={styles.codeBtn}>코드 보기</button></div>
            </div>
          </div>

        </div>

        {/* 🌟 하단 구역 (채팅 / 참가자 현황 & 액션 버튼) */}
        <div style={styles.bottomSection}>
          
          {/* 채팅 패널 */}
          <div style={styles.chatPanel}>
            <div style={styles.chatLog} ref={chatLogRef}>
              {chatMessages.map((msg, idx) => (
                <div key={idx} style={{ textAlign: 'center', marginBottom: '10px', color: msg.type === 'system' ? '#888' : '#fff' }}>
                  {msg.type === 'system' ? msg.text : <div style={{ textAlign: 'left' }}><span style={{ color: '#007bff' }}>[{msg.sender}]</span> {msg.text}</div>}
                </div>
              ))}
            </div>
            <div style={styles.chatInputRow}>
              <button style={styles.chatModeBtn}>채팅모드</button>
              <input 
                type="text" 
                placeholder="메시지를 입력하세요" 
                style={styles.chatInput} 
                value={chatInput} 
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
            </div>
          </div>

          {/* 참가자 현황 & 액션 패널 */}
          <div style={styles.actionPanel}>
            <div style={styles.panelHeader}>참가자 현황</div>
            <div style={styles.participantList}>
              <div style={{ color: '#20c997', fontWeight: 'bold' }}>현서 (나)</div>
              <div>자바깎는노인</div>
              <div>도안팀장님</div>
              <div>뉴비123</div>
            </div>
            <div style={styles.actionBtns}>
              <button style={styles.playAgainBtn} onClick={onPlayAgain}>다시하기</button>
              <button style={styles.exitBtn} onClick={onExit}>나가기</button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

// === 🌟 시안과 100% 동일하게 맞춘 CSS 스타일 ===
const styles = {
  pageWrapper: { width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  container: { width: '1280px', height: '800px', backgroundColor: '#121212', padding: '20px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: '"Inter", sans-serif', color: '#fff' },
  
  topSection: { display: 'flex', flex: 1.5, gap: '20px', minHeight: 0 },
  bottomSection: { display: 'flex', flex: 1, gap: '20px', minHeight: 0 },

  // 승리/패배 패널 공통
  winPanel: { flex: 1, border: '2px solid #20c997', borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', position: 'relative', backgroundColor: '#151515' },
  lostPanel: { flex: 1, border: '2px solid #ff4d4d', borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', position: 'relative', backgroundColor: '#151515' },
  
  userRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#111', border: '1px solid #333', borderRadius: '6px', padding: '15px 20px', marginBottom: '15px' },
  userInfo: { display: 'flex', alignItems: 'center', gap: '15px', fontSize: '15px' },
  scoreInfo: { display: 'flex', alignItems: 'center', fontSize: '14px' },
  avatarPurple: { fontSize: '20px' },
  avatarSkull: { fontSize: '20px', filter: 'grayscale(100%)' }, // 해골 이모지 느낌
  
  bigResultText: { position: 'absolute', bottom: '30px', left: 0, right: 0, textAlign: 'center', fontSize: '48px', fontWeight: '900', letterSpacing: '2px' },

  // 우측 상단 리뷰 패널
  sidePanel: { width: '280px', backgroundColor: '#151515', border: '1px solid #333', borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column' },
  panelHeader: { textAlign: 'center', color: '#aaa', fontSize: '13px', marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid #333' },
  codeReviewList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  codeBtnRow: { display: 'flex', alignItems: 'center', gap: '15px' },
  avatarPurpleSm: { fontSize: '16px' },
  avatarSkullSm: { fontSize: '16px', filter: 'grayscale(100%)' },
  codeBtn: { flex: 1, padding: '12px', backgroundColor: '#111', color: '#ccc', border: '1px solid #333', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' },

  // 좌측 하단 채팅 패널
  chatPanel: { flex: 1, backgroundColor: '#151515', border: '1px solid #333', borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column' },
  chatLog: { flex: 1, overflowY: 'auto', marginBottom: '15px', fontSize: '14px' },
  chatInputRow: { display: 'flex', height: '45px', gap: '10px' },
  chatModeBtn: { width: '100px', backgroundColor: '#222', color: '#ccc', border: '1px solid #444', borderRadius: '4px', fontSize: '13px' },
  chatInput: { flex: 1, backgroundColor: '#111', color: '#fff', border: '1px solid #444', borderRadius: '4px', padding: '0 15px', outline: 'none' },

  // 우측 하단 참가자 현황 & 액션 패널
  actionPanel: { width: '280px', backgroundColor: '#151515', border: '1px solid #333', borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column' },
  participantList: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', fontSize: '14px', color: '#ccc', marginTop: '10px' },
  actionBtns: { display: 'flex', gap: '10px', marginTop: 'auto' },
  playAgainBtn: { flex: 1, padding: '15px', backgroundColor: '#20c997', color: '#000', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' },
  exitBtn: { flex: 1, padding: '15px', backgroundColor: '#222', color: '#ff4d4d', border: '1px solid #ff4d4d', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }
};