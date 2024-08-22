import './index.css'
import SearchSelect from './components/SearchSelect'
import Select, { SelectItem } from './components/SearchSelectPrimitive'
import { useSearchSelect } from './hooks'
import { useEffect } from 'react'

const useDataSearch = (
  data: SelectItem[] | ((search?: string) => Promise<SelectItem[]>),
  name: string = '',
  delay: number = 500,
): SelectItem[] => {
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
      setFilteredData(name, [])
      if (typeof data === 'function') {
        const result = await data(search)
        if (Array.isArray(result)) {
          setFilteredData(
            name,
            result.filter((item) => item.label.toLowerCase().includes(search.toLowerCase())),
          )
        }
      } else if (Array.isArray(data)) {
        const result = data.filter((item) => item.label.toLowerCase().includes(search.toLowerCase()))
        setFilteredData(name, result)
      }
    }

    fetchData()
  }, [isTyping])

  return searchData?.filteredData ?? []
}

export { SearchSelect, Select, useDataSearch }
