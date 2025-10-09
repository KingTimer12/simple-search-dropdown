import React, { ForwardRefExoticComponent, RefAttributes, useRef, useState, useCallback, useMemo } from 'react'
import { RemoveScroll } from 'react-remove-scroll'
import { Data, useSearchSelect } from '../context'

type SelectSearchProps = React.InputHTMLAttributes<HTMLInputElement>
type SelectButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>
type SelectProps = React.HTMLAttributes<HTMLDivElement>
type ClearCacheSelect = 'off' | 'first'

export interface SelectItem {
  label: string
  value: string
}

interface SelectContextProps {
  isOpen: boolean
  isTyping: boolean
  selected: SelectItem
  clearCache?: ClearCacheSelect
  name?: string
  data?: Data
  ref?: React.ForwardedRef<HTMLInputElement>
  areaRef?: React.RefObject<HTMLDivElement>
  searchRef?: React.RefObject<HTMLInputElement>
  toggleOpen: () => void
  setSelected: (item: SelectItem) => void
  setData: (name: string, data?: Data) => void
  setTyping: (name: string, value: boolean) => void
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
}

const SelectContext = React.createContext<SelectContextProps>({
  isOpen: false,
  isTyping: false,
  clearCache: 'off',
  selected: { label: '', value: '' },
  toggleOpen: () => {},
  setSelected: () => {},
  setTyping: () => {},
  setData: () => {},
})

interface SelectTriggerProps extends SelectProps {
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
  name?: string
  value?: string | number | readonly string[]
  clearCache?: ClearCacheSelect
  open?: boolean
}

type SelectExtendedProps = SelectTriggerProps & {
  onOpenChange?: (isOpen: boolean) => void
}

interface SelectComponent extends ForwardRefExoticComponent<SelectExtendedProps & RefAttributes<HTMLDivElement>> {
  Trigger: typeof SelectTrigger
  Item: typeof SelectItem
  Panel: typeof SelectPanel
  Button: typeof SelectButton
  Search: typeof SelectSearch
}
const SelectBase = React.forwardRef<HTMLInputElement, SelectExtendedProps>(
  ({ children, onChange, onBlur, name, onOpenChange, value, clearCache = 'off', open = false, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(open)
    const [valueIsSearched, setValueIsSearched] = useState(0)
    const { instances, setData, setTyping, setFilteredData } = useSearchSelect()

    const instanceData = useMemo(
      () => instances[name ?? ''] ?? { data: undefined, isTyping: false, inDelay: false },
      [instances, name],
    )

    const { data, isTyping } = instanceData
    const [selected, setSelected] = useState<SelectItem>({ label: '', value: '' })

    const areaRef = useRef<HTMLDivElement>(null)
    const searchRef = useRef<HTMLInputElement>(null)

    const memoizedSetData = useCallback(
      (instanceName: string, data?: Data) => {
        setData(instanceName, data)
      },
      [setData],
    )

    const memoizedSetTyping = useCallback(
      (instanceName: string, typing: boolean) => {
        setTyping(instanceName, typing)
      },
      [setTyping],
    )

    const memoizedSetFilteredData = useCallback(
      (instanceName: string, items: SelectItem[]) => {
        setFilteredData(instanceName, items)
      },
      [setFilteredData],
    )

    React.useEffect(() => setIsOpen(open), [open])

    const handleClickOutside = useCallback((event: MouseEvent) => {
      const target = event.target as Node | null
      if (
        areaRef?.current &&
        !areaRef.current.contains(target) &&
        searchRef?.current &&
        !searchRef.current.contains(target)
      ) {
        setIsOpen(false)
      }
    }, [])

    const handleKeyDown = useCallback(
      (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setIsOpen(false)
        } else if (event.key === 'Backspace' || event.key === 'Delete') {
          memoizedSetFilteredData(name ?? '', [])
        }
      },
      [name, memoizedSetFilteredData],
    )

    React.useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
        document.removeEventListener('keydown', handleKeyDown)
      }
    }, [handleClickOutside, handleKeyDown])

    React.useEffect(() => {
      if (isOpen) {
        memoizedSetData(name ?? '', {
          name: name ?? '',
          search: selected.label.toLowerCase(),
        })
      } else {
        memoizedSetData(name ?? '')
      }
      if (onOpenChange) onOpenChange(isOpen)
    }, [isOpen, name, selected.label, memoizedSetData, onOpenChange])

    React.useEffect(() => {
      if (value && value !== '' && valueIsSearched === 0) {
        setSelected({ label: value as string, value: selected.value })
        memoizedSetData(name ?? '', {
          name: name ?? '',
          search: value as string,
        })
        memoizedSetTyping(name ?? '', true)
        setValueIsSearched(1)
      }
    }, [value, valueIsSearched, selected.value, name, memoizedSetData, memoizedSetTyping])

    React.useEffect(() => {
      if (
        data &&
        data.name === (name ?? '') &&
        data.filteredData?.length &&
        data.filteredData[0].label.toLowerCase() === selected.label.toLowerCase() &&
        valueIsSearched === 1
      ) {
        setValueIsSearched(2)
        const filteredData =
          data.filteredData.find((item) => item.label.toLowerCase() === selected.label.toLowerCase()) ??
          data.filteredData[0]
        setSelected(filteredData)
        if (onChange) onChange({ target: { name, value: filteredData.value } } as React.ChangeEvent<HTMLInputElement>)
        if (clearCache === 'first') {
          memoizedSetData(name ?? '', {
            name: name ?? '',
            search: '',
            filteredData: [],
          })
          memoizedSetTyping(name ?? '', false)
        }
      } else if (
        valueIsSearched === 2 &&
        !isTyping &&
        data?.filteredData?.length &&
        data?.search !== '' &&
        clearCache === 'first'
      ) {
        setValueIsSearched(3)
        memoizedSetData(name ?? '', {
          name: name ?? '',
          search: '',
          filteredData: [],
        })
        memoizedSetTyping(name ?? '', !isTyping)
      }
    }, [
      data?.filteredData,
      isTyping,
      valueIsSearched,
      name,
      onChange,
      clearCache,
      selected.label,
      memoizedSetData,
      memoizedSetTyping,
      data,
    ])

    const toggleOpen = useCallback(() => {
      setIsOpen(!isOpen)
    }, [isOpen])

    const contextValue = useMemo(
      () => ({
        data,
        isOpen,
        isTyping,
        selected,
        toggleOpen,
        clearCache,
        areaRef,
        searchRef,
        setSelected,
        setTyping: memoizedSetTyping,
        setData: memoizedSetData,
        onChange,
        onBlur,
        name,
        ref,
      }),
      [
        data,
        isOpen,
        isTyping,
        selected,
        toggleOpen,
        clearCache,
        memoizedSetTyping,
        memoizedSetData,
        onChange,
        onBlur,
        name,
        ref,
      ],
    )

    return (
      <SelectContext.Provider value={contextValue}>
        <div {...props}>{children}</div>
      </SelectContext.Provider>
    )
  },
)

