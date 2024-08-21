import React, { ForwardRefExoticComponent, RefAttributes, useRef, useState } from "react";
import { RemoveScroll } from "react-remove-scroll";

type SelectSearchProps = React.InputHTMLAttributes<HTMLInputElement>
type SelectButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>
type SelectProps = React.HTMLAttributes<HTMLDivElement>

export interface SelectItem {
  label: string,
  value: string,
}

interface SelectContextProps {
  isOpen: boolean;
  isTyping: boolean;
  selected: SelectItem;
  name?: string;
  search?: string;
  ref?: React.ForwardedRef<HTMLInputElement>;
  toggleOpen: () => void;
  setSelected: (item: SelectItem) => void;
  setSearch: (text: string) => void;
  setTyping: (value: boolean) => void;
  useClickOutside: (ref: React.RefObject<HTMLElement>) => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

const SelectContext = React.createContext<SelectContextProps>({
  isOpen: false,
  isTyping: false,
  selected: { label: "", value: "" },
  toggleOpen: () => { },
  useClickOutside: () => { },
  setSelected: () => { },
  setTyping: () => { },
  setSearch: () => { },
});

interface SelectTriggerProps extends SelectProps {
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  name?: string;
}

type SelectExtendedProps = SelectTriggerProps

interface SelectComponent
  extends ForwardRefExoticComponent<SelectProps & RefAttributes<HTMLDivElement>> {
  Trigger: typeof SelectTrigger;
  Item: typeof SelectItem;
  Panel: typeof SelectPanel;
  Button: typeof SelectButton;
  Search: typeof SelectSearch;
}

const Select = React.forwardRef<HTMLInputElement, SelectExtendedProps>(({ children, onChange, onBlur, name, ...props }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [selected, setSelected] = useState<SelectItem>({ label: "", value: "" });
  const [search, setSearch] = useState("");

  const useClickOutside = (ref: React.RefObject<HTMLElement>) => {
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <SelectContext.Provider value=
      {{
        search,
        isOpen,
        isTyping,
        selected,
        toggleOpen,
        useClickOutside,
        setSelected,
        setTyping: setIsTyping,
        setSearch,
        onChange,
        onBlur,
        name,
        ref
      }}>
      <div {...props}>
        {children}
      </div>
    </SelectContext.Provider>
  )
}) as SelectComponent

const SelectTrigger = ({ children, ...props }: SelectProps) => {
  const { name, selected, onChange, onBlur, ref } = React.useContext(SelectContext);

  return (
    <div {...props}>
      {children}
      <input
        id={name}
        type="text"
        value={selected.value}
        className="hidden"
        onChange={onChange}
        onBlur={onBlur}
        name={name}
        ref={ref}
      />
    </div>
  )
}

const SelectPanel = ({ children, ...props }: SelectProps) => {
  const { isOpen, useClickOutside } = React.useContext(SelectContext);
  const areaRef = useRef(null);

  useClickOutside(areaRef);

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

interface SelectItemProps extends SelectProps { value: string; label: string; }
const SelectItem = ({ children, onClick, value, label, ...props }: SelectItemProps) => {
  const { setSelected, isOpen, toggleOpen, onChange, name } = React.useContext(SelectContext);
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onClick)
      onClick(e)
    setSelected({ value, label })
    if (isOpen) toggleOpen() // close dropdown
    if (onChange) onChange({ target: { name, value } } as React.ChangeEvent<HTMLInputElement>)
  }
  
  return (
    <div {...props} onClick={handleClick}>
      {children}
    </div>
  )
}

const SelectButton = ({ children, onClick, ...props }: SelectButtonProps) => {
  const { toggleOpen } = React.useContext(SelectContext);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    toggleOpen();
    if (onClick)
      onClick(e)
  }

  return (
    <button {...props} onClick={handleClick}>
      {children}
    </button>
  )
}

const SelectSearch = ({ onChange, onFocus, ...htmlProps }: SelectSearchProps) => {
  const { isOpen, toggleOpen, selected, useClickOutside, setSearch, setTyping } = React.useContext(SelectContext);
  const searchRef = useRef(null);

  useClickOutside(searchRef);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value.toLowerCase())
    setTyping(true)
    if (onChange)
      onChange(e)
  }

  const handleClick = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!isOpen)
      toggleOpen();
    if (onFocus)
      onFocus(e)
  }

  return <input ref={searchRef} onChange={handleChange} onFocus={handleClick} type="text" value={selected.label} {...htmlProps} />
}

Select.Trigger = SelectTrigger
Select.Item = SelectItem
Select.Panel = SelectPanel
Select.Button = SelectButton
Select.Search = SelectSearch

export default Select
