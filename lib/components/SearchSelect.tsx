import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { RemoveScroll } from 'react-remove-scroll'

export interface SelectItem {
  label: string
  value: string
}

export interface SelectProps extends React.InputHTMLAttributes<HTMLInputElement> {
  data: SelectItem[] | ((search?: string) => SelectItem[])
  itemClassName?: string
}

const SearchLoading = () => <p className="p-2">Carregando...</p>

const SearchSelect = React.forwardRef<HTMLInputElement, SelectProps>(
  ({ data, placeholder, className, itemClassName, disabled, onChange, ...htmlProps }, ref) => {
    const [open, setOpen] = useState<boolean>(false)
    const [changing, setChanging] = useState(false)
    const [selected, setSelected] = useState<SelectItem>({ label: '', value: '' })
    const [search, setSearch] = useState<string>('')
    const [items, setItems] = useState<SelectItem[]>()

    const controllerRef = useRef<HTMLInputElement>(null)
    const areaRef = useRef<HTMLDivElement>(null)

    const handleChange = (item?: SelectItem) => {
      if (onChange) {
        onChange({
          target: {
            name: htmlProps.name,
            value: item?.value ?? '',
          },
        } as ChangeEvent<HTMLInputElement>)
      }
    }

    useEffect(() => {
      if (changing) {
        setChanging(false)
        return
      }
      if (items?.length && search) setItems(undefined)

      if (data && typeof data === 'function') {
        const dataVar = data(search)
        if (dataVar instanceof Promise) {
          dataVar.then((items: SelectItem[]) => {
            setItems(items)
          })
          return
        }
        setItems(dataVar)
      } else if (data) {
        setItems(data)
      }
    }, [changing])

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node | null

      if (
        controllerRef.current &&
        !controllerRef.current.contains(target) &&
        areaRef.current &&
        !areaRef.current.contains(target)
      ) {
        setOpen(false)
      }
    }

    useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [])

    useEffect(() => {
      if (search !== '' && items && items.length > 0) {
        const item = items.find((f) => f.label.toLowerCase() === search)
        console.log(
          item,
          search,
          items.map((f) => f.label.toLowerCase()),
        )
        if (item) {
          setSelected(item)
          handleChange(item)
        }
      } else if (search === '') handleChange()
    }, [search])

    return (
      <div className="relative flex flex-col">
        <input
          ref={controllerRef}
          onFocus={() => setOpen(true)}
          className={
            className ??
            'border-[1px] p-4 w-full cursor-pointer focus:cursor-text placeholder:gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 ease-in-out'
          }
          type="text"
          value={selected.label}
          onChange={(e) => {
            setSelected({ label: e.target.value ?? '', value: selected.value })
            setSearch(e.target.value.toLowerCase())
            setChanging(true)
          }}
          disabled={disabled}
          placeholder={placeholder}
        />
        <input ref={ref} className="hidden" type="text" value={selected.value} onChange={onChange} {...htmlProps} />
        {open && (
          <RemoveScroll>
            <div
              ref={areaRef}
              className="flex flex-col absolute bg-white mt-2 rounded-lg shadow-lg p-2 w-full max-h-[260%] overflow-y-scroll scrollbar-none"
            >
              {items?.length ? (
                items
                  .filter((f) => f.label.toLowerCase().indexOf(search ?? '') > -1)
                  .map((item, index) => (
                    <div
                      key={index}
                      className={
                        itemClassName ?? 'p-2 cursor-pointer hover:bg-gray-200 transition duration-300 ease-in-out'
                      }
                      onClick={() => {
                        setSelected(item)
                        setOpen(false)
                        handleChange(item)
                      }}
                    >
                      {item.label}
                    </div>
                  ))
              ) : (
                <SearchLoading />
              )}
            </div>
          </RemoveScroll>
        )}
      </div>
    )
  },
)

SearchSelect.displayName = 'SearchSelect'

export default SearchSelect
