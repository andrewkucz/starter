import {
  type ColumnFiltersState,
  cellSelectionFeature,
  columnFilteringFeature,
  createColumnHelper,
  createFilteredRowModel,
  createSortedRowModel,
  filterFn_equals,
  filterFn_includesString,
  FlexRender,
  type OnChangeFn,
  type Row,
  type RowData,
  rowSelectionFeature,
  rowSortingFeature,
  type SortingState,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import {
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  memo,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const dataGridFeatures = tableFeatures({
  cellSelectionFeature,
  columnFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  // `equals` is what the default `auto` filterFn resolves to for boolean columns.
  filterFns: { equals: filterFn_equals, includesString: filterFn_includesString },
  rowSelectionFeature,
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
});

type EditableValue = boolean | string;

type EditDestination = "cell" | "outside" | "up" | "down" | "left" | "right";

const arrowDirections = new Map<string, "up" | "down" | "left" | "right">([
  ["ArrowUp", "up"],
  ["ArrowDown", "down"],
  ["ArrowLeft", "left"],
  ["ArrowRight", "right"],
]);

// Sticky cells need an opaque background, so the translucent row hover/selected tints are
// recomposited over the card colour. Rows with custom tints can target `[data-sticky]` cells.
const stickyEndClassName =
  "sticky right-0 z-[1] bg-card [tr:hover>&]:bg-[color-mix(in_oklab,var(--color-muted)_50%,var(--color-card))] [tr[data-state=selected]>&]:bg-muted";

export type DataGridColumn<TData extends RowData> = {
  key: Extract<keyof TData, string>;
  title: string;
  width?: number;
  searchable?: boolean;
  sortable?: boolean;
  filterable?: boolean;
  align?: "start" | "center" | "end";
  /** Pins the column to the table's right edge when the columns overflow horizontally. */
  sticky?: "end";
  readOnly?: boolean | ((row: TData) => boolean);
  editor?: "text" | "checkbox";
  options?: readonly string[];
  render?: (value: TData[Extract<keyof TData, string>], row: TData) => ReactNode;
  onValueChange?: (row: TData, value: EditableValue) => boolean | undefined;
};

export type DataGridProps<TData extends RowData> = {
  columns: readonly DataGridColumn<TData>[];
  data: readonly TData[];
  getRowId: (row: TData) => string;
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  columnFilters?: ColumnFiltersState;
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>;
  selectionMode?: "cell" | "none" | "row";
  showColumnFilters?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: TData) => void;
  getRowClassName?: (row: TData) => string | undefined;
  getRowAriaLabel?: (row: TData) => string;
  /**
   * Keeps matching rows above the rest, in their sorted order, whatever the sorting. Display-only:
   * cell keyboard navigation follows the table's own order, so use it with read-only grids.
   */
  isRowPinned?: (row: TData) => boolean;
  onRowContextMenu?: (row: TData, event: ReactMouseEvent<HTMLTableRowElement>) => void;
  /** Reports the rows in display order (after sorting and filtering) whenever they change. */
  onVisibleRowsChange?: (rows: TData[]) => void;
  className?: string;
};

/** Column filters set from the filter inputs are text; other values show an empty input. */
const filterValueSchema = z.union([z.string(), z.number().transform(String)]).catch("");

const EMPTY_SORTING: SortingState = [];
const EMPTY_FILTERS: ColumnFiltersState = [];

function DataGridInner<TData extends RowData>({
  columns,
  data,
  getRowId,
  sorting = EMPTY_SORTING,
  onSortingChange,
  columnFilters = EMPTY_FILTERS,
  onColumnFiltersChange,
  selectionMode = "row",
  showColumnFilters = true,
  emptyMessage = "No results.",
  onRowClick,
  getRowAriaLabel,
  getRowClassName,
  isRowPinned,
  onRowContextMenu,
  onVisibleRowsChange,
  className,
}: DataGridProps<TData>) {
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [initialDraft, setInitialDraft] = useState<string>();
  const cellElements = useRef(new Map<string, HTMLTableCellElement>());
  const editOnClick = useRef<string | null>(null);

  const enableCellSelection =
    selectionMode === "cell" || columns.some((column) => column.onValueChange);

  const columnHelper = useMemo(() => createColumnHelper<typeof dataGridFeatures, TData>(), []);
  const stableData = useMemo(() => [...data], [data]);

  const tableColumns = useMemo(
    () =>
      columnHelper.columns([
        ...(selectionMode === "row"
          ? [
              columnHelper.display({
                id: "select",
                header: ({ table }) => {
                  const allSelected = table.getIsAllRowsSelected();
                  const someSelected = table.getIsSomeRowsSelected();

                  return (
                    <Checkbox
                      aria-label="Select all rows"
                      checked={allSelected || (someSelected && !allSelected && "indeterminate")}
                      onCheckedChange={(checked) => table.toggleAllRowsSelected(Boolean(checked))}
                    />
                  );
                },
                cell: ({ row }) => (
                  <Checkbox
                    aria-label={`Select row ${row.getDisplayIndex() + 1}`}
                    checked={row.getIsSelected()}
                    onCheckedChange={(checked) => row.toggleSelected(Boolean(checked))}
                  />
                ),
              }),
            ]
          : []),
        ...columns.map((column) =>
          columnHelper.accessor((row) => row[column.key], {
            id: column.key,
            header: column.title,
            enableSorting: column.sortable !== false,
            enableColumnFilter: column.filterable !== false,
          }),
        ),
      ]),
    [columnHelper, columns, selectionMode],
  );

  const table = useTable({
    features: dataGridFeatures,
    columns: tableColumns,
    data: stableData,
    getRowId,
    enableCellSelection,
    // Stable row IDs keep the active cell anchored through optimistic edits and refetches.
    autoResetCellSelection: false,
    enableRowSelection: selectionMode === "row",
    state: { sorting, columnFilters },
    onSortingChange,
    onColumnFiltersChange,
  });

  const columnConfig = useMemo(
    () => new Map<string, DataGridColumn<TData>>(columns.map((column) => [column.key, column])),
    [columns],
  );

  const modelRows = table.getRowModel().rows;

  const visibleRows = useMemo(
    () =>
      isRowPinned
        ? [
            ...modelRows.filter((row) => isRowPinned(row.original)),
            ...modelRows.filter((row) => !isRowPinned(row.original)),
          ]
        : modelRows,
    [isRowPinned, modelRows],
  );

  useEffect(() => {
    onVisibleRowsChange?.(visibleRows.map((row) => row.original));
  }, [onVisibleRowsChange, visibleRows]);

  const hasMultipleSelectedCells = enableCellSelection && table.getSelectedCellCount() > 1;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-md border bg-card",
        // Leave room for editing outlines at the scroll container's edges.
        // TODO revisit this
        // enableCellSelection && "[&>[data-slot=table-container]]:p-0.5",
        className,
      )}
    >
      <Table
        className={cn(
          "table-fixed",
          selectionMode === "cell" && "select-none",
          // Bottom borders form continuous dividers without transparent border corners.
          enableCellSelection && "border-separate border-spacing-0 [&_thead_th]:border-b",
        )}
      >
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const config = columnConfig.get(header.column.id);
                const sorted = header.column.getIsSorted();

                return (
                  <TableHead
                    key={header.id}
                    aria-sort={
                      sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : undefined
                    }
                    className={cn(
                      header.column.id === "select" && "w-12",
                      config?.align === "center" && "text-center",
                      config?.align === "end" && "text-right",
                      config?.sticky && stickyEndClassName,
                    )}
                    data-sticky={config?.sticky ? "" : undefined}
                    style={config?.width ? { width: config.width } : undefined}
                  >
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="-ms-2 h-8"
                        onClick={() => header.column.toggleSorting(sorted === "asc")}
                      >
                        {config?.title ?? header.column.id}
                        {sorted === "asc" ? (
                          <ArrowUp data-icon="inline-end" />
                        ) : sorted === "desc" ? (
                          <ArrowDown data-icon="inline-end" />
                        ) : (
                          <ChevronsUpDown data-icon="inline-end" />
                        )}
                      </Button>
                    ) : (
                      (config?.title ?? null)
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
          {showColumnFilters ? (
            <TableRow className="hover:bg-transparent">
              {table.getAllLeafColumns().map((column) => {
                const config = columnConfig.get(column.id);

                return (
                  <TableHead key={column.id} className="h-11">
                    {config?.filterable !== false && column.getCanFilter() ? (
                      <Input
                        aria-label={`Filter ${config?.title ?? column.id}`}
                        className="h-7"
                        placeholder="Filter..."
                        value={filterValueSchema.parse(column.getFilterValue())}
                        onChange={(event) => column.setFilterValue(event.target.value || undefined)}
                      />
                    ) : null}
                  </TableHead>
                );
              })}
            </TableRow>
          ) : null}
        </TableHeader>
        <TableBody>
          {visibleRows.length > 0 ? (
            visibleRows.map((row) => {
              const rowProps = {
                row,
                isSelected: selectionMode === "row" && row.getIsSelected(),
                ariaLabel: getRowAriaLabel?.(row.original),
                className: cn(
                  getRowClassName?.(row.original),
                  enableCellSelection && "hover:bg-transparent",
                ),
                onRowClick,
                onRowContextMenu,
              };

              if (!enableCellSelection) {
                // Every cell is read-only, so the row can skip re-rendering when sorting or
                // filtering only moves it.
                return <DataGridRow key={row.id} {...rowProps} columnConfig={columnConfig} />;
              }

              return (
                <DataGridRow key={row.id} {...rowProps}>
                  {row.getAllCells().map((cell, cellIndex) => {
                    const config = columnConfig.get(cell.column.id);

                    const isCellSelection = enableCellSelection;

                    const isEditable =
                      config !== undefined &&
                      config.editor !== "checkbox" &&
                      !isColumnReadOnly(config, row.original);

                    const isSelected = isCellSelection && cell.getIsSelected();
                    const isFocused = isCellSelection && cell.getIsFocused();

                    return (
                      <TableCell
                        key={cell.id}
                        ref={(element) => {
                          if (element) cellElements.current.set(cell.id, element);
                          else cellElements.current.delete(cell.id);
                        }}
                        data-focused={isFocused || undefined}
                        data-selected={isSelected || undefined}
                        data-editing={editingCell === cell.id || undefined}
                        data-sticky={config?.sticky ? "" : undefined}
                        className={cn(
                          config?.align === "center" && "text-center",
                          config?.align === "end" && "text-right",
                          config?.onValueChange && "p-0",
                          config?.sticky && stickyEndClassName,
                          isCellSelection && "relative cursor-cell border-b border-border",
                          // Cover the shared dividers instead of adding another border inside them.
                          (isFocused || editingCell === cell.id) &&
                            "after:pointer-events-none after:absolute after:inset-x-0 after:-top-px after:-bottom-px after:z-10 after:border-2 after:border-primary",
                          isSelected && hasMultipleSelectedCells && "bg-accent",
                          editingCell === cell.id &&
                            "z-10 after:outline-2 after:outline-offset-0 after:outline-primary/40",
                        )}
                        onFocus={() => {
                          if (isCellSelection && !isFocused) {
                            table.setFocusedCell(row.id, cell.column.id);
                          }
                        }}
                        onKeyDown={(event) => {
                          if (!isCellSelection || event.target !== event.currentTarget) {
                            return;
                          }

                          if (event.nativeEvent.isComposing) return;

                          if (
                            isEditable &&
                            Array.from(event.key).length === 1 &&
                            !event.metaKey &&
                            !event.ctrlKey &&
                            !event.altKey
                          ) {
                            event.preventDefault();
                            setInitialDraft(event.key);
                            setEditingCell(cell.id);

                            return;
                          }

                          if (isEditable && (event.key === "Enter" || event.key === "F2")) {
                            event.preventDefault();
                            setEditingCell(cell.id);

                            return;
                          }

                          if ((event.metaKey || event.ctrlKey) && event.key === "a") {
                            event.preventDefault();
                            table.selectAllCells();

                            return;
                          }

                          const direction = arrowDirections.get(event.key);

                          if (direction) {
                            event.preventDefault();

                            if (event.shiftKey) {
                              table.extendCellSelection(direction);
                            } else {
                              table.moveCellSelection(direction);
                              const focused = table.getFocusedCell();

                              if (focused) cellElements.current.get(focused.id)?.focus();
                            }
                          }
                        }}
                        onMouseDown={(event) => {
                          if (!isCellSelection || editingCell === cell.id || event.button !== 0)
                            return;
                          editOnClick.current =
                            document.activeElement === event.currentTarget ? cell.id : null;

                          if (
                            event.target instanceof Element &&
                            event.target.closest("a, button, input, select, textarea")
                          )
                            return;
                          cell.getSelectionStartHandler()(event);
                          event.currentTarget.focus();
                        }}
                        onClick={() => {
                          if (isEditable && editOnClick.current === cell.id) {
                            setEditingCell(cell.id);
                          }

                          editOnClick.current = null;
                        }}
                        onMouseEnter={
                          isCellSelection ? cell.getSelectionExtendHandler() : undefined
                        }
                        tabIndex={
                          isCellSelection
                            ? isFocused ||
                              (!table.getFocusedCell() &&
                                row.getDisplayIndex() === 0 &&
                                cellIndex === 0)
                              ? 0
                              : -1
                            : undefined
                        }
                      >
                        {config && isReadOnlyCell(config, row.original) ? (
                          // Read-only cells skip the editor's per-cell state and effects, which
                          // dominate render time on large read-only grids.
                          renderReadOnlyValue(config, row.original)
                        ) : config ? (
                          <DataGridValueCell
                            column={config}
                            row={row.original}
                            value={row.original[config.key]}
                            isEditing={editingCell === cell.id}
                            initialDraft={initialDraft}
                            onFinishEditing={(destination) => {
                              setEditingCell(null);
                              setInitialDraft(undefined);

                              if (destination === "outside") return;
                              const rows = table.getRowModel().rows;

                              const rowOffset =
                                destination === "down" ? 1 : destination === "up" ? -1 : 0;

                              const columnOffset =
                                destination === "right" ? 1 : destination === "left" ? -1 : 0;

                              const targetRow =
                                rows[rows.findIndex((item) => item.id === row.id) + rowOffset] ??
                                row;

                              const cells = targetRow.getAllCells();

                              const columnIndex = cells.findIndex(
                                (item) => item.column.id === cell.column.id,
                              );

                              const target = cells[columnIndex + columnOffset] ?? cell;
                              table.setFocusedCell(target.row.id, target.column.id);
                              cellElements.current.get(target.id)?.focus();
                            }}
                          />
                        ) : (
                          <table.FlexRender cell={cell} />
                        )}
                      </TableCell>
                    );
                  })}
                </DataGridRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length + (selectionMode === "row" ? 1 : 0)}
                className="h-24 text-center text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {selectionMode === "row" ? (
        <p className="border-t px-3 py-2 text-xs text-muted-foreground" role="status">
          {table.getSelectedRowModel().rows.length.toLocaleString()} of{" "}
          {table.getRowModel().rows.length.toLocaleString()} rows selected
        </p>
      ) : null}
    </div>
  );
}

/**
 * Memoized so parents can re-render (e.g. on every search keystroke) without re-rendering the
 * table; pass stable columns, data, and callbacks to benefit.
 */
// SAFETY: `memo` drops the generic signature but forwards props to `DataGridInner` unchanged.
export const DataGrid = memo(DataGridInner) as typeof DataGridInner;

type DataGridRowProps<TData extends RowData> = {
  row: Row<typeof dataGridFeatures, TData>;
  isSelected: boolean;
  ariaLabel?: string;
  className?: string;
  onRowClick?: (row: TData) => void;
  onRowContextMenu?: (row: TData, event: ReactMouseEvent<HTMLTableRowElement>) => void;
} & (
  | { columnConfig: ReadonlyMap<string, DataGridColumn<TData>>; children?: never }
  | { columnConfig?: never; children: ReactNode }
);

/**
 * Renders interactive cells passed as children, or, given `columnConfig`, its own read-only
 * cells. Only the latter benefits from memoization: those rows re-render only when their data,
 * columns, selection, or callbacks change.
 */
// SAFETY: `memo` drops the generic signature but forwards props to the inner component unchanged.
const DataGridRow = memo(function DataGridRow<TData extends RowData>({
  row,
  isSelected,
  ariaLabel,
  className,
  onRowClick,
  onRowContextMenu,
  columnConfig,
  children,
}: DataGridRowProps<TData>) {
  return (
    <TableRow
      data-row-id={row.id}
      data-state={isSelected ? "selected" : undefined}
      aria-label={ariaLabel}
      className={cn(
        className,
        // An outline rather than an inset ring: collapsed borders paint over a row's
        // box-shadow, so the neighbouring row's border would thin the ring's top edge.
        onRowClick &&
          "cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
      )}
      tabIndex={onRowClick ? 0 : undefined}
      onClick={() => onRowClick?.(row.original)}
      onKeyDown={(event) => {
        if (
          !onRowClick ||
          event.defaultPrevented ||
          event.target !== event.currentTarget ||
          event.key !== "Enter"
        ) {
          return;
        }

        event.preventDefault();
        onRowClick(row.original);
      }}
      onContextMenu={(event) => onRowContextMenu?.(row.original, event)}
    >
      {columnConfig
        ? row.getAllCells().map((cell) => {
            const config = columnConfig.get(cell.column.id);

            return (
              <TableCell
                key={cell.id}
                data-sticky={config?.sticky ? "" : undefined}
                className={cn(
                  config?.align === "center" && "text-center",
                  config?.align === "end" && "text-right",
                  config?.sticky && stickyEndClassName,
                )}
              >
                {config && isReadOnlyCell(config, row.original) ? (
                  renderReadOnlyValue(config, row.original)
                ) : config ? (
                  <DataGridValueCell
                    column={config}
                    row={row.original}
                    value={row.original[config.key]}
                    isEditing={false}
                    onFinishEditing={noop}
                  />
                ) : (
                  <FlexRender cell={cell} />
                )}
              </TableCell>
            );
          })
        : children}
    </TableRow>
  );
}) as <TData extends RowData>(props: DataGridRowProps<TData>) => ReactNode;

function noop() {}

function isColumnReadOnly<TData extends RowData>(column: DataGridColumn<TData>, row: TData) {
  const { readOnly } = column;

  return readOnly === true || (readOnly && readOnly(row)) || !column.onValueChange;
}

/** Checkbox columns still render a (disabled) checkbox when read-only. */
function isReadOnlyCell<TData extends RowData>(column: DataGridColumn<TData>, row: TData) {
  return column.editor !== "checkbox" && isColumnReadOnly(column, row);
}

function renderReadOnlyValue<TData extends RowData>(column: DataGridColumn<TData>, row: TData) {
  const value = row[column.key];

  return column.render
    ? column.render(value, row)
    : Number.isFinite(value)
      ? Number(value).toLocaleString()
      : String(value ?? "");
}

type DataGridValueCellProps<TData extends RowData> = {
  column: DataGridColumn<TData>;
  row: TData;
  value: TData[Extract<keyof TData, string>];
  isEditing: boolean;
  initialDraft?: string;
  onFinishEditing: (destination: EditDestination) => void;
};

function DataGridValueCell<TData extends RowData>({
  column,
  row,
  value,
  isEditing,
  initialDraft,
  onFinishEditing,
}: DataGridValueCellProps<TData>) {
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const finished = useRef(false);
  const [draft, setDraft] = useState(String(value ?? ""));
  const [committedDraft, setCommittedDraft] = useState<{ row: TData; text: string } | null>(null);
  // Bridge the interval between closing the editor and receiving the optimistic row.
  // Once row data arrives, it owns the display again, including normalization and rollback.
  const visibleDraft = committedDraft?.row === row ? committedDraft.text : undefined;

  if (committedDraft && committedDraft.row !== row) {
    setCommittedDraft(null);
  }

  const isReadOnly = isColumnReadOnly(column, row);

  useEffect(() => {
    setDraft(String(value ?? ""));
  }, [value]);

  useEffect(() => {
    if (isEditing) {
      finished.current = false;
      setDraft(initialDraft ?? visibleDraft ?? String(value ?? ""));
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const finish = (destination: EditDestination) => {
    if (finished.current) return;
    finished.current = true;

    if (destination !== "cell" && draft !== String(value ?? "")) {
      const accepted = column.onValueChange?.(row, draft);

      if (accepted !== false) {
        setCommittedDraft({ row, text: draft });
      }
    }

    setDraft(String(value ?? ""));
    onFinishEditing(destination);
  };

  useEffect(() => {
    if (!isEditing) return;

    const onPointerDown = (event: PointerEvent) => {
      const cell = inputRef.current?.closest("td");

      if (event.target instanceof Node && cell && !cell.contains(event.target)) {
        finish("outside");
      }
    };

    document.addEventListener("pointerdown", onPointerDown);

    return () => document.removeEventListener("pointerdown", onPointerDown);
  });

  if (column.editor === "checkbox") {
    return (
      <div className="flex h-9 items-center justify-center">
        <Checkbox
          aria-label={`Edit ${column.title}`}
          checked={Boolean(value)}
          disabled={isReadOnly}
          onCheckedChange={(checked) => column.onValueChange?.(row, Boolean(checked))}
        />
      </div>
    );
  }

  if (isReadOnly) {
    return renderReadOnlyValue(column, row);
  }

  if (!isEditing) {
    return (
      <div className="min-h-9 truncate px-3 py-2">
        {visibleDraft ?? (column.render ? column.render(value, row) : String(value ?? ""))}
      </div>
    );
  }

  return (
    <>
      <Input
        ref={inputRef}
        aria-label={`Edit ${column.title}`}
        className="h-9 select-text rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent"
        list={column.options ? listId : undefined}
        value={draft}
        onBlur={() => finish("outside")}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={(event) => {
          event.stopPropagation();

          if (event.nativeEvent.isComposing) return;
          const direction = arrowDirections.get(event.key);

          if (direction) {
            event.preventDefault();
            finish(direction);
          } else if (event.key === "Enter" || event.key === "Escape") {
            event.preventDefault();
            finish(event.key === "Enter" ? "down" : "cell");
          }
        }}
      />
      {column.options ? (
        <datalist id={listId}>
          {column.options.map((option) => (
            <option key={option} value={option} />
          ))}
        </datalist>
      ) : null}
    </>
  );
}
