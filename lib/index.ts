import "./index.css"
import SearchSelect from "./components/SearchSelect"
import Select, { SelectItem } from "./components/SearchSelectPrimitive"
import { useSearchSelect } from "./hooks"
import { useEffect, useState } from "react";

const useDataSearch = (data: SelectItem[] | ((search?: string) => Promise<SelectItem[]>), delay: number = 500): SelectItem[] => {
  const { search, isTyping, setTyping, inDelay, setDelay } = useSearchSelect((state) => state);
  const [filteredData, setFilteredData] = useState<SelectItem[]>([]);

  useEffect(() => {
    if (isTyping) {
      setFilteredData([]);
      if (!inDelay) {
        setDelay(true);
        setTimeout(() => {
          setTyping(false)
          setDelay(false)
        }, delay)
      }
      return
    }
    const fetchData = async () => {
      if (typeof data === "function") {
        const result = await data(search);
        if (Array.isArray(result)) {
          setFilteredData(result.filter((item) => 
            item.label.toLowerCase().includes(search.toLowerCase())
          ));
        }
      } else if (Array.isArray(data)) {
        const result = data.filter((item) => 
          item.label.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredData(result);
      }
    };

    fetchData();
  }, [isTyping]);

  return filteredData;
};

export { SearchSelect, Select, useDataSearch }