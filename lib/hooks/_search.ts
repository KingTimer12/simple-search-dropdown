import { create } from "zustand";

type Data = {
  search: string;
  isTyping: boolean;
}

type Actions = {
  setSearch: (search: string) => void;
  setTyping: (typing: boolean) => void;
}

const useSearchSelect = create<Data & Actions>((set) => ({
  search: "",
  isTyping: false,
  setSearch: (search: string) => set({ search }),
  setTyping: (isTyping: boolean) => set({ isTyping })
}));

export { useSearchSelect }