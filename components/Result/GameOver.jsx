import React, { useEffect } from 'react';

export default function GameOver({ onFinish }) {
  // 3초(3000ms) 후에 자동으로 onFinish 함수를 실행해서 결과창으로 넘깁니다.
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        GAME OVER
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0f0f0f', fontFamily: '"Inter", sans-serif' },
  box: { padding: '60px 120px', backgroundColor: '#151515', border: '2px solid #333', borderRadius: '10px', color: '#fff', fontSize: '48px', fontWeight: 'bold', letterSpacing: '8px', boxShadow: '0 10px 40px rgba(0,0,0,0.8)' }
};