// @vitest-environment happy-dom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import { DataGrid, type DataGridProps } from "./data-grid";

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
let root: Root;
let container: HTMLDivElement;

afterEach(() => {
  act(() => root?.unmount());
  container?.remove();
});

function click(element: Element) {
  act(() => {
    element.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, button: 0 }));
  });
  act(() => {
    element.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, button: 0 }));
    element.dispatchEvent(new MouseEvent("mouseup", { bubbles: true, button: 0 }));
    element.dispatchEvent(new MouseEvent("click", { bubbles: true, button: 0 }));
  });
}

function key(element: Element, value: string, options: KeyboardEventInit = {}) {
  act(() => {
    element.dispatchEvent(new KeyboardEvent("keydown", { key: value, bubbles: true, ...options }));
  });
}

function type(value: string) {
  const input = container.querySelector<HTMLInputElement>('input[aria-label="Edit Name"]')!;
  act(() => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  return input;
}

function setup(selectionMode: "row" | "cell", sorted = false) {
  const save = vi.fn();
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  const render = (
    rows = [
      { id: "1", name: "Alpha" },
      { id: "2", name: "Beta" },
    ],
  ) => {
    root.render(
      <>
        <DataGrid
          columns={[{ key: "name", title: "Name", onValueChange: save }]}
          data={rows}
          getRowId={(row) => row.id}
          selectionMode={selectionMode}
          showColumnFilters={false}
          sorting={sorted ? [{ id: "name", desc: true }] : []}
        />
        <button>Outside</button>
        <div data-testid="outside">Outside text</div>
      </>,
    );
  };
  act(() => render());
  const cells = [...container.querySelectorAll("tbody tr")].map(
    (row) => row.lastElementChild as HTMLTableCellElement,
  );
  return { save, cells, render };
}

describe.each(["row", "cell"] as const)("%s selection editing", (mode) => {
  it("focuses on first click, edits on second, and cancels Escape without saving", () => {
    const { save, cells } = setup(mode);
    click(cells[0].firstElementChild!);
    expect(document.activeElement).toBe(cells[0]);
    expect(container.querySelector('input[aria-label="Edit Name"]')).toBeNull();
    click(cells[0].firstElementChild!);
    const input = type("Changed");
    expect(document.activeElement).toBe(input);
    key(input, "Escape");
    expect(save).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(cells[0]);
    expect(cells[0].textContent).toBe("Alpha");
    click(cells[0].firstElementChild!);
    expect(type("Again").value).toBe("Again");
  });

  it("starts a replacement entry when typing, and Escape restores the original", () => {
    const { save, cells } = setup(mode);
    click(cells[0]);
    key(cells[0], "x");
    const input = container.querySelector<HTMLInputElement>('input[aria-label="Edit Name"]')!;
    expect(document.activeElement).toBe(input);
    expect(input.value).toBe("x");
    type("xyz");
    key(input, "Escape");
    expect(cells[0].textContent).toBe("Alpha");
    expect(document.activeElement).toBe(cells[0]);
    expect(save).not.toHaveBeenCalled();
    click(cells[0]);
    expect(container.querySelector<HTMLInputElement>('input[aria-label="Edit Name"]')!.value).toBe(
      "Alpha",
    );
  });

  it.each(["Enter", "outside"])("saves a typed replacement on %s", (destination) => {
    const { save, cells } = setup(mode);
    click(cells[0]);
    key(cells[0], "N", { shiftKey: true });
    expect(container.querySelector<HTMLInputElement>('input[aria-label="Edit Name"]')!.value).toBe(
      "N",
    );
    const input = type("New text");
    if (destination === "Enter") key(input, "Enter");
    else click(cells[1]);
    expect(save).toHaveBeenCalledExactlyOnceWith({ id: "1", name: "Alpha" }, "New text");
    expect(document.activeElement).toBe(cells[1]);
  });

  it("does not start editing for shortcuts or modifier keys", () => {
    const { cells } = setup(mode);
    click(cells[0]);
    key(cells[0], "c", { ctrlKey: true });
    key(cells[0], "v", { metaKey: true });
    key(cells[0], "e", { altKey: true });
    key(cells[0], "Shift");
    expect(container.querySelector('input[aria-label="Edit Name"]')).toBeNull();
    key(cells[0], " ");
    expect(container.querySelector<HTMLInputElement>('input[aria-label="Edit Name"]')!.value).toBe(
      " ",
    );
  });

  it("saves once on Enter and focuses the cell below in displayed order", () => {
    const { save, cells } = setup(mode, true);
    click(cells[0]);
    key(cells[0], "Enter");
    key(type("Changed"), "Enter");
    expect(save).toHaveBeenCalledExactlyOnceWith({ id: "2", name: "Beta" }, "Changed");
    expect(document.activeElement).toBe(cells[1]);
    expect(container.querySelector('input[aria-label="Edit Name"]')).toBeNull();
  });

  it.each(["Enter", "outside"])(
    "keeps committed text visible on %s until row data arrives",
    async (destination) => {
      const { cells, render } = setup(mode);
      await act(async () =>
        render([
          { id: "1", name: "" },
          { id: "2", name: "Beta" },
        ]),
      );
      click(cells[0]);
      key(cells[0], "N");
      const input = type("New text ");
      if (destination === "Enter") key(input, "Enter");
      else click(cells[1]);
      expect(cells[0].textContent).toBe("New text ");
      expect(document.activeElement).toBe(cells[1]);
      // The optimistic cache may normalize input before the server responds.
      await act(async () =>
        render([
          { id: "1", name: "New text" },
          { id: "2", name: "Beta" },
        ]),
      );
      expect(cells[0].textContent).toBe("New text");
      // A failed request must still be able to roll back to the original value.
      await act(async () =>
        render([
          { id: "1", name: "" },
          { id: "2", name: "Beta" },
        ]),
      );
      expect(cells[0].textContent).toBe("");
    },
  );

  it("does not retain a draft rejected by validation", () => {
    const { save, cells } = setup(mode);
    save.mockReturnValue(false);
    click(cells[0]);
    key(cells[0], "x");
    key(type("Invalid"), "Enter");
    expect(cells[0].textContent).toBe("Alpha");
  });

  it.each([
    ["ArrowDown", 0, 0, 1, 0],
    ["ArrowUp", 1, 0, 0, 0],
    ["ArrowRight", 0, 0, 0, 1],
    ["ArrowLeft", 0, 1, 0, 0],
  ] as const)(
    "commits and moves with %s while editing",
    (arrow, fromRow, fromColumn, toRow, toColumn) => {
      const { save } = setup(mode);
      act(() =>
        root.render(
          <DataGrid
            columns={[
              { key: "name", title: "Name", onValueChange: save },
              { key: "other", title: "Other", onValueChange: save },
            ]}
            data={[
              { id: "1", name: "Alpha", other: "One" },
              { id: "2", name: "Beta", other: "Two" },
            ]}
            getRowId={(row) => row.id}
            selectionMode={mode}
            showColumnFilters={false}
          />,
        ),
      );
      const rows = [...container.querySelectorAll("tbody tr")];
      const cellAt = (row: number, column: number) =>
        rows[row].children[column + (mode === "row" ? 1 : 0)] as HTMLTableCellElement;
      const source = cellAt(fromRow, fromColumn);
      const target = cellAt(toRow, toColumn);
      click(source);
      key(source, "X");
      const input = container.querySelector('tbody input[aria-label^="Edit "]')!;
      key(input, arrow);
      expect(save).toHaveBeenCalledTimes(1);
      expect(save.mock.calls[0][1]).toBe("X");
      expect(source.textContent).toBe("X");
      expect(document.activeElement).toBe(target);
      expect(container.querySelector('tbody input[aria-label^="Edit "]')).toBeNull();
      // At the grid edge, commit without wrapping or losing focus.
      if (arrow !== "ArrowLeft" || mode === "cell") {
        key(target, "Y");
        key(container.querySelector('tbody input[aria-label^="Edit "]')!, arrow);
        expect(save).toHaveBeenCalledTimes(2);
        expect(document.activeElement).toBe(target);
      }
    },
  );

  it("keeps the next cell focused through optimistic updates and server refreshes", async () => {
    const { cells, render } = setup(mode);
    // Flush the table's scheduled data-change resets before interacting.
    await act(async () => {});
    click(cells[0]);
    click(cells[0]);
    key(type("Changed"), "Enter");

    const expectFocus = () => {
      expect(document.activeElement).toBe(cells[1]);
      expect(cells[1].dataset.focused).toBe("true");
      expect(cells[1].tabIndex).toBe(0);
    };
    expectFocus();
    await act(async () =>
      render([
        { id: "1", name: "Changed" },
        { id: "2", name: "Beta" },
      ]),
    );
    expect(cells[0].textContent).toBe("Changed");
    expectFocus();
    await act(async () =>
      render([
        { id: "1", name: "Changed (server)" },
        { id: "2", name: "Beta" },
      ]),
    );
    expectFocus();
    // A later refresh must also leave a newly opened editor alone.
    click(cells[1]);
    const input = type("Next draft");
    await act(async () =>
      render([
        { id: "1", name: "Changed (refetched)" },
        { id: "2", name: "Beta" },
      ]),
    );
    expect(document.activeElement).toBe(input);
    expect(input.value).toBe("Next draft");
  });

  it("saves on outside clicks and selects the clicked cell without editing it", () => {
    const { save, cells } = setup(mode);
    click(cells[0]);
    click(cells[0]);
    type("Changed");
    click(cells[1]);
    expect(save).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(cells[1]);
    expect(container.querySelector('input[aria-label="Edit Name"]')).toBeNull();
  });

  it("commits when clicking non-focusable content outside the cell", () => {
    const { save, cells } = setup(mode);
    click(cells[0]);
    click(cells[0]);
    type("Changed");
    click(container.querySelector('[data-testid="outside"]')!);
    expect(save).toHaveBeenCalledExactlyOnceWith({ id: "1", name: "Alpha" }, "Changed");
    expect(container.querySelector('input[aria-label="Edit Name"]')).toBeNull();
  });

  it("saves on blur without taking focus back from an outside control", () => {
    const { save, cells } = setup(mode);
    click(cells[0]);
    click(cells[0]);
    type("Changed");
    const outside = container.querySelector<HTMLButtonElement>("button:last-of-type")!;
    act(() => outside.focus());
    expect(save).toHaveBeenCalledExactlyOnceWith({ id: "1", name: "Alpha" }, "Changed");
    expect(document.activeElement).toBe(outside);
  });

  it("does not save unchanged values and stays on the last cell after Enter", () => {
    const { save, cells } = setup(mode);
    click(cells[1]);
    click(cells[1]);
    key(container.querySelector('input[aria-label="Edit Name"]')!, "Enter");
    expect(save).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(cells[1]);
  });
});

describe("column filters", () => {
  it("filters boolean columns by exact value", () => {
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
    act(() =>
      root.render(
        <DataGrid
          columns={[
            { key: "name", title: "Name" },
            { key: "original", title: "Original" },
          ]}
          columnFilters={[{ id: "original", value: true }]}
          data={[
            { id: "1", name: "Alpha", original: true },
            { id: "2", name: "Beta", original: false },
          ]}
          getRowId={(row) => row.id}
          selectionMode="none"
          showColumnFilters={false}
        />,
      ),
    );

    const names = [...container.querySelectorAll("tbody tr")].map(
      (row) => row.firstElementChild?.textContent,
    );
    expect(names).toEqual(["Alpha"]);
  });
});

describe("read-only rows", () => {
  it("moves rows without re-rendering them when sorting or filtering", () => {
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
    type Row = { id: string; name: string };
    const renderName = vi.fn((value: string) => value);
    const columns: DataGridProps<Row>["columns"] = [
      { key: "name", title: "Name", render: renderName },
    ];
    const data: Row[] = [
      { id: "1", name: "Alpha" },
      { id: "2", name: "Beta" },
      { id: "3", name: "Gamma" },
    ];
    const getRowId = (row: Row) => row.id;
    const render = (props: Pick<DataGridProps<Row>, "sorting" | "columnFilters"> = {}) =>
      act(() =>
        root.render(
          <DataGrid
            columns={columns}
            data={data}
            getRowId={getRowId}
            selectionMode="none"
            showColumnFilters={false}
            {...props}
          />,
        ),
      );
    const names = () => [...container.querySelectorAll("tbody tr")].map((row) => row.textContent);

    render();
    renderName.mockClear();
    render({ sorting: [{ id: "name", desc: true }] });
    expect(names()).toEqual(["Gamma", "Beta", "Alpha"]);
    render({ sorting: [{ id: "name", desc: true }], columnFilters: [{ id: "name", value: "a" }] });
    expect(names()).toEqual(["Gamma", "Beta", "Alpha"]);
    render({ sorting: [{ id: "name", desc: true }], columnFilters: [{ id: "name", value: "et" }] });
    expect(names()).toEqual(["Beta"]);
    expect(renderName).not.toHaveBeenCalled();
  });
});

describe("DataGrid pinned rows", () => {
  it("keeps pinned rows first in sorted order", () => {
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
    const rows = [
      { id: "1", name: "Alpha", pinned: false },
      { id: "2", name: "Beta", pinned: true },
      { id: "3", name: "Gamma", pinned: false },
      { id: "4", name: "Delta", pinned: true },
    ];
    act(() =>
      root.render(
        <DataGrid
          columns={[{ key: "name", title: "Name", readOnly: true }]}
          data={rows}
          getRowId={(row) => row.id}
          isRowPinned={(row) => row.pinned}
          selectionMode="none"
          showColumnFilters={false}
          sorting={[{ id: "name", desc: false }]}
        />,
      ),
    );
    expect([...container.querySelectorAll("tbody tr")].map((row) => row.textContent)).toEqual([
      "Beta",
      "Delta",
      "Alpha",
      "Gamma",
    ]);
  });
});
