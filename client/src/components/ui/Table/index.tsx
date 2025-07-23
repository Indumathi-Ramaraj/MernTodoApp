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

export interface RefObject {
  setGlobalFilter: Function;
  globalFilter: string;
}

interface TodoTableProps {
  data: any[];
  columns: any[];
}

interface ColumnFilter {
  id: string;
  value: unknown;
}

interface GlobalFilter {
  globalFilter: any;
}
type ColumnFiltersState = ColumnFilter[];

type ColumnSort = {
  id: string;
  desc: boolean;
};
type SortingState = ColumnSort[];

const Table = forwardRef<HTMLDivElement, TodoTableProps>(
  ({ data, columns }, ref) => {
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
    });

    return (
      <div ref={ref} className="p-4 space-y-4">
        <div className="flex gap-x-4 items-center">
          <GlobalFilter
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
          {csvDownload(table.options.data)}
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
