import React, { useCallback, useMemo } from 'react'
import { useDataSearch } from '..'
import { Select, SelectItem } from './_select'
import { SearchProvider } from '../context'

export interface SelectProps extends React.InputHTMLAttributes<HTMLInputElement> {
  data: SelectItem[] | ((search?: string) => Promise<SelectItem[]>)
  itemClassName?: string
  autoValue?: boolean
  open?: boolean
  onOpenChange?: (isOpen: boolean) => void
}

const SearchLoading = React.memo(() => <p className="p-2">Carregando...</p>)
SearchLoading.displayName = 'SearchLoading'

const SearchSelectInner = React.memo(
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
        onOpenChange,
        open = false,
        ...htmlProps
      },
      ref,
    ) => {
      const itemFiltered = useDataSearch(data, htmlProps.name)

      const firstItem = useMemo(() => {
        return autoValue && !value && itemFiltered.length ? itemFiltered[0].label : null
      }, [autoValue, value, itemFiltered])

      const clearCache = useMemo(() => {
        return autoValue && !value ? ('first' as const) : ('off' as const)
      }, [autoValue, value])

      const memoizedOnOpenChange = useCallback(
        (isOpen: boolean) => {
          if (onOpenChange) onOpenChange(isOpen)
        },
        [onOpenChange],
      )

      const renderItems = useMemo(() => {
        if (itemFiltered.length) {
          return itemFiltered.map((item, idx) => (
            <Select.Item key={`${item.value}-${idx}`} value={item.value} label={item.label} className={itemClassName} />
          ))
        }
        return <SearchLoading />
      }, [itemFiltered, itemClassName])

      const triggerProps = useMemo(
        () => ({
          className: 'z-10',
        }),
        [],
      )

      const searchProps = useMemo(
        () => ({
          className,
          placeholder,
          disabled,
        }),
        [className, placeholder, disabled],
      )

      const panelProps = useMemo(
        () => ({
          className:
            'flex z-20 flex-col absolute bg-white mt-1 rounded-lg shadow-lg p-2 w-full overflow-y-auto max-h-[360%] scrollbar-none',
        }),
        [],
      )

      const selectProps = useMemo(
        () => ({
          value: firstItem ?? value,
          clearCache,
          className: 'relative flex flex-col',
          open,
          onOpenChange: memoizedOnOpenChange,
          ...htmlProps,
        }),
        [firstItem, value, clearCache, open, memoizedOnOpenChange, htmlProps],
      )

      return (
        <Select ref={ref} {...selectProps}>
          <Select.Trigger {...triggerProps}>
            <Select.Search {...searchProps} />
          </Select.Trigger>
          <Select.Panel {...panelProps}>{renderItems}</Select.Panel>
        </Select>
      )
    },
  ),
)

SearchSelectInner.displayName = 'SearchSelectInner'

const SearchSelect = React.memo(
  React.forwardRef<HTMLInputElement, SelectProps>((props, ref) => (
    <SearchProvider>
      <SearchSelectInner {...props} ref={ref} />
    </SearchProvider>
  )),
)

SearchSelect.displayName = 'SearchSelect'

export { SearchSelect }
