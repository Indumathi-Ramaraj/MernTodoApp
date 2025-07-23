import { CheckCircle, Trash2 } from "lucide-react";

export const todoColumns = (
  toggleDone: (id: number, title: string, done: boolean) => void,
  toggleDelete: (id: number, title: string) => void
) => {
  return [
    {
      header: "Title",
      accessorKey: "title",
      filterFn: "includesString",
      enableColumnFilter: true,
      sortingFn: "alphanumeric",
    },
    {
      header: "Description",
      accessorKey: "description",
      filterFn: "includesString",
      enableColumnFilter: true,
      enableGlobalFilter: true,
      sortingFn: "alphanumeric",
    },
    {
      header: "Due Date",
      accessorKey: "date",
      enableColumnFilter: true,
      enableGlobalFilter: true,
      sortingFn: "datetime",
    },
    {
      header: "Due Time",
      accessorKey: "time",
      enableColumnFilter: true,
      enableGlobalFilter: true,
      sortingFn: "datetime",
    },
    {
      header: "Actions",
      enableSorting: false,
      enableColumnFilter: false,
      cell: ({ row }: any) => (
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => {
              if (row.original._id)
                toggleDone(
                  row.original._id,
                  row.original.title,
                  !row.original.done
                );
            }}
          >
            <CheckCircle
              className={`w-5 h-5 mr-2 ${
                row.original.done ? "text-green-500" : "text-gray-400"
              }`}
            />
          </button>
          <button
            onClick={() => {
              if (row.original._id)
                toggleDelete(row.original._id, row.original.title);
            }}
          >
            <Trash2 className="w-5 h-5 text-red-500" />
          </button>
        </div>
      ),
    },
  ];
};
