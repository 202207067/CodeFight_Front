import { create } from 'zustand';

const useBattleStore = create((set) => ({
  // 1. 코드 저장소 
  codes: {
    1: '', 2: '', 3: '', 4: '', 5: '',
  },
  
  setCode: (questionNumber, newCode) => 
    set((state) => ({
      codes: { ...state.codes, [questionNumber]: newCode }
    })),

  // 2. 캐릭터 저장소 (

  myCharacter: '👾', 
  setMyCharacter: (icon) => set({ myCharacter: icon }),
}));

export default useBattleStore;