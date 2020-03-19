import create from 'zustand';

const [useAuctionsStore] = create((set, get) => ({
  blockHeight: 0,

 
  setBlockHeight: (val) => {
    set({ blockHeight: val });
  }
}));

export default useAuctionsStore;
