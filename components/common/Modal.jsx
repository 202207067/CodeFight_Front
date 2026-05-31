import React, { useState } from 'react';

export default function Modal({ onClose, onCreate }) {
  const [title, setTitle] = useState('');
  const [capacity, setCapacity] = useState('2'); // 기본값: 2명(개인전)
  const [level, setLevel] = useState('Level 1');
  const [language, setLanguage] = useState('Python');
  const [time, setTime] = useState('30분');
  const [questionCount, setQuestionCount] = useState('5문제');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return alert('방 제목을 입력해주세요!');
    onCreate({ title, capacity, level, language, time, questionCount, password });
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.modalTitle}>방 만들기 (개인전)</h2>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* 🌟 인원 선택 옵션을 8명까지 확장 */}
          <div style={styles.inputRow}>
            <div style={styles.labelBox}>인원 제한</div>
            <select style={styles.inputFlex} value={capacity} onChange={e => setCapacity(e.target.value)}>
              <option value="2">2명</option>
              <option value="3">3명</option>
              <option value="4">4명</option>
              <option value="5">5명</option>
              <option value="6">6명</option>
              <option value="7">7명</option>
              <option value="8">8명</option>
            </select>
          </div>

          <div style={styles.inputRow}>
            <div style={styles.labelBox}>방 제목</div>
            <input 
              style={styles.inputFlex} 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="방 제목을 입력하세요" 
            />
          </div>

          <div style={styles.dropdownRow}>
            <select style={styles.selectBox} value={level} onChange={e => setLevel(e.target.value)}>
              <option>Level 1</option><option>Level 2</option><option>Level 3</option>
            </select>
            <select style={styles.selectBox} value={language} onChange={e => setLanguage(e.target.value)}>
              <option>Python</option><option>Java</option><option>C++</option><option>JavaScript</option>
            </select>
          </div>

          <div style={styles.dropdownRow}>
            <select style={styles.selectBox} value={time} onChange={e => setTime(e.target.value)}>
              <option>15분</option><option>30분</option><option>45분</option><option>60분</option>
            </select>
            <select style={styles.selectBox} value={questionCount} onChange={e => setQuestionCount(e.target.value)}>
              {[3, 4, 5, 6, 7, 8, 9, 10].map(num => <option key={num} value={`${num}문제`}>{num}문제</option>)}
            </select>
          </div>

          <div style={styles.inputRow}>
            <div style={styles.labelBox}>비밀번호</div>
            <input 
              type="password"
              style={styles.inputFlex} 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="비밀번호 (선택)" 
            />
          </div>

          <div style={styles.btnRow}>
            <button type="submit" style={styles.createBtn}>생성하기</button>
            <button type="button" style={styles.cancelBtn} onClick={onClose}>나가기</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modal: { width: '500px', backgroundColor: '#1a1a1a', padding: '40px', borderRadius: '12px', boxShadow: '0 0 30px rgba(0,0,0,0.9)' },
  modalTitle: { margin: '0 0 30px 0', color: '#fff', textAlign: 'center', fontSize: '22px', fontWeight: 'bold' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  inputRow: { display: 'flex', height: '45px' },
  labelBox: { width: '100px', backgroundColor: '#222', border: '1px solid #333', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#ccc', fontSize: '14px', fontWeight: 'bold', borderRadius: '4px 0 0 4px' },
  inputFlex: { flex: 1, backgroundColor: '#111', border: '1px solid #333', color: '#fff', padding: '0 15px', outline: 'none', borderRadius: '0 4px 4px 0' },
  dropdownRow: { display: 'flex', gap: '10px', height: '45px' },
  selectBox: { flex: 1, backgroundColor: '#111', border: '1px solid #333', color: '#ccc', padding: '0 15px', borderRadius: '4px', cursor: 'pointer' },
  btnRow: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' },
  createBtn: { padding: '12px 30px', backgroundColor: '#20c997', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  cancelBtn: { padding: '12px 30px', backgroundColor: '#111', color: '#ff4d4d', border: '1px solid #ff4d4d', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }
};