const Select = React.memo(SelectBase) as unknown as SelectComponent

Select.displayName = 'Select'

const SelectTrigger = React.memo<SelectProps>(({ children, ...props }) => {
  const { name = '', selected, onChange, onBlur, ref } = React.useContext(SelectContext)

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) onChange(e)
    },
    [onChange],
  )

  React.useEffect(() => {
    const element = document.getElementById(name)
    if (element !== null) element.hidden = true
  }, [name])

  return (
    <div {...props}>
      {children}
      <input
        id={name}
        type="text"
        value={selected.value ?? ''}
        onChange={handleChange}
        onBlur={onBlur}
        name={name}
        ref={ref}
      />
    </div>
  )
})

SelectTrigger.displayName = 'SelectTrigger'

const SelectPanel = React.memo<SelectProps>(({ children, ...props }) => {
  const { isOpen, areaRef } = React.useContext(SelectContext)

  return (
    isOpen && (
      <RemoveScroll>
        <div {...props} ref={areaRef}>
          {children}
        </div>
      </RemoveScroll>
    )
  )
})

SelectPanel.displayName = 'SelectPanel'

interface SelectItemProps extends SelectProps {
  value: string
  label: string
}

const SelectItem = React.memo<SelectItemProps>(({ children, onClick, value, label, ...props }) => {
  const { setSelected, isOpen, toggleOpen, onChange, name, data, selected } = React.useContext(SelectContext)

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (onClick) onClick(e)
      setSelected({ value, label })
      if (isOpen) toggleOpen() // close dropdown
      if (onChange) onChange({ target: { name, value } } as React.ChangeEvent<HTMLInputElement>)
    },
    [onClick, setSelected, value, label, isOpen, toggleOpen, onChange, name],
  )

  React.useEffect(() => {
    if (data?.name !== name) return
    if (data?.search !== '' && data?.search.toLowerCase() === label.toLowerCase()) {
      setSelected({ value, label })
      if (onChange) onChange({ target: { name, value } } as React.ChangeEvent<HTMLInputElement>)
    } else if (
      selected.label === '' ||
      data?.filteredData?.length === 0 ||
      !data?.filteredData?.find((f) => f.label.toLowerCase() === selected.label.toLowerCase())
    ) {
      setSelected({ value: '', label: selected.label })
      if (onChange) onChange({ target: { name, value: '' } } as React.ChangeEvent<HTMLInputElement>)
    }
  }, [selected.label, data, name, value, label, setSelected, onChange])

  return (
    <div {...props} onClick={handleClick}>
      {children ?? label}
    </div>
  )
})

SelectItem.displayName = 'SelectItem'

const SelectButton = React.memo<SelectButtonProps>(({ children, onClick, ...props }) => {
  const { toggleOpen } = React.useContext(SelectContext)

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      toggleOpen()
      if (onClick) onClick(e)
    },
    [toggleOpen, onClick],
  )

  return (
    <button {...props} onClick={handleClick}>
      {children}
    </button>
  )
})

SelectButton.displayName = 'SelectButton'

const SelectSearch = React.memo<SelectSearchProps>(({ onChange, onFocus, ...htmlProps }) => {
  const { isOpen, toggleOpen, selected, searchRef, setData, setTyping, setSelected, name } =
    React.useContext(SelectContext)

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setData(name ?? '', {
        name: name ?? '',
        search: e.target.value.toLowerCase(),
      })
      setSelected({ label: e.target.value, value: selected.value })
      setTyping(name ?? '', true)
      if (onChange) onChange(e)
    },
    [setData, name, setSelected, selected.value, setTyping, onChange],
  )

  const handleClick = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      if (!isOpen) toggleOpen()
      if (onFocus) onFocus(e)
    },
    [isOpen, toggleOpen, onFocus],
  )

  return (
    <input
      ref={searchRef}
      onChange={handleChange}
      onFocus={handleClick}
      type="text"
      value={selected.label}
      {...htmlProps}
    />
  )
})

SelectSearch.displayName = 'SelectSearch'

Select.Trigger = SelectTrigger
Select.Item = SelectItem
Select.Panel = SelectPanel
Select.Button = SelectButton
Select.Search = SelectSearch

export { Select }
