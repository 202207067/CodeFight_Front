import React, { useState } from 'react';

export default function CreateRoomModal({ onClose, onCreate }) {
  const [capacity, setCapacity] = useState('1/N');
  
  // 🌟 입력값 상태 관리
  const [roomTitle, setRoomTitle] = useState('');
  const [level, setLevel] = useState('Level 1');
  const [language, setLanguage] = useState('Python');
  const [time, setTime] = useState('30분');

  const handleCreate = () => {
    // 🌟 선택한 데이터를 묶어서 전송
    onCreate({
      title: roomTitle || '초보자 환영합니다',
      capacity: capacity,
      level: level,
      language: language,
      time: time
    });
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.title}>방 만들기</div>

        <div style={styles.capacityRow}>
          {['1/1', '1/N', 'N/N'].map((type) => (
            <div
              key={type}
              style={{ ...styles.capacityBox, borderColor: capacity === type ? '#20c997' : '#333', color: capacity === type ? '#20c997' : '#888', backgroundColor: capacity === type ? '#1e2925' : '#111' }}
              onClick={() => setCapacity(type)}
            >{type}</div>
          ))}
        </div>

        <div style={styles.inputRow}>
          <div style={styles.labelBox}>방 제목</div>
          {/* 🌟 제목 입력 연동 */}
          <input type="text" style={styles.inputField} placeholder="방 제목을 입력하세요" value={roomTitle} onChange={(e) => setRoomTitle(e.target.value)} />
        </div>

        <div style={styles.settingsRow}>
          {/* 🌟 설정 드롭다운 연동 */}
          <select style={styles.selectBox} value={level} onChange={(e) => setLevel(e.target.value)}>
            <option value="Level 1">Level 1</option>
            <option value="Level 2">Level 2</option>
            <option value="Level 3">Level 3</option>
          </select>
          <select style={styles.selectBox} value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="Python">Python</option>
            <option value="Java">Java</option>
            <option value="C++">C++</option>
          </select>
          <select style={styles.selectBox} value={time} onChange={(e) => setTime(e.target.value)}>
            <option value="30분">30분</option>
            <option value="45분">45분</option>
            <option value="60분">60분</option>
          </select>
        </div>

        <div style={styles.inputRow}>
          <div style={styles.labelBox}>비밀번호</div>
          <input type="password" style={styles.inputField} placeholder="비밀번호를 입력하세요 (선택)" />
        </div>

        <div style={styles.actionRow}>
          <button style={styles.createBtn} onClick={handleCreate}>생성하기</button>
          <button style={styles.cancelBtn} onClick={onClose}>나가기</button>
        </div>
      </div>
    </div>
  );
}

const styles = { overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }, modal: { width: '600px', backgroundColor: '#151515', border: '1px solid #333', borderRadius: '8px', padding: '30px', display: 'flex', flexDirection: 'column', gap: '15px', fontFamily: '"Inter", sans-serif', boxShadow: '0 10px 30px rgba(0,0,0,0.8)' }, title: { fontSize: '20px', fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: '10px' }, capacityRow: { display: 'flex', gap: '15px', height: '140px', marginBottom: '10px' }, capacityBox: { flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', border: '2px solid', borderRadius: '8px', fontSize: '28px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }, inputRow: { display: 'flex', gap: '10px' }, labelBox: { width: '80px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#222', border: '1px solid #444', borderRadius: '4px', color: '#ccc', fontSize: '13px', fontWeight: 'bold' }, inputField: { flex: 1, padding: '12px 15px', backgroundColor: '#111', border: '1px solid #444', borderRadius: '4px', color: '#fff', fontSize: '14px', outline: 'none' }, settingsRow: { display: 'flex', gap: '10px' }, selectBox: { flex: 1, padding: '12px 10px', backgroundColor: '#111', border: '1px solid #444', borderRadius: '4px', color: '#ccc', fontSize: '14px', outline: 'none', cursor: 'pointer' }, actionRow: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '15px' }, createBtn: { padding: '10px 25px', backgroundColor: '#20c997', color: '#000', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }, cancelBtn: { padding: '10px 25px', backgroundColor: 'transparent', border: '1px solid #ff4d4d', color: '#ff4d4d', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' } };