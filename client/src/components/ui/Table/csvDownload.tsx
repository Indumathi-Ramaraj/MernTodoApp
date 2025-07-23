import { CSVLink } from "react-csv";
import { FileDown } from "lucide-react";


export const csvDownload = (selectedData: Array<object>) => {
  return (
    <CSVLink data={selectedData} filename="Todo List">
      <FileDown className="w-6 h-6 text-blue-500" />
    </CSVLink>
  );
};
