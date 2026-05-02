import React, { useState } from 'react';

export default function CreateRoomModal({ onClose, onStartBattle }) {
  // 모드 선택 상태 관리 (기본값 1/1)
  const [selectedMode, setSelectedMode] = useState('1/1');

  // 폼 제출(방 생성) 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`[${selectedMode} 모드] 방이 성공적으로 생성되었습니다!`);
    onClose();
    if (onStartBattle) onStartBattle();
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modalBox} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={{ margin: 0, fontSize: '18px', color: '#fff' }}>방 만들기</h2>
        </div>

        <form onSubmit={handleSubmit} style={styles.body}>
          {/* 1. 상단: 모드 선택 박스 3개 */}
          <div style={styles.modeContainer}>
            {['1/1', '1/N', 'N/N'].map((mode) => (
              <div 
                key={mode}
                style={selectedMode === mode ? styles.modeBoxActive : styles.modeBox}
                onClick={() => setSelectedMode(mode)}
              >
                {mode}
              </div>
            ))}
          </div>

          {/* 2. 중단: 방 제목 */}
          <div style={styles.inputGroup}>
            <span style={styles.label}>방 제목</span>
            <input type="text" style={styles.input} placeholder="방 제목을 입력하세요" required defaultValue="알고리즘 한 판 붙자!" />
          </div>

          {/* 3. 하단: 3분할 설정 (난이도, 언어, 제한시간) */}
          <div style={styles.threeColGroup}>
            <div style={styles.inputGroupCol}>
              <span style={styles.labelSmall}>난이도 설정</span>
              <select style={styles.select}>
                <option>초급</option>
                <option selected>중급</option>
                <option>고급</option>
              </select>
            </div>
            <div style={styles.inputGroupCol}>
              <span style={styles.labelSmall}>언어 설정</span>
              <select style={styles.select}>
                <option>모든 언어</option>
                <option>Python</option>
                <option>Java</option>
                <option>C++</option>
              </select>
            </div>
            <div style={styles.inputGroupCol}>
              <span style={styles.labelSmall}>제한시간 설정</span>
              <select style={styles.select}>
                <option>30분</option>
                <option selected>45분</option>
                <option>60분</option>
              </select>
            </div>
          </div>

          {/* 4. 최하단: 비밀번호 */}
          <div style={styles.inputGroup}>
            <span style={styles.label}>비밀번호</span>
            <input type="password" style={styles.input} placeholder="비밀번호 (선택사항)" />
          </div>

          {/* 5. 푸터: 액션 버튼 */}
          <div style={styles.footer}>
            <button type="button" style={styles.cancelBtn} onClick={onClose}>나가기</button>
            <button type="submit" style={styles.submitBtn}>생성하기</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  // 모달 배경 및 컨테이너
  overlay: { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modalBox: { width: '600px', backgroundColor: '#151515', border: '1px solid #333', borderRadius: '8px', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 30px rgba(0,0,0,0.8)' },
  header: { padding: '15px 20px', textAlign: 'center', borderBottom: '1px solid #333', backgroundColor: '#111' },
  body: { padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' },
  
  // 모드 선택 영역
  modeContainer: { display: 'flex', gap: '15px' },
  modeBox: { flex: 1, height: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#111', border: '1px solid #444', borderRadius: '8px', fontSize: '24px', fontWeight: 'bold', color: '#666', cursor: 'pointer', transition: 'all 0.2s' },
  modeBoxActive: { flex: 1, height: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a2520', border: '2px solid #20c997', borderRadius: '8px', fontSize: '24px', fontWeight: 'bold', color: '#20c997', cursor: 'pointer', boxShadow: '0 0 15px rgba(32, 201, 151, 0.2)' },
  
  // 입력 폼 영역
  inputGroup: { display: 'flex', alignItems: 'center', gap: '10px' },
  inputGroupCol: { flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { width: '80px', color: '#aaa', fontSize: '13px', fontWeight: 'bold', textAlign: 'center', backgroundColor: '#222', padding: '12px 0', border: '1px solid #444', borderRadius: '4px' },
  labelSmall: { color: '#aaa', fontSize: '12px', fontWeight: 'bold', textAlign: 'center' },
  input: { flex: 1, padding: '12px 15px', backgroundColor: '#111', border: '1px solid #444', color: '#fff', borderRadius: '4px', outline: 'none', fontFamily: '"Fira Code", monospace' },
  select: { padding: '12px 15px', backgroundColor: '#111', border: '1px solid #444', color: '#fff', borderRadius: '4px', outline: 'none', cursor: 'pointer' },
  threeColGroup: { display: 'flex', gap: '15px' },
  
  // 하단 버튼 영역
  footer: { padding: '15px 20px', display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #333', backgroundColor: '#111' },
  submitBtn: { padding: '12px 30px', backgroundColor: '#20c997', color: '#000', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', boxShadow: '0 0 10px rgba(32, 201, 151, 0.3)' },
  cancelBtn: { padding: '12px 30px', backgroundColor: '#222', color: '#ccc', border: '1px solid #444', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' },
};