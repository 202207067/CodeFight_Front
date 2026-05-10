import React, { useState } from 'react';

export default function CreateRoomModal({ onClose, onCreate }) {
  const [title, setTitle] = useState('');
  const [capacity, setCapacity] = useState('1/2'); // 기본값: 2명(1:1)
  const [level, setLevel] = useState('Level 1');
  const [language, setLanguage] = useState('Python');
  const [time, setTime] = useState('30분');
  const [questionCount, setQuestionCount] = useState('5문제');
  const [password, setPassword] = useState(''); // 비밀번호 상태 추가

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return alert('방 제목을 입력해주세요!');
    // 🌟 모든 데이터(비밀번호 포함)를 부모(Lobby)로 전달
    onCreate({ title, capacity, level, language, time, questionCount, password });
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.modalTitle}>방 만들기</h2>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          
          {/* 🌟 1. 큼직한 인원수 선택 카드 영역 */}
          <div style={styles.capacityWrapper}>
            {[
              { id: '1/2', main: '1/1', sub: '(1 대 1)' },
              { id: '1/4', main: '1/N', sub: '(최대 4명)' },
              { id: '1/8', main: 'N/N', sub: '(최대 8명)' }
            ].map((item) => (
              <div 
                key={item.id} 
                style={{ 
                  ...styles.capacityCard, 
                  borderColor: capacity === item.id ? '#20c997' : '#333',
                  backgroundColor: capacity === item.id ? 'rgba(32, 201, 151, 0.05)' : '#151515',
                }}
                onClick={() => setCapacity(item.id)}
              >
                <div style={{ ...styles.capacityMainText, color: capacity === item.id ? '#20c997' : '#666' }}>
                  {item.main}
                </div>
                {/* 헷갈리지 않게 서브 텍스트 추가 */}
                <div style={styles.capacitySubText}>{item.sub}</div> 
              </div>
            ))}
          </div>

          {/* 🌟 2. 방 제목 입력 (시안처럼 라벨과 인풋 분리) */}
          <div style={styles.inputRow}>
            <div style={styles.labelBox}>방 제목</div>
            <input 
              style={styles.inputFlex} 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="방 제목을 입력하세요" 
            />
          </div>

          {/* 🌟 3. 설정 드롭다운 (시안에 맞춰 4칸으로 문제 수까지 추가) */}
          <div style={styles.dropdownRow}>
            <select style={styles.selectBox} value={level} onChange={e => setLevel(e.target.value)}>
              <option>Level 1</option><option>Level 2</option><option>Level 3</option>
            </select>
            <select style={styles.selectBox} value={language} onChange={e => setLanguage(e.target.value)}>
              <option>Python</option><option>Java</option><option>C++</option><option>JavaScript</option>
            </select>
            <select style={styles.selectBox} value={time} onChange={e => setTime(e.target.value)}>
              <option>15분</option><option>30분</option><option>45분</option><option>60분</option>
            </select>
            <select style={styles.selectBox} value={questionCount} onChange={e => setQuestionCount(e.target.value)}>
              {[3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <option key={num} value={`${num}문제`}>{num}문제</option>
              ))}
            </select>
          </div>

          {/* 🌟 4. 비밀번호 입력 */}
          <div style={styles.inputRow}>
            <div style={styles.labelBox}>비밀번호</div>
            <input 
              type="password"
              style={styles.inputFlex} 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="비밀번호를 입력하세요 (선택)" 
            />
          </div>

          {/* 🌟 5. 하단 버튼 영역 */}
          <div style={styles.btnRow}>
            <button type="submit" style={styles.createBtn}>생성하기</button>
            <button type="button" style={styles.cancelBtn} onClick={onClose}>나가기</button>
          </div>
          
        </form>
      </div>
    </div>
  );
}

// === 🌟 보내주신 시안과 싱크로율 100%를 맞춘 스타일 ===
const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modal: { width: '600px', backgroundColor: '#1a1a1a', padding: '40px', borderRadius: '12px', boxShadow: '0 0 30px rgba(0,0,0,0.9)' },
  modalTitle: { margin: '0 0 30px 0', color: '#fff', textAlign: 'center', fontSize: '22px', fontWeight: 'bold' },
  
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  
  // 큼직한 인원수 카드
  capacityWrapper: { display: 'flex', gap: '15px', marginBottom: '10px' },
  capacityCard: { flex: 1, height: '140px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px solid #333', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' },
  capacityMainText: { fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' },
  capacitySubText: { fontSize: '12px', color: '#666', fontWeight: 'bold' },
  
  // 가로형 입력창 뼈대 (방 제목, 비밀번호)
  inputRow: { display: 'flex', height: '45px' },
  labelBox: { width: '100px', backgroundColor: '#222', border: '1px solid #333', borderRight: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#ccc', fontSize: '14px', fontWeight: 'bold', borderTopLeftRadius: '4px', borderBottomLeftRadius: '4px' },
  inputFlex: { flex: 1, backgroundColor: '#111', border: '1px solid #333', color: '#fff', padding: '0 15px', fontSize: '14px', outline: 'none', borderTopRightRadius: '4px', borderBottomRightRadius: '4px' },
  
  // 드롭다운 4개 가로 배치
  dropdownRow: { display: 'flex', gap: '10px', height: '45px' },
  selectBox: { flex: 1, backgroundColor: '#111', border: '1px solid #333', color: '#ccc', padding: '0 15px', borderRadius: '4px', outline: 'none', fontSize: '14px', cursor: 'pointer' },
  
  // 하단 우측 버튼
  btnRow: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' },
  createBtn: { padding: '12px 30px', backgroundColor: '#20c997', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' },
  cancelBtn: { padding: '12px 30px', backgroundColor: '#111', color: '#ff4d4d', border: '1px solid #ff4d4d', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }
};