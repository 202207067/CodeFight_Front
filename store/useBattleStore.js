// src/store/useBattleStore.js
import { create } from 'zustand';

const useBattleStore = create((set) => ({
  // 1번부터 5번 문제까지의 코드를 각각 따로 저장할 공간
  codes: {
    1: '',
    2: '',
    3: '',
    4: '',
    5: '',
  },
  
  // 특정 번호의 문제 코드를 업데이트하는 함수
  setCode: (questionNumber, newCode) => 
    set((state) => ({
      codes: {
        ...state.codes,
        [questionNumber]: newCode
      }
    })),
}));

export default useBattleStore;