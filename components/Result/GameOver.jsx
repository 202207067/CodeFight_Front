import React from 'react';

export default function GameOver({ gameResults, onGoToLobby }) {
  // 데이터가 들어오는지 브라우저 콘솔에서 확인하세요 (F12 -> Console)
  console.log("GameOver 컴포넌트로 전달된 gameResults:", gameResults);

  // 데이터가 없거나 배열이 아닐 경우 빈 배열로 처리
  const results = Array.isArray(gameResults) ? gameResults : [];

  // 점수 높은 순으로 정렬
  const sortedResults = [...results].sort((a, b) => b.score - a.score);

  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
        <h2 style={styles.title}>최종 경기 결과</h2>
        
        <div style={styles.rankingList}>
          {sortedResults.length > 0 ? (
            sortedResults.map((player, index) => (
              <div key={index} style={styles.rankRow}>
                <div style={styles.rankBadge}>{index + 1}등</div>
                <div style={styles.playerName}>{player.name || '알 수 없음'}</div>
                <div style={styles.playerScore}>{player.score || 0}점</div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
              결과 데이터를 불러오는 중입니다...
            </div>
          )}
        </div>

        <button style={styles.lobbyBtn} onClick={onGoToLobby}>
          로비로 돌아가기
        </button>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999
  },
  container: {
    width: '400px', backgroundColor: '#1a1a1a', borderRadius: '12px',
    padding: '30px', border: '1px solid #333', color: '#fff'
  },
  title: { textAlign: 'center', color: '#20c997', marginBottom: '25px' },
  rankingList: { display: 'flex', flexDirection: 'column', gap: '10px' },
  rankRow: {
    display: 'flex', alignItems: 'center', padding: '15px',
    backgroundColor: '#222', borderRadius: '6px', border: '1px solid #444'
  },
  rankBadge: { width: '60px', fontWeight: 'bold', color: '#20c997' },
  playerName: { flex: 1, fontSize: '16px' },
  playerScore: { fontWeight: 'bold', fontSize: '16px' },
  lobbyBtn: {
    width: '100%', padding: '12px', marginTop: '25px',
    backgroundColor: '#20c997', border: 'none', borderRadius: '4px',
    cursor: 'pointer', fontWeight: 'bold', color: '#000'
  }
};