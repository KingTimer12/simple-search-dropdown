import './index.css'
import SearchSelect from './components/SearchSelect'
import Select, { SelectItem } from './components/SearchSelectPrimitive'
import { useSearchSelect } from './hooks'
import { useEffect, useState } from 'react'

const useDataSearch = (
  data: SelectItem[] | ((search?: string) => Promise<SelectItem[]>),
  name: string = '',
  delay: number = 500,
): SelectItem[] => {
  const { data: searchData, isTyping, setTyping, inDelay, setDelay } = useSearchSelect((state) => state)
  const [filteredData, setFilteredData] = useState<SelectItem[]>([])

  useEffect(() => {
    let search = ''
    if (searchData && searchData.name === name) search = searchData.search
    if (isTyping) {
      setFilteredData([])
      if (!inDelay) {
        setDelay(true)
        setTimeout(() => {
          setTyping(false)
          setDelay(false)
        }, delay)
      }
      return
    }

    const fetchData = async () => {
      if (typeof data === 'function') {
        const result = await data(search)
        if (Array.isArray(result)) {
          setFilteredData(result.filter((item) => item.label.toLowerCase().includes(search.toLowerCase())))
        }
      } else if (Array.isArray(data)) {
        const result = data.filter((item) => item.label.toLowerCase().includes(search.toLowerCase()))
        setFilteredData(result)
      }
    }

    fetchData()
  }, [isTyping])

  return filteredData
}

export { SearchSelect, Select, useDataSearch }
