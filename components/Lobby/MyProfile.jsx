import React from 'react';

export default function MyProfile() {
  return (
    <section style={{ backgroundColor: '#151515', border: '1px solid #333', borderRadius: '6px', padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
        <div style={{ width: '50px', height: '50px', backgroundColor: '#0d6efd', color: '#fff', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '15px' }}>ME</div>
        <div>
          <h3 style={{ margin: 0, color: '#fff', fontSize: '18px' }}>현서 <span style={{ fontSize: '11px', backgroundColor: '#adb5bd', color: '#111', padding: '2px 6px', borderRadius: '4px' }}>Silver II</span></h3>
          <div style={{ color: '#888', fontSize: '12px', marginTop: '4px' }}>Python | 승률 68%</div>
        </div>
      </div>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#aaa', marginBottom: '5px' }}><span>EXP</span><span>1450 / 2000</span></div>
        <div style={{ height: '10px', backgroundColor: '#222', borderRadius: '5px' }}><div style={{ width: '72.5%', height: '100%', backgroundColor: '#20c997', borderRadius: '5px' }}></div></div>
      </div>
    </section>
  );
}