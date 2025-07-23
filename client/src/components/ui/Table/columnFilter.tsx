import { Input } from "../Input";

const ColumnFilter = ({ column }: { column: any }) => {
  const columnFilterValue = column.getFilterValue();

  return (
    <Input
      value={columnFilterValue ?? ""}
      onChange={(e) => column.setFilterValue(e.target.value)}
      className="w-full text-sm h-8 text-center"
      placeholder={`Filter ${column.id}...`}
    />
  );
};

export default ColumnFilter;
