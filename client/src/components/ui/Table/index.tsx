// components/TodoTable.tsx
import { forwardRef, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Button } from "../Button";
import GlobalFilter from "./globalFilter";
import ColumnFilter from "./columnFilter";
import { filterFns } from "@tanstack/react-table";
import { csvDownload } from "./csvDownload";
import {
  ColumnFiltersState,
  SortingState,
  TodoTableProps,
} from "../../../type/table";

const Table = forwardRef<HTMLDivElement, TodoTableProps>(
  ({ data, columns, setNewModalOpen }, ref) => {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState<string>("");
    const [sorting, setSorting] = useState<SortingState>([]);
    const table = useReactTable({
      data,
      columns,
      initialState: {
        columnFilters: [
          {
            id: "",
            value: "",
          },
        ],
      },
      state: {
        globalFilter,
        sorting,
        columnFilters,
      },
      filterFns: {
        includesString: filterFns.includesString,
      },
      onColumnFiltersChange: setColumnFilters,
      onGlobalFilterChange: setGlobalFilter,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      onSortingChange: setSorting,
      globalFilterFn: filterFns.includesString,
      enableRowSelection: true,
    });
    const rows = table.getRowModel().rows;
    const selectedRows = table.getSelectedRowModel().rows;
    const pageSize = table.getState().pagination.pageSize;
    const currentPage = table.getState().pagination.pageIndex;
    const totalRows = table.getFilteredRowModel().rows.length;
    const setPageSize = table.setPageSize;
    const pageRowCount = () => {
      const start = currentPage * pageSize + 1;
      const end = Math.min(start + pageSize - 1, totalRows);
      return { start, end, total: totalRows };
    };

    const { start, end, total } = pageRowCount();

    return (
      <div ref={ref} className="py-4 px-10 space-y-4 my-5 shadow-lg rounded-lg">
        <div className="flex justify-between">
          <div className="flex gap-x-4 items-center">
            <GlobalFilter
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
            />
            {csvDownload(
              selectedRows.length > 0
                ? selectedRows.map((row) => row.original)
                : table.options.data
            )}
            <div className="flex gap-x-1">
              <p className="text-sm pt-0.5">Show : </p>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className=" text-gray-600 rounded-md border border-gray-300 outline-none bg-white h-7 px-2"
              >
                {[10, 20, 30, 40, 50, rows.length].map((size) => (
                  <option key={size} value={size}>
                    {size === rows.length ? rows.length : size}
                  </option>
                ))}
              </select>
            </div>

            <div className="ml-2 text-sm flex gap-x-1">
              <p>Showing</p>
              <p>
                {start} - {end}
              </p>
              <p>of {total}</p>
            </div>
          </div>
          <button
            onClick={() => setNewModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-1 h-8 my-auto rounded-lg"
          >
            + Add Task
          </button>
        </div>

        <div className="overflow-auto">
          <table className="min-w-full border rounded">
            <thead className="bg-gray-100">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-2 text-center border-r-2 last:border-r-2"
                    >
                      {header.isPlaceholder ? null : (
                        <div className="flex flex-col items-center gap-1">
                          <div
                            className={`cursor-pointer flex items-center gap-1 text-[16px] ${
                              header.column.getCanSort() ? "" : "cursor-default"
                            }`}
                            onClick={
                              header.column.getCanSort()
                                ? header.column.getToggleSortingHandler()
                                : undefined
                            }
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {header.column.getCanSort() && (
                              <>
                                {header.column.getIsSorted() === "asc" && (
                                  <span>⬆️</span>
                                )}
                                {header.column.getIsSorted() === "desc" && (
                                  <span>⬇️</span>
                                )}
                                {!header.column.getIsSorted() && (
                                  <span className="text-blue-500"> &harr;</span>
                                )}
                              </>
                            )}
                          </div>

                          {header.column.getCanFilter() && (
                            <div className="w-full">
                              <ColumnFilter column={header.column} />
                            </div>
                          )}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={table.getAllColumns().length}
                    className="text-center py-4 text-gray-500"
                  >
                    No data available
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border-t">
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-4 py-2 text-center border-r-2 last:border-r-2"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-between gap-2">
          <div>
            <Button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="bg-blue-500 px-3 py-1 border rounded disabled:opacity-50"
            >
              {"<<"}
            </Button>

            <Button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="bg-blue-500 px-3 py-1 border rounded disabled:opacity-50 ml-2"
            >
              {"<"}
            </Button>

            <span className="px-2">
              Page <strong>{table.getState().pagination.pageIndex + 1}</strong>{" "}
              of <strong>{table.getPageCount()}</strong>
            </span>

            <Button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="bg-blue-500 px-3 py-1 border rounded disabled:opacity-50 mr-2"
            >
              {">"}
            </Button>

            <Button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="bg-blue-500 px-3 py-1 border rounded disabled:opacity-50"
            >
              {">>"}
            </Button>
          </div>
          <span className="bg-blue-500 text-white shadow-md w-8 h-8 px-2 py-0.5 border rounded text-center">
            {table.getState().pagination.pageIndex + 1}
          </span>
        </div>
      </div>
    );
  }
);

export default Table;
