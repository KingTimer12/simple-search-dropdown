import React, { ForwardRefExoticComponent, RefAttributes, useRef, useState } from 'react'
import { RemoveScroll } from 'react-remove-scroll'
import { Data, useSearchSelect } from '../store'

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

const Select = React.forwardRef<HTMLInputElement, SelectExtendedProps>(
  ({ children, onChange, onBlur, name, onOpenChange, value, clearCache = 'off', open = false, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(open)
    const [valueIsSearched, setValueIsSearched] = useState(0)
    const { instances, setData, setTyping, setFilteredData } = useSearchSelect((s) => s)
    const { data, isTyping } = instances[name ?? ''] ?? {}
    const [selected, setSelected] = useState<SelectItem>({ label: '', value: '' })

    const areaRef = useRef<HTMLDivElement>(null)
    const searchRef = useRef<HTMLInputElement>(null)

    React.useEffect(() => setIsOpen(open), [open])

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Node | null
        if (
          areaRef?.current &&
          !areaRef.current.contains(target) &&
          searchRef?.current &&
          !searchRef.current.contains(target)
        ) {
          setIsOpen(false)
        }
      }

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setIsOpen(false)
        } else if (event.key === 'Backspace' || event.key === 'Delete') {
          setFilteredData(name ?? '', [])
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
        document.addEventListener('keydown', handleKeyDown)
      }
    }, [])

    React.useEffect(() => {
      if (isOpen) {
        setData(name ?? '', {
          name: name ?? '',
          search: selected.label.toLowerCase(),
        })
      } else {
        setData(name ?? '')
      }
      if (onOpenChange) onOpenChange(isOpen)
    }, [isOpen])

    React.useEffect(() => {
      if (value && value !== '' && valueIsSearched === 0) {
        setSelected({ label: value as string, value: selected.value })
        setData(name ?? '', {
          name: name ?? '',
          search: value as string,
        })
        setTyping(name ?? '', true)
        setValueIsSearched(1)
      }
    }, [value])

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
          setData(name ?? '', {
            name: name ?? '',
            search: '',
            filteredData: [],
          })
          setTyping(name ?? '', false)
        }
      } else if (
        valueIsSearched === 2 &&
        !isTyping &&
        data?.filteredData?.length &&
        data?.search !== '' &&
        clearCache === 'first'
      ) {
        setValueIsSearched(3)
        setData(name ?? '', {
          name: name ?? '',
          search: '',
          filteredData: [],
        })
        setTyping(name ?? '', !isTyping)
      }
    }, [data?.filteredData, isTyping, valueIsSearched])

    const toggleOpen = () => {
      setIsOpen(!isOpen)
    }

    return (
      <SelectContext.Provider
        value={{
          data,
          isOpen,
          isTyping,
          selected,
          toggleOpen,
          clearCache,
          areaRef,
          searchRef,
          setSelected,
          setTyping,
          setData,
          onChange,
          onBlur,
          name,
          ref,
        }}
      >
        <div {...props}>{children}</div>
      </SelectContext.Provider>
    )
  },
) as SelectComponent

const SelectTrigger = ({ children, ...props }: SelectProps) => {
  const { name = '', selected, onChange, onBlur, ref } = React.useContext(SelectContext)

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
        onChange={onChange}
        onBlur={onBlur}
        name={name}
        ref={ref}
      />
    </div>
  )
}

const SelectPanel = ({ children, ...props }: SelectProps) => {
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
}

interface SelectItemProps extends SelectProps {
  value: string
  label: string
}
const SelectItem = ({ children, onClick, value, label, ...props }: SelectItemProps) => {
  const { setSelected, isOpen, toggleOpen, onChange, name, data, selected } = React.useContext(SelectContext)
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onClick) onClick(e)
    setSelected({ value, label })
    if (isOpen) toggleOpen() // close dropdown
    if (onChange) onChange({ target: { name, value } } as React.ChangeEvent<HTMLInputElement>)
  }

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
  }, [selected.label])

  return (
    <div {...props} onClick={handleClick}>
      {children ?? label}
    </div>
  )
}

const SelectButton = ({ children, onClick, ...props }: SelectButtonProps) => {
  const { toggleOpen } = React.useContext(SelectContext)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    toggleOpen()
    if (onClick) onClick(e)
  }

  return (
    <button {...props} onClick={handleClick}>
      {children}
    </button>
  )
}

const SelectSearch = React.memo(({ onChange, onFocus, ...htmlProps }: SelectSearchProps) => {
  const { isOpen, toggleOpen, selected, searchRef, setData, setTyping, setSelected, name } =
    React.useContext(SelectContext)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData(name ?? '', {
      name: name ?? '',
      search: e.target.value.toLowerCase(),
    })
    setSelected({ label: e.target.value, value: selected.value })
    setTyping(name ?? '', true)
    if (onChange) onChange(e)
  }

  const handleClick = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!isOpen) toggleOpen()
    if (onFocus) onFocus(e)
  }

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

Select.Trigger = SelectTrigger
Select.Item = SelectItem
Select.Panel = SelectPanel
Select.Button = SelectButton
Select.Search = SelectSearch

export { Select }
