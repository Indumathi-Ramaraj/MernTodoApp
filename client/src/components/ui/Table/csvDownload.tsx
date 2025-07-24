import { CSVLink } from "react-csv";
import { FileDown } from "lucide-react";
import { Todo } from "../../../type/todo";
import dayjs from "dayjs";

export const csvDownload = (selectedData: Todo) => {
  const headers = [
    { label: "Title", key: "title" },
    { label: "Description", key: "description" },
    { label: "Due Date", key: "dueDate" },
    { label: "Due Time", key: "dueTime" },
    { label: "Done", key: "done" },
  ];

  const filteredData = selectedData.map((item) => ({
    title: item.title,
    description: item.description,
    dueDate: item.dueDate ? dayjs(item.dueDate).format("DD/MM/YYYY") : "",
    dueTime: item.dueTime,
    done: item.done,
  }));
  return (
    <CSVLink data={filteredData} headers={headers} filename="Todo List">
      <FileDown className="w-6 h-6 text-blue-500" />
    </CSVLink>
  );
};
