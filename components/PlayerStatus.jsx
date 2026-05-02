// src/components/PlayerStatus.jsx
import React from 'react';

// 외부에서 이름(name), 진행도(progress), 색상(color)을 전달받아서(Props) 그림만 그려주는 부품입니다.
function PlayerStatus({ name, progress, color }) {
  return (
    <div style={{ marginBottom: '25px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
        <span>{name}</span> 
        <span>{progress}%</span>
      </div>
      <div style={{ height: '10px', backgroundColor: '#333', borderRadius: '5px', overflow: 'hidden' }}>
        <div style={{ height: '100%', backgroundColor: color, width: `${progress}%`, transition: 'width 0.5s ease' }}></div>
      </div>
    </div>
  );
}

export default PlayerStatus;