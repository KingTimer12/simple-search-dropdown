import { useEffect } from 'react'
import { SelectItem } from '../components'
import { useSearchSelect } from '../store'

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
  const { setFilteredData, setTyping, setDelay, instances } = useSearchSelect((state) => state)
  const {
    data: searchData,
    isTyping,
    inDelay,
  } = instances[name] ?? { data: undefined, isTyping: false, inDelay: false }

  useEffect(() => {
    let search = ''
    if (searchData && searchData.name === name) search = searchData.search
    if (isTyping) {
      if (!inDelay) {
        setDelay(name, true)
        setTimeout(() => {
          setTyping(name, false)
          setDelay(name, false)
        }, delay)
      }
      return
    }

    const fetchData = async () => {
      if (searchData?.filteredData && searchData?.filteredData.length) {
        const result = searchData.filteredData.filter((item) => item.label.toLowerCase().includes(search.toLowerCase()))
        if (result.length) return setFilteredData(name, result)
      }
      setFilteredData<Item>(name, [])
      if (typeof data === 'function') {
        const result = await data(search)
        if (Array.isArray(result)) {
          setFilteredData<Item>(
            name,
            result.filter((item) => item.label.toLowerCase().includes(search.toLowerCase())),
          )
        }
      } else if (Array.isArray(data)) {
        const result = data.filter((item) => item.label.toLowerCase().includes(search.toLowerCase()))
        setFilteredData<Item>(name, result)
      }
    }

    fetchData()
  }, [isTyping])

  return (searchData?.filteredData as Item[]) ?? []
}

export { useDataSearch }
