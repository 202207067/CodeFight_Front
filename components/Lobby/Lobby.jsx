import React, { useState } from 'react';

// 같은 Lobby 폴더 안에 있는 부품(컴포넌트)들을 불러옵니다.
import LobbyHeader from './LobbyHeader';
import RoomList from './RoomList';
import LobbyChat from './LobbyChat';
import MyProfile from './MyProfile';
import SocialList from './SocialList';
import CreateRoomModal from './CreateRoomModal';
import UserProfileModal from './UserProfileModal';

export default function Lobby({ onStartBattle }) {
  // 모달 상태 관리
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // 전역 데이터 (나중에 백엔드 API로 교체될 부분)
  const [rooms] = useState([
    { no: 1, title: '두 수의 합 변형 (초보만)', lang: 'Python', status: '대기중' },
    { no: 4, title: '스피드 SA!! 자바 고수 환영', lang: 'Java', status: '게임중' }
  ]);

  const [lobbyUsers] = useState([
    { id: 1, name: '현서 (나)', tier: 'Silver', tierColor: '#adb5bd', isMe: true },
    { id: 2, name: '영환', tier: 'Gold', tierColor: '#ffc107', isFriend: true }
  ]);

  return (
    <>
      <style>{`
        .lobby-wrapper { display: flex; flex-direction: column; height: 100vh; background-color: #0f0f0f; font-family: "Inter", sans-serif; }
        .lobby-main { display: flex; gap: 20px; padding: 20px 30px; flex: 1; overflow: hidden; }
        .left-col { flex: 7; display: flex; flex-direction: column; gap: 20px; }
        .right-col { flex: 3; display: flex; flex-direction: column; gap: 20px; }
      `}</style>

      {/* 팝업창 컴포넌트들 */}
      {showCreateModal && <CreateRoomModal onClose={() => setShowCreateModal(false)} onStartBattle={onStartBattle} />}
      <UserProfileModal user={selectedUser} onClose={() => setSelectedUser(null)} />

      {/* 메인 화면 조립 */}
      <div className="lobby-wrapper">
        <LobbyHeader />
        
        <main className="lobby-main">
          <div className="left-col">
            <RoomList rooms={rooms} onStartBattle={onStartBattle} onOpenCreate={() => setShowCreateModal(true)} />
            <LobbyChat />
          </div>

          <div className="right-col">
            <MyProfile />
            <SocialList users={lobbyUsers} friends={lobbyUsers} onUserDoubleClick={setSelectedUser} />
          </div>
        </main>
      </div>
    </>
  );
}