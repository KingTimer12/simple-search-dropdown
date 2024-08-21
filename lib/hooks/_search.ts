import { create } from "zustand";

type Data = {
  search: string;
  isTyping: boolean;
  inDelay: boolean;
}

type Actions = {
  setSearch: (search: string) => void;
  setTyping: (typing: boolean) => void;
  setDelay: (delay: boolean) => void;
}

const useSearchSelect = create<Data & Actions>((set) => ({
  search: "",
  isTyping: false,
  inDelay: false,
  setSearch: (search: string) => set({ search }),
  setTyping: (isTyping: boolean) => set({ isTyping }),
  setDelay: (inDelay: boolean) => set({ inDelay })
}));

export { useSearchSelect }