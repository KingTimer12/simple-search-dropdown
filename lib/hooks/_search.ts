import { create } from 'zustand'

export type Data = {
  name: string
  search: string
}

type State = {
  data?: Data
  isTyping: boolean
  inDelay: boolean
}

type Actions = {
  setData: (data?: Data) => void
  setTyping: (typing: boolean) => void
  setDelay: (delay: boolean) => void
}

const useSearchSelect = create<State & Actions>((set) => ({
  data: undefined,
  isTyping: false,
  inDelay: false,
  setData: (data) => set({ data }),
  setTyping: (isTyping: boolean) => set({ isTyping }),
  setDelay: (inDelay: boolean) => set({ inDelay }),
}))

export { useSearchSelect }
