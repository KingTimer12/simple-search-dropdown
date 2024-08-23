import React from 'react'
import { useDataSearch } from '..'
import { Select, SelectItem } from './_select'

export interface SelectProps extends React.InputHTMLAttributes<HTMLInputElement> {
  data: SelectItem[] | ((search?: string) => Promise<SelectItem[]>)
  itemClassName?: string
  autoValue?: boolean
}

const SearchLoading = () => <p className="p-2">Carregando...</p>

const SearchSelect = React.memo(
  React.forwardRef<HTMLInputElement, SelectProps>(
    (
      {
        data,
        placeholder,
        className = 'border-[1px] p-4 w-full cursor-pointer focus:cursor-text placeholder:gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 ease-in-out',
        itemClassName = 'p-2 cursor-pointer hover:bg-gray-200 transition duration-300 ease-in-out',
        disabled,
        autoValue,
        value,
        ...htmlProps
      },
      ref,
    ) => {
      const itemFiltered = useDataSearch(data, htmlProps.name)
      const firstItem = autoValue && !value && itemFiltered.length ? itemFiltered[0].label : null

      return (
        <Select
          value={firstItem ?? value}
          clearCache={autoValue && !value ? 'first' : 'off'}
          className="relative flex flex-col"
          ref={ref}
          {...htmlProps}
        >
          <Select.Trigger className="z-10">
            <Select.Search className={className} placeholder={placeholder} disabled={disabled} />
          </Select.Trigger>
          <Select.Panel className="flex z-20 flex-col absolute bg-white mt-1 rounded-lg shadow-lg p-2 w-full overflow-y-auto max-h-[360%] scrollbar-none">
            {itemFiltered.length ? (
              itemFiltered.map((item, idx) => (
                <Select.Item key={idx} value={item.value} label={item.label} className={itemClassName} />
              ))
            ) : (
              <SearchLoading />
            )}
          </Select.Panel>
        </Select>
      )
    },
  ),
)

SearchSelect.displayName = 'SearchSelect'

export { SearchSelect }
