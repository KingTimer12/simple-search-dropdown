import "./index.css"
import SearchSelect from "./components/SearchSelect"
import Select, { SelectItem } from "./components/SearchSelectPrimitive"
import { useSearchSelect } from "./hooks"
import { useEffect, useState } from "react";

const useDataSearch = (data: SelectItem[] | ((search?: string) => Promise<SelectItem[]>)): SelectItem[] => {
  const { search, isTyping, setTyping } = useSearchSelect((state) => state);
  const [filteredData, setFilteredData] = useState<SelectItem[]>([]);

  useEffect(() => {
    if (isTyping) {
      setTyping(false);
      return
    }
    const fetchData = async () => {
      if (typeof data === "function") {
        const result = await data(search);
        if (Array.isArray(result)) {
          setFilteredData(result);
        }
      } else if (Array.isArray(data)) {
        const result = data.filter((item) => 
          item.label.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredData(result);
      }
    };

    fetchData();
  }, [data, search, isTyping, setTyping]);

  return filteredData;
};

export { SearchSelect, Select, useDataSearch }