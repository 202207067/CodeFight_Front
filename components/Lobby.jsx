import React, { useState } from 'react';

function Lobby({ onStartBattle }) {
  const [isReady, setIsReady] = useState(false);

  return (
    <div style={styles.container}>
      {/* 상단 헤더 */}
      <div style={styles.headerBox}>
        <div>
          <span style={{ color: '#007bff', fontWeight: 'bold', fontSize: '12px', letterSpacing: '1px' }}>MATCHING COMPLETE</span>
          <h2 style={{ margin: '5px 0', color: 'white' }}>배틀 로비</h2>
          <span style={{ color: '#888', fontSize: '14px' }}>대결 설정을 확인하고 준비 상태를 맞춰주세요.</span>
        </div>
        <div>
          <button style={styles.copyBtn}>방 코드 복사</button>
          <button 
            style={isReady ? styles.startBtnActive : styles.startBtnDisabled}
            disabled={!isReady}
            onClick={onStartBattle}
          >
            대결 시작
          </button>
        </div>
      </div>

      {/* 방 설정 카드 */}
      <div style={styles.card}>
        <div style={styles.cardHeaderBlue}>방 설정</div>
        <div style={styles.settingsRow}>
          <div style={styles.settingItem}>
            <label style={styles.label}>난이도</label>
            <select style={styles.select} defaultValue="초급">
              <option>초급</option><option>중급</option><option>고급</option>
            </select>
          </div>
          <div style={styles.settingItem}>
            <label style={styles.label}>제한 시간</label>
            <select style={styles.select} defaultValue="45분">
              <option>30분</option><option>45분</option><option>60분</option>
            </select>
          </div>
          <div style={styles.settingItem}>
            <label style={styles.label}>언어</label>
            <select style={styles.select} defaultValue="Python">
              <option>Java</option><option>Python</option><option>C++</option>
            </select>
          </div>
        </div>
      </div>

      {/* 플레이어 카드 영역 */}
      <div style={styles.playerArea}>
        {/* 내 카드 */}
        <div style={{ ...styles.playerCard, borderColor: isReady ? '#20c997' : '#333' }}>
          <div style={styles.playerInfo}>
            <div style={{ ...styles.avatar, backgroundColor: '#007bff' }}>ME</div>
            <div>
              <h3 style={{ margin: 0, color: 'white' }}>현서 (Hyunseo)</h3>
              <span style={{ color: '#888', fontSize: '13px' }}>주 언어: Python</span>
            </div>
          </div>
          <div style={styles.badgeRow}>
            <span style={styles.statBadge}>승률 68%</span>
            <span style={styles.statBadgeLine}>랭크 Silver II</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '30px' }}>
            <span style={{ color: isReady ? '#20c997' : '#666', fontWeight: 'bold' }}>{isReady ? 'READY' : 'NOT READY'}</span>
            <button 
              style={isReady ? styles.readyBtnCancel : styles.readyBtn}
              onClick={() => setIsReady(!isReady)}
            >
              {isReady ? '준비 취소' : '준비하기'}
            </button>
          </div>
        </div>

        {/* 상대방 카드 */}
        <div style={styles.playerCard}>
          <div style={styles.playerInfo}>
            <div style={{ ...styles.avatar, backgroundColor: '#ff4d4d' }}>OP</div>
            <div>
              <h3 style={{ margin: 0, color: 'white' }}>영환 (Yeong-hwan)</h3>
              <span style={{ color: '#888', fontSize: '13px' }}>주 언어: Java</span>
            </div>
          </div>
          <div style={styles.badgeRow}>
            <span style={{...styles.statBadge, backgroundColor: '#ff4d4d'}}>승률 71%</span>
            <span style={styles.statBadgeLine}>랭크 Gold IV</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '30px' }}>
            <span style={{ color: '#20c997', fontWeight: 'bold' }}>READY</span>
            <span style={{ color: '#888', fontSize: '14px' }}>준비 완료</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '40px', maxWidth: '1000px', margin: '0 auto', fontFamily: '"Inter", sans-serif' },
  headerBox: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1e1e1e', padding: '25px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #333' },
  copyBtn: { backgroundColor: 'transparent', color: '#007bff', border: '1px solid #007bff', padding: '10px 20px', borderRadius: '5px', marginRight: '15px', cursor: 'pointer', fontWeight: 'bold' },
  startBtnActive: { backgroundColor: '#20c997', color: 'white', border: 'none', padding: '10px 30px', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' },
  startBtnDisabled: { backgroundColor: '#333', color: '#666', border: 'none', padding: '10px 30px', borderRadius: '5px', fontWeight: 'bold', cursor: 'not-allowed', fontSize: '16px' },
  card: { backgroundColor: '#1e1e1e', borderRadius: '10px', overflow: 'hidden', border: '1px solid #333', marginBottom: '25px' },
  cardHeaderBlue: { backgroundColor: '#121212', color: '#fff', padding: '15px 20px', fontWeight: 'bold', borderBottom: '1px solid #333' },
  settingsRow: { display: 'flex', padding: '20px', gap: '20px' },
  settingItem: { flex: 1, display: 'flex', flexDirection: 'column' },
  label: { color: '#888', fontSize: '13px', marginBottom: '8px', fontWeight: 'bold' },
  select: { backgroundColor: '#121212', color: 'white', border: '1px solid #444', padding: '10px', borderRadius: '5px', outline: 'none' },
  playerArea: { display: 'flex', gap: '20px' },
  playerCard: { flex: 1, backgroundColor: '#1e1e1e', border: '1px solid #333', borderRadius: '10px', padding: '25px', transition: 'border-color 0.3s' },
  playerInfo: { display: 'flex', alignItems: 'center', marginBottom: '20px' },
  avatar: { width: '50px', height: '50px', borderRadius: '50%', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', marginRight: '15px', fontSize: '18px' },
  badgeRow: { display: 'flex', gap: '10px' },
  statBadge: { backgroundColor: '#007bff', color: 'white', padding: '5px 10px', borderRadius: '5px', fontSize: '12px', fontWeight: 'bold' },
  statBadgeLine: { backgroundColor: 'transparent', color: '#aaa', border: '1px solid #444', padding: '5px 10px', borderRadius: '5px', fontSize: '12px' },
  readyBtn: { backgroundColor: 'transparent', color: '#20c997', border: '2px solid #20c997', padding: '8px 25px', borderRadius: '25px', fontWeight: 'bold', cursor: 'pointer' },
  readyBtnCancel: { backgroundColor: '#333', color: '#aaa', border: 'none', padding: '10px 25px', borderRadius: '25px', fontWeight: 'bold', cursor: 'pointer' }
};

export default Lobby;