import React, { useState, useEffect } from 'react';

// 🌟 roomData 받기
export default function Battle({ onExit, roomData }) {
  
  // 🌟 "30분" 같은 글자에서 숫자만 뽑아 초(seconds)로 변환
  const parsedMinutes = roomData?.time ? parseInt(roomData.time.replace(/[^0-9]/g, "")) : 45;
  const initialTime = parsedMinutes * 60; 
  
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div style={styles.container}>
      
      <div style={styles.mainColumns}>

        <div style={styles.codeColumn}>
          <div style={styles.colHeader}>내 코드 작성 ({roomData?.language || 'Python'})</div>
          <textarea
            style={styles.myCodeEditor}
            defaultValue="def solution(arr):&#10;    answer = []&#10;    # 여기에 코드를 작성하세요.&#10;    return answer"
            spellCheck={false}
          />
        </div>

        <div style={styles.codeColumn}>
          <div style={styles.colHeader}>
            상대 코드 <span style={styles.blindBadge}>블라인드</span>
          </div>
          <div style={styles.opponentCodeEditor}>
            <div style={styles.blurredCode}>
              def solution(arr):<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;result = sorted(arr)<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;for i in range(len(result)):<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if result[i] &gt; 0:<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;answer.append(result[i])<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;return result
            </div>
          </div>
        </div>

        <div style={styles.infoColumn}>

          <div style={styles.timerBox}>
            <span style={{ color: '#aaa', fontSize: '14px' }}>남은 시간</span>
            <span style={styles.timerText}>{formatTime(timeLeft)}</span>
          </div>

          {/* 🌟 선택한 제목, 난이도, 언어 표시 */}
          <div style={styles.problemBox}>
            <div style={styles.boxTitle}>
              Q. {roomData?.title || '배열의 중앙값 구하기'} 
              <span style={{ color: '#20c997', fontSize: '12px', marginLeft: '10px' }}>
                ({roomData?.level || 'Level 1'})
              </span>
            </div>
            <div style={styles.problemDesc}>
              주어진 데이터를 처리하는 코드를 작성하세요.<br/><br/>
              설정된 언어: <strong style={{color: '#20c997'}}>{roomData?.language || 'Python'}</strong>
            </div>
          </div>

          <div style={styles.scoreBox}>
            <div style={styles.boxTitle}>점수판</div>
            <div style={styles.scoreList}>
              <div style={{...styles.scoreRow, borderColor: '#20c997'}}>
                <span>👾 <span style={{color: '#20c997'}}>현서 (나)</span></span>
                <span style={styles.scorePoint}>0점</span>
              </div>
              <div style={styles.scoreRow}>
                <span>😎 도안팀장님</span>
                <span style={styles.scorePoint}>0점</span>
              </div>
            </div>
          </div>

          <button style={styles.hintBtn}>💡 힌트 사용하기 (남은 횟수: 3)</button>
        </div>

      </div>

      <div style={styles.footer}>
        <div style={styles.progressBarWrapper}>
          <div style={styles.progressBarBg}><div style={styles.progressBarFill}></div></div>
          <div style={styles.progressLabels}><span>0</span><span>50</span><span>100</span></div>
        </div>
        <div style={styles.footerButtons}>
          <div style={styles.centerButtons}>
            <button style={styles.submitBtn}>코드 제출</button>
            <button style={styles.nextBtn}>다음 문제</button>
          </div>
          <button style={styles.exitBtn} onClick={onExit}>나가기</button>
        </div>
      </div>

    </div>
  );
}

const styles = { container: { backgroundColor: '#121212', height: '100vh', padding: '20px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: '"Inter", sans-serif', color: '#fff' }, mainColumns: { display: 'flex', gap: '20px', flex: 1, minHeight: 0 }, codeColumn: { flex: 1, backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }, colHeader: { textAlign: 'center', padding: '15px', borderBottom: '1px solid #333', fontWeight: 'bold', fontSize: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }, blindBadge: { backgroundColor: '#ff4d4d', color: '#fff', fontSize: '12px', padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold' }, myCodeEditor: { flex: 1, backgroundColor: '#151515', color: '#20c997', border: 'none', padding: '20px', fontFamily: '"D2Coding", "Fira Code", monospace', fontSize: '15px', outline: 'none', resize: 'none', lineHeight: '1.6' }, opponentCodeEditor: { flex: 1, backgroundColor: '#151515', padding: '20px', overflow: 'hidden' }, blurredCode: { color: '#888', fontFamily: '"D2Coding", "Fira Code", monospace', fontSize: '15px', lineHeight: '1.6', filter: 'blur(5px)', userSelect: 'none' }, infoColumn: { flex: 0.8, display: 'flex', flexDirection: 'column', gap: '15px' }, timerBox: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '15px 20px' }, timerText: { color: '#ff4d4d', fontSize: '24px', fontFamily: 'monospace', fontWeight: 'bold', letterSpacing: '2px' }, problemBox: { flex: 1.5, backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }, boxTitle: { textAlign: 'center', fontWeight: 'bold', marginBottom: '15px', fontSize: '16px', color: '#fff' }, problemDesc: { color: '#ccc', fontSize: '14px', lineHeight: '1.6', wordBreak: 'keep-all' }, scoreBox: { flex: 1, backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column' }, scoreList: { display: 'flex', flexDirection: 'column', gap: '10px' }, scoreRow: { display: 'flex', justifyContent: 'space-between', padding: '12px 15px', border: '1px solid #333', borderRadius: '6px', backgroundColor: '#111', fontSize: '14px' }, scorePoint: { color: '#e6b800', fontWeight: 'bold' }, hintBtn: { padding: '15px', backgroundColor: 'transparent', border: '1px solid #20c997', color: '#20c997', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s', marginTop: 'auto' }, footer: { backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }, progressBarWrapper: { padding: '0 10px' }, progressBarBg: { height: '10px', backgroundColor: '#333', borderRadius: '5px', position: 'relative' }, progressBarFill: { width: '40%', height: '100%', backgroundColor: '#ccc', borderRadius: '5px' }, progressLabels: { display: 'flex', justifyContent: 'space-between', marginTop: '10px', color: '#888', fontSize: '11px' }, footerButtons: { display: 'flex', justifyContent: 'center', position: 'relative' }, centerButtons: { display: 'flex', gap: '15px' }, submitBtn: { padding: '12px 35px', backgroundColor: '#20c997', color: '#000', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }, nextBtn: { padding: '12px 35px', backgroundColor: '#333', color: '#fff', border: '1px solid #444', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }, exitBtn: { position: 'absolute', right: 0, padding: '12px 25px', backgroundColor: 'transparent', color: '#ff4d4d', border: '1px solid #ff4d4d', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' } };