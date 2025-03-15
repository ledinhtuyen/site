import type { Table } from "@tanstack/react-table";

export function exportTableToCSV<TData>(
  /**
   * The table to export.
   * @type Table<TData>
   */
  table: Table<TData>,
  opts: {
    /**
     * The filename for the CSV file.
     * @default "table"
     * @example "tasks"
     */
    filename?: string;
    /**
     * The columns to exclude from the CSV file.
     * @default []
     * @example ["select", "actions"]
     */
    excludeColumns?: (keyof TData | "select" | "actions")[];

    /**
     * Whether to export only the selected rows.
     * @default false
     */
    onlySelected?: boolean;
  } = {},
): void {
  const {
    filename = "table",
    excludeColumns = [],
    onlySelected = false,
  } = opts;

  // Retrieve headers (column names)
  const headers = table
    .getAllLeafColumns()
    .map((column) => column.id)
    .filter((id) => !excludeColumns.includes(id as any));

  // Rename specific headers for CSV export
  const csvHeaders = headers.map(header => {
    const headerStr = String(header);
    if (headerStr === "likedBy") return "likes";
    if (headerStr === "bookmarkedBy") return "bookmarks";
    return headerStr;
  });

  // Build CSV content
  const csvContent = [
    csvHeaders.join(","),
    ...(onlySelected
      ? table.getFilteredSelectedRowModel().rows
      : table.getRowModel().rows
    ).map((row) =>
      headers.map((header, index) => {
          let cellValue = row.getValue(header as any);
          
          // Handle likes and bookmarks - export the count instead of the array
          const headerStr = String(header);
          if (headerStr === "likedBy" || headerStr === "bookmarkedBy") {
            if (Array.isArray(cellValue)) {
              cellValue = cellValue.length;
            }
          }
          
          // Handle anonymous email
          if (headerStr === "userEmail") {
            const rowData = row.original as any;
            if (rowData.anonymous === true) {
              cellValue = "anonymous";
            }
          }
          
          // Handle values that might contain commas or newlines
          return typeof cellValue === "string"
            ? `"${cellValue.replace(/"/g, '""')}"`
            : cellValue;
        })
        .join(","),
    ),
  ].join("\n");

  // Create a Blob with CSV content
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  // Create a link and trigger the download
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
