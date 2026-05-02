// src/components/ProblemSection.jsx
import React from 'react';

function ProblemSection() {
  return (
    <section style={styles.container}>
      <h4 style={styles.title}>문제 설명</h4>
      <div style={styles.content}>
        <p>정수 배열 <code>nums</code>와 정수 <code>target</code>이 주어졌을 때, 
        합이 <code>target</code>이 되는 두 수의 인덱스를 반환하는 프로그램을 작성하세요.</p>
        <div style={styles.example}>
          <strong>예시:</strong><br />
          입력: nums = [2, 7, 11, 15], target = 9<br />
          출력: [0, 1]
        </div>
      </div>
    </section>
  );
}

const styles = {
  container: { flex: 1.5, padding: '20px', borderRight: '1px solid #333', overflowY: 'auto', backgroundColor: '#0f0f0f' },
  title: { fontSize: '16px', color: '#0d6efd', borderLeft: '4px solid #0d6efd', paddingLeft: '10px', marginBottom: '20px' },
  content: { color: '#ccc', lineHeight: '1.6', fontSize: '14px' },
  example: { backgroundColor: '#222', padding: '15px', borderRadius: '8px', marginTop: '20px', color: '#00ff00', fontFamily: 'monospace' }
};

export default ProblemSection;