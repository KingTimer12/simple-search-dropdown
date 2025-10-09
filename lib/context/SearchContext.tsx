import React, { createContext, useContext, useReducer, useMemo, useCallback, ReactNode } from 'react'
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

type Action =
  | { type: 'SET_DATA'; payload: { name: string; data?: Data } }
  | { type: 'SET_FILTERED_DATA'; payload: { name: string; items: SelectItem[] } }
  | { type: 'SET_TYPING'; payload: { name: string; isTyping: boolean } }
  | { type: 'SET_DELAY'; payload: { name: string; inDelay: boolean } }

const initialState: State = {
  instances: {},
}

const searchReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_DATA': {
      const { name, data } = action.payload
      const prevState = state.instances[name] || { isTyping: false, inDelay: false }

      let newData = data
      if (!newData) {
        newData = {
          filteredData: prevState.data?.filteredData ?? [],
          name,
          search: '',
        }
      }

      if (!newData.filteredData?.length && prevState.data?.filteredData) {
        newData.filteredData = prevState.data.filteredData
      }

      return {
        instances: {
          ...state.instances,
          [name]: {
            ...prevState,
            data: newData,
          },
        },
      }
    }

    case 'SET_FILTERED_DATA': {
      const { name, items } = action.payload
      const currentInstance = state.instances[name]

      return {
        instances: {
          ...state.instances,
          [name]: {
            ...currentInstance,
            data: {
              ...(currentInstance?.data || { name, search: '' }),
              filteredData: items,
            },
          },
        },
      }
    }

    case 'SET_TYPING': {
      const { name, isTyping } = action.payload

      return {
        instances: {
          ...state.instances,
          [name]: {
            ...state.instances[name],
            isTyping,
          },
        },
      }
    }

    case 'SET_DELAY': {
      const { name, inDelay } = action.payload

      return {
        instances: {
          ...state.instances,
          [name]: {
            ...state.instances[name],
            inDelay,
          },
        },
      }
    }

    default:
      return state
  }
}

interface SearchContextType {
  instances: Record<string, InstanceState>
  setData: (name: string, data?: Data) => void
  setFilteredData: <Item extends SelectItem>(name: string, items: Item[]) => void
  setTyping: (name: string, isTyping: boolean) => void
  setDelay: (name: string, inDelay: boolean) => void
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

interface SearchProviderProps {
  children: ReactNode
}

export const SearchProvider = React.memo<SearchProviderProps>(({ children }) => {
  const [state, dispatch] = useReducer(searchReducer, initialState)

  const setData = useCallback((name: string, data?: Data) => {
    dispatch({ type: 'SET_DATA', payload: { name, data } })
  }, [])

  const setFilteredData = useCallback(<Item extends SelectItem>(name: string, items: Item[]) => {
    dispatch({ type: 'SET_FILTERED_DATA', payload: { name, items } })
  }, [])

  const setTyping = useCallback((name: string, isTyping: boolean) => {
    dispatch({ type: 'SET_TYPING', payload: { name, isTyping } })
  }, [])

  const setDelay = useCallback((name: string, inDelay: boolean) => {
    dispatch({ type: 'SET_DELAY', payload: { name, inDelay } })
  }, [])

  const contextValue = useMemo(
    () => ({
      instances: state.instances,
      setData,
      setFilteredData,
      setTyping,
      setDelay,
    }),
    [state.instances, setData, setFilteredData, setTyping, setDelay],
  )

  return <SearchContext.Provider value={contextValue}>{children}</SearchContext.Provider>
})

SearchProvider.displayName = 'SearchProvider'

export const useSearchContext = () => {
  const context = useContext(SearchContext)
  if (context === undefined) {
    throw new Error('useSearchContext must be used within a SearchProvider')
  }
  return context
}

// Hook compatível com a API anterior do Zustand
export const useSearchSelect = <T = SearchContextType,>(selector?: (state: SearchContextType) => T) => {
  const context = useSearchContext()

  const memoizedValue = useMemo(() => {
    if (selector) {
      return selector(context)
    }
    return context
  }, [selector, context])

  if (selector) {
    return memoizedValue
  }

  return context
}
