import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  columnFilteringFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_equalsString,
  filterFn_includesString,
  filterFn_includesStringSensitive,
  globalFilteringFeature,
  metaHelper,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_text,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import { compareItems, rankItem } from "@tanstack/match-sorter-utils";

import { makeData } from "#/data/demo-table-data";

import type {
  Column,
  ColumnFiltersState,
  FilterFn,
  SortFn,
  TableFeatures,
} from "@tanstack/react-table";
import type { RankingInfo } from "@tanstack/match-sorter-utils";

import type { Person } from "#/data/demo-table-data";

export const Route = createFileRoute("/demo/table")({
  component: TableDemo,
});

interface FuzzyFilterMeta {
  itemRank: RankingInfo;
}

// Define a custom fuzzy filter function that will apply ranking info to rows (using match-sorter utils)
const fuzzyFilter: FilterFn<TableFeatures, Person> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta?.({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

const features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  filterFns: {
    equalsString: filterFn_equalsString,
    fuzzy: fuzzyFilter,
    includesString: filterFn_includesString,
    includesStringSensitive: filterFn_includesStringSensitive,
  },
  filterMeta: metaHelper<FuzzyFilterMeta>(),
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    text: sortFn_text,
  },
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
});

// Define a custom fuzzy sort function that will sort by rank if the row has ranking information
const fuzzySort: SortFn<typeof features, Person> = (rowA, rowB, columnId) => {
  let dir = 0;
  const itemRankA = rowA.columnFiltersMeta[columnId]?.itemRank;
  const itemRankB = rowB.columnFiltersMeta[columnId]?.itemRank;

  // Only sort by rank if the column has ranking information
  if (itemRankA && itemRankB) {
    dir = compareItems(itemRankA, itemRankB);
  }

  // Provide an alphanumeric fallback for when the item ranks are equal
  return dir === 0 ? sortFn_alphanumeric(rowA, rowB, columnId) : dir;
};

const columnHelper = createColumnHelper<typeof features, Person>();
const columns = columnHelper.columns([
  columnHelper.accessor("id", {
    filterFn: "equalsString", //note: normal non-fuzzy filter column - exact match required
  }),
  columnHelper.accessor("firstName", {
    cell: (info) => info.getValue(),
    filterFn: "includesStringSensitive", //note: normal non-fuzzy filter column - case sensitive
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: "lastName",
    cell: (info) => info.getValue(),
    header: () => <span>Last Name</span>,
    filterFn: "includesString", //note: normal non-fuzzy filter column - case insensitive
  }),
  columnHelper.accessor((row) => `${row.firstName} ${row.lastName}`, {
    id: "fullName",
    header: "Full Name",
    cell: (info) => info.getValue(),
    filterFn: "fuzzy", //using our custom fuzzy filter function
    // filterFn: fuzzyFilter, //or just define with the function
    sortFn: fuzzySort, //sort by fuzzy rank (falls back to alphanumeric)
  }),
]);

function TableDemo() {
  const rerender = React.useReducer(() => ({}), {})[1];

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");

  const [data, setData] = React.useState<Person[]>(() => makeData(5_000));
  const refreshData = () => setData((_old) => makeData(50_000)); //stress test

  const table = useTable({
    features,
    data,
    columns,
    state: {
      columnFilters,
      globalFilter,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "fuzzy", //apply fuzzy filter to the global filter (most common use case for fuzzy filter)
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  });
  const { pagination, sorting } = table.state;
  const firstFilteredColumnId = table.state.columnFilters[0]?.id;
  const firstSortedColumnId = sorting[0]?.id;

  //apply the fuzzy sort if the fullName column is being filtered
  React.useEffect(() => {
    if (firstFilteredColumnId === "fullName") {
      if (firstSortedColumnId !== "fullName") {
        table.setSorting([{ id: "fullName", desc: false }]);
      }
    }
  }, [firstFilteredColumnId, firstSortedColumnId, table]);

  return (
    <main className="demo-page demo-page-wide">
      <div>
        <p className="island-kicker mb-2">TanStack Table</p>
        <h1 className="demo-title mb-6">Table Demo</h1>
        <DebouncedInput
          value={globalFilter ?? ""}
          onChange={(value) => setGlobalFilter(String(value))}
          className="demo-input"
          placeholder="Search all columns..."
        />
      </div>
      <div className="h-4" />
      <div className="demo-table-shell">
        <table className="demo-table text-sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th key={header.id} colSpan={header.colSpan} className="px-4 py-3 text-left">
                      {header.isPlaceholder ? null : (
                        <>
                          <div
                            {...{
                              className: header.column.getCanSort()
                                ? "cursor-pointer select-none transition-colors hover:text-[var(--lagoon-deep)]"
                                : "",
                              onClick: header.column.getToggleSortingHandler(),
                            }}
                          >
                            <table.FlexRender header={header} />
                            {{
                              asc: " 🔼",
                              desc: " 🔽",
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                          {header.column.getCanFilter() ? (
                            <div className="mt-2">
                              <Filter column={header.column} />
                            </div>
                          ) : null}
                        </>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => {
              return (
                <tr key={row.id} className="transition-colors">
                  {row.getAllCells().map((cell) => {
                    return (
                      <td key={cell.id} className="px-4 py-3">
                        <table.FlexRender cell={cell} />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="h-4" />
      <div className="demo-muted flex flex-wrap items-center gap-2">
        <button
          className="demo-button demo-button-secondary"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </button>
        <button
          className="demo-button demo-button-secondary"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </button>
        <button
          className="demo-button demo-button-secondary"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </button>
        <button
          className="demo-button demo-button-secondary"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {pagination.pageIndex + 1} of {table.getPageCount()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            defaultValue={pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="demo-input demo-input-fit py-1"
          />
        </span>
        <select
          value={pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
          className="demo-select demo-input-fit py-1"
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
      <div className="demo-muted mt-4">{table.getPrePaginatedRowModel().rows.length} Rows</div>
      <div className="mt-4 flex gap-2">
        <button onClick={() => rerender()} className="demo-button">
          Force Rerender
        </button>
        <button onClick={() => refreshData()} className="demo-button">
          Refresh Data
        </button>
      </div>
      <pre className="demo-code-block mt-4 overflow-auto">
        {JSON.stringify(
          {
            columnFilters: table.state.columnFilters,
            globalFilter: table.state.globalFilter,
          },
          null,
          2,
        )}
      </pre>
    </main>
  );
}

function Filter({ column }: { column: Column<typeof features, Person> }) {
  const columnFilterValue = column.getFilterValue();

  return (
    <DebouncedInput
      type="text"
      value={(columnFilterValue ?? "") as string}
      onChange={(value) => column.setFilterValue(value)}
      placeholder={`Search...`}
      className="demo-input py-1"
    />
  );
}

// A typical debounced input react component
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return <input {...props} value={value} onChange={(e) => setValue(e.target.value)} />;
}
