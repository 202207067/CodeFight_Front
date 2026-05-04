import React from 'react';

export default function RoomList({ onRoomClick }) {
  const rooms = [
    { id: 1, title: '초보만 오세요', capacity: '1/N', status: 'STARTED' },
    { id: 2, title: '리액트 고수 구함', capacity: '1/1', status: 'WAITING' },
    { id: 3, title: '즐겜유저 드루와', capacity: 'N/N', status: 'WAITING' },
    { id: 4, title: 'C# 장인 대결', capacity: '1/N', status: 'STARTED' },
  ];

  return (
    <div style={styles.gridContainer}>
      {rooms.map(room => (
        <div key={room.id} style={styles.roomCard} onClick={onRoomClick}>
          <div style={styles.leftBox}>
            <div style={styles.roomNumber}>{room.id}</div>
            <div style={styles.capacityBox}>[{room.capacity}]</div>
          </div>
          <div style={styles.rightBox}>
            <div style={styles.roomTitle}>{room.title}</div>
            <div style={{ ...styles.roomStatus, color: room.status === 'WAITING' ? '#20c997' : '#ff4d4d' }}>
              {room.status}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  gridContainer: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', flex: 1 },
  roomCard: { display: 'flex', backgroundColor: '#111', border: '1px solid #444', borderRadius: '8px', cursor: 'pointer', overflow: 'hidden' },
  leftBox: { flex: 1, backgroundColor: '#222', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '15px', borderRight: '1px solid #444' },
  roomNumber: { fontSize: '24px', fontWeight: 'bold', color: '#fff', marginBottom: '8px' },
  capacityBox: { fontSize: '12px', color: '#aaa', border: '1px solid #666', padding: '2px 6px', borderRadius: '4px' },
  rightBox: { flex: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '15px' },
  roomTitle: { fontSize: '16px', color: '#eee', fontWeight: 'bold', marginBottom: '15px' },
  roomStatus: { fontSize: '20px', fontWeight: '900', letterSpacing: '1px' }
};