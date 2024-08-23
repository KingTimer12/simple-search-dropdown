import { create } from 'zustand'
import { SelectItem } from '../components'

export type Data = {
  name: string
  search: string
  filteredData?: SelectItem[]
}

type InstanceState = {
  data?: Data
  isTyping: boolean
  inDelay: boolean
}

type State = {
  instances: Record<string, InstanceState>
}

type Actions = {
  setData: (name: string, data?: Data) => void
  setFilteredData: <Item extends SelectItem>(name: string, items: Item[]) => void
  setTyping: (name: string, typing: boolean) => void
  setDelay: (name: string, delay: boolean) => void
}

const useSearchSelect = create<State & Actions>((set) => ({
  instances: {},

  setData: (name, data) =>
    set((state) => {
      const prevState = state.instances[name] || { isTyping: false, inDelay: false }
      if (!data) data = { filteredData: prevState.data?.filteredData ?? [], name, search: '' }
      if (!data.filteredData?.length && prevState.data?.filteredData) data.filteredData = prevState.data.filteredData
      return {
        instances: {
          ...state.instances,
          [name]: {
            ...prevState,
            data,
          },
        },
      }
    }),

  setFilteredData: (name, items) =>
    set((state) => ({
      instances: {
        ...state.instances,
        [name]: {
          ...state.instances[name],
          data: {
            ...(state.instances[name]?.data || { name, search: '' }),
            filteredData: items,
          },
        },
      },
    })),

  setTyping: (name, isTyping) =>
    set((state) => ({
      instances: {
        ...state.instances,
        [name]: {
          ...state.instances[name],
          isTyping,
        },
      },
    })),

  setDelay: (name, inDelay) =>
    set((state) => ({
      instances: {
        ...state.instances,
        [name]: {
          ...state.instances[name],
          inDelay,
        },
      },
    })),
}))

export { useSearchSelect }
