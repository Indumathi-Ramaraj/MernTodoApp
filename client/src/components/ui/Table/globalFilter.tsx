import { useEffect, useState } from "react";
import { Input } from "../Input";

type Props = {
  globalFilter: string;
  setGlobalFilter: Function;
};

const GlobalFilter = ({ globalFilter, setGlobalFilter }: Props) => {
  const [value, setValue] = useState(globalFilter);

  useEffect(() => {
    const delay = setTimeout(() => {
      setGlobalFilter(value || "");
    }, 300);

    return () => clearTimeout(delay);
  }, [value, setGlobalFilter]);

  return (
    <div className="flex gap-2 items-center py-2">
      <p className="text-base">Search:</p>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search..."
        className="py-1"
      />
    </div>
  );
};
export default GlobalFilter;
