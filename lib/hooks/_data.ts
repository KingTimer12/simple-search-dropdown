import { useEffect, useMemo, useCallback } from 'react'
import { SelectItem } from '../components'
import { useSearchSelect } from '../context'

/**
 * Hook to search data and filter it
 * @param {SelectItem[] | ((search?: string) => Promise<SelectItem[]>)} data - Data to search or function to fetch data
 * @param {String} name - Name of the instance
 * @param {Number} delay - Delay to search
 * @returns {SelectItem[]} Filtered data
 * @example
 * ```ts
 * const data = [
 *   { value: '1', label: 'One' },
 *   { value: '2', label: 'Two' },
 *   { value: '3', label: 'Three' },
 * ]
 * const filteredData = useDataSearch(data)
 * ```
 */
const useDataSearch = <Item extends SelectItem>(
  data: Item[] | ((search?: string) => Promise<Item[]>),
  name: string = '',
  delay: number = 500,
): Item[] => {
  const { setFilteredData, setTyping, setDelay, instances } = useSearchSelect()

  const instanceData = useMemo(
    () => instances[name] ?? { data: undefined, isTyping: false, inDelay: false },
    [instances, name],
  )

  const { data: searchData, isTyping, inDelay } = instanceData

  const memoizedSetFilteredData = useCallback((items: Item[]) => setFilteredData(name, items), [setFilteredData, name])

  const memoizedSetTyping = useCallback((typing: boolean) => setTyping(name, typing), [setTyping, name])

  const memoizedSetDelay = useCallback((delayState: boolean) => setDelay(name, delayState), [setDelay, name])

  const isDataFunction = useMemo(() => typeof data === 'function', [data])

  const fetchData = useCallback(
    async (search: string) => {
      if (searchData?.filteredData && searchData?.filteredData.length) {
        const result = searchData.filteredData.filter((item) => item.label.toLowerCase().includes(search.toLowerCase()))
        if (result.length && search !== '') {
          memoizedSetFilteredData(result as Item[])
          return
        }
      }

      memoizedSetFilteredData([])

      if (isDataFunction) {
        const dataFunction = data as (search?: string) => Promise<Item[]>
        try {
          const result = await dataFunction(search)
          if (Array.isArray(result)) {
            const filteredResult = result.filter((item) => item.label.toLowerCase().includes(search.toLowerCase()))
            memoizedSetFilteredData(filteredResult)
          }
        } catch (error) {
          console.error('Error fetching data:', error)
          memoizedSetFilteredData([])
        }
      } else if (Array.isArray(data)) {
        const result = data.filter((item) => item.label.toLowerCase().includes(search.toLowerCase()))
        memoizedSetFilteredData(result)
      }
    },
    [data, searchData?.filteredData, memoizedSetFilteredData, isDataFunction],
  )

  useEffect(() => {
    let search = ''
    if (searchData && searchData.name === name) {
      search = searchData.search
    }

    if (isTyping) {
      if (!inDelay) {
        memoizedSetDelay(true)
        const timeoutId = setTimeout(() => {
          memoizedSetTyping(false)
          memoizedSetDelay(false)
        }, delay)

        return () => clearTimeout(timeoutId)
      }
      return
    }

    fetchData(search)
  }, [isTyping, inDelay, searchData, name, delay, fetchData, memoizedSetDelay, memoizedSetTyping])

  return useMemo(() => (searchData?.filteredData as Item[]) ?? [], [searchData?.filteredData])
}

export { useDataSearch }
