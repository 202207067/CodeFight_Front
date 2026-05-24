import React from 'react';

// 컴포넌트 이름을 파일명에 맞게 ResultPage로 변경
export default function ResultPage({ gameResults, onGoToLobby }) {
  // 만약 데이터가 넘어오지 않았을 경우를 대비한 더미 데이터
  const results = gameResults || [
    { name: '현서 (나)', tierIcon: '💎', score: 95 },
    { name: '자바깎는노인', tierIcon: '🥉', score: 80 },
    { name: '도안팀장님', tierIcon: '✨', score: 65 },
    { name: '뉴비123', tierIcon: '👾', score: 40 }
  ];

  // 1. 점수 기준 내림차순(높은 순) 정렬
  const sortedResults = [...results].sort((a, b) => b.score - a.score);

  // 2. 등수별 보상 포인트 계산
  const getRewardPoints = (rankIndex) => {
    const rewards = [100, 50, 20, 5]; 
    return rewards[rankIndex] !== undefined ? rewards[rankIndex] : 0;
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        <h2 style={styles.title}>🏆 BATTLE RESULTS 🏆</h2>
        <p style={styles.subtitle}>모든 플레이어가 제출을 완료했습니다.</p>
        
        <div style={styles.rankingList}>
          {sortedResults.map((player, index) => {
            const rank = index + 1;
            const isFirst = rank === 1;
            const isMe = player.name.includes('(나)');

            return (
              <div 
                key={index} 
                style={{
                  ...styles.rankRow,
                  borderColor: isFirst ? '#20c997' : isMe ? '#ff9f43' : '#333',
                  backgroundColor: isFirst ? 'rgba(32, 201, 151, 0.05)' : 'rgba(26, 26, 26, 0.5)',
                  boxShadow: isFirst ? '0 0 15px rgba(32, 201, 151, 0.1)' : 'none'
                }}
              >
                <div style={styles.leftInfo}>
                  <span style={{
                    ...styles.rankNumber,
                    color: isFirst ? '#20c997' : rank === 2 ? '#ff9f43' : '#fff',
                    fontSize: isFirst ? '22px' : '18px'
                  }}>
                    {rank}등
                  </span>
                  <span style={styles.tierIcon}>{player.tierIcon}</span>
                  <span style={{
                    ...styles.playerName,
                    color: isMe ? '#ff9f43' : '#fff',
                    fontWeight: isMe || isFirst ? 'bold' : 'normal'
                  }}>
                    {player.name} {isMe && <span style={styles.meTag}>ME</span>}
                  </span>
                </div>

                <div style={styles.rightInfo}>
                  <div style={styles.scoreBox}>
                    <span style={styles.label}>SCORE</span>
                    <span style={{...styles.scoreValue, color: isFirst ? '#20c997' : '#fff'}}>{player.score}점</span>
                  </div>
                  <div style={styles.rewardBox}>
                    <span style={styles.label}>REWARD</span>
                    <span style={{
                      ...styles.rewardValue,
                      color: isFirst ? '#20c997' : rank === 4 ? '#777' : '#ff9f43'
                    }}>
                      +{getRewardPoints(index)} LP
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button style={styles.lobbyBtn} onClick={onGoToLobby}>
          로비로 돌아가기
        </button>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: { display: 'flex', width: '100vw', height: '100vh', backgroundColor: '#0d0d0d', color: '#fff', justifyContent: 'center', alignItems: 'center', padding: '15px', boxSizing: 'border-box' },
  container: { width: '650px', backgroundColor: '#121212', border: '1px solid #222', borderRadius: '12px', padding: '40px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.6)' },
  title: { color: '#20c997', margin: '0 0 10px 0', fontSize: '32px', fontWeight: '900', letterSpacing: '1px', textShadow: '0 0 15px rgba(32, 201, 151, 0.3)' },
  subtitle: { color: '#aaa', margin: '0 0 35px 0', fontSize: '14px' },
  rankingList: { width: '100%', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '35px' },
  
  rankRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', border: '1px solid #333', borderRadius: '8px', transition: 'all 0.2s ease' },
  leftInfo: { display: 'flex', alignItems: 'center', gap: '15px' },
  rankNumber: { fontWeight: '900', width: '45px', fontStyle: 'italic' },
  tierIcon: { fontSize: '18px' },
  playerName: { fontSize: '16px' },
  meTag: { fontSize: '10px', backgroundColor: '#ff9f43', color: '#000', padding: '2px 5px', borderRadius: '4px', marginLeft: '5px', verticalAlign: 'middle', fontWeight: '900' },
  
  rightInfo: { display: 'flex', gap: '25px', alignItems: 'center' },
  scoreBox: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' },
  rewardBox: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px', width: '70px' },
  label: { fontSize: '10px', color: '#666', fontWeight: 'bold', letterSpacing: '0.5px' },
  scoreValue: { fontSize: '15px', fontWeight: 'bold' },
  rewardValue: { fontSize: '15px', fontWeight: 'bold' },
  
  lobbyBtn: { width: '100%', padding: '15px', backgroundColor: '#20c997', color: '#000', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s, transform 0.1s', outline: 'none' }
};