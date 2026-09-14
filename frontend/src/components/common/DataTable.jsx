import React, { useState } from "react";
import { Edit2, Trash2, Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Inbox } from "lucide-react";
import ConfirmModal from "./ConfirmModal";

export default function DataTable({
  columns,
  data = [],
  onEdit,
  onDelete,
  searchPlaceholder = "Filter records...",
  title,
  subtitle,
  actions,
  isLoading = false,
  pageSize: initialPageSize = 10
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteItem, setDeleteItem] = useState(null);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // 1. Filter
  const filteredData = data.filter(item =>
    Object.values(item).some(val =>
      String(val ?? "").toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // 2. Sort
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;
    const aVal = a[sortColumn];
    const bVal = b[sortColumn];

    if (aVal === undefined || aVal === null) return 1;
    if (bVal === undefined || bVal === null) return -1;

    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
    }

    const aStr = String(aVal).toLowerCase();
    const bStr = String(bVal).toLowerCase();
    if (aStr < bStr) return sortDirection === "asc" ? -1 : 1;
    if (aStr > bStr) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // 3. Paginate
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const paginatedData = sortedData.slice(startIndex, startIndex + pageSize);

  const handleHeaderClick = (col) => {
    if (col.sortable === false) return;
    const key = col.sortKey || col.accessor;
    if (!key) return;

    if (sortColumn === key) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else {
        setSortColumn(null);
        setSortDirection("asc");
      }
    } else {
      setSortColumn(key);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const handleDeleteConfirm = () => {
    if (deleteItem && onDelete) {
      onDelete(deleteItem);
      setDeleteItem(null);
    }
  };

  return (
    <div className="command-card w-full overflow-hidden flex flex-col bg-surface border border-border rounded-2xl shadow-warm-sm">
      {/* Table Header Controls */}
      <div className="p-5 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          {title && <h2 className="font-serif text-lg font-bold text-ink">{title}</h2>}
          {subtitle && <p className="text-xs text-ink-muted font-sans mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-ink-muted" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={searchPlaceholder}
              className="pl-9 pr-4 py-2 bg-surface-warm border border-border rounded-xl text-xs text-ink placeholder-ink-muted focus:outline-none focus:border-cobalt w-64 transition-all"
            />
          </div>

          {actions}
        </div>
      </div>

      {/* Sticky Header Technical Data Table */}
      <div className="overflow-x-auto overflow-y-auto max-h-[650px] relative">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-surface-warm border-b border-border text-xs font-mono uppercase tracking-wider text-ink-muted z-10">
            <tr>
              {columns.map((col, idx) => {
                const key = col.sortKey || col.accessor;
                const canSort = col.sortable !== false && Boolean(key);
                const isSorted = sortColumn === key;

                return (
                  <th
                    key={idx}
                    onClick={() => canSort && handleHeaderClick(col)}
                    className={`px-4 py-3.5 font-semibold select-none ${canSort ? "cursor-pointer hover:text-cobalt transition-colors" : ""}`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{col.header}</span>
                      {canSort && (
                        isSorted ? (
                          sortDirection === "asc" ? (
                            <ArrowUp className="w-3.5 h-3.5 text-cobalt" />
                          ) : (
                            <ArrowDown className="w-3.5 h-3.5 text-cobalt" />
                          )
                        ) : (
                          <ArrowUpDown className="w-3.5 h-3.5 opacity-30 group-hover:opacity-100" />
                        )
                      )}
                    </div>
                  </th>
                );
              })}
              {(onEdit || onDelete) && (
                <th className="px-4 py-3.5 text-right font-semibold">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 text-xs font-sans text-ink">
            {isLoading ? (
              // Loading Skeleton State
              Array.from({ length: 5 }).map((_, rowIdx) => (
                <tr key={`skeleton-${rowIdx}`} className="animate-pulse">
                  {columns.map((_, colIdx) => (
                    <td key={colIdx} className="px-4 py-4">
                      <div className="h-3.5 bg-surface-warm rounded-md w-3/4" />
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="px-4 py-4 text-right">
                      <div className="h-3.5 bg-surface-warm rounded-md w-12 ml-auto" />
                    </td>
                  )}
                </tr>
              ))
            ) : paginatedData.length === 0 ? (
              // Empty State
              <tr>
                <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-surface-warm border border-border flex items-center justify-center text-ink-muted">
                      <Inbox className="w-5 h-5" />
                    </div>
                    <span className="font-serif font-bold text-sm text-ink">No records found</span>
                    <span className="text-xs text-ink-muted font-mono max-w-sm">
                      {searchTerm ? `No matching records found for "${searchTerm}". Try adjusting your search query.` : "There are currently no records available in this collection."}
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <tr
                  key={row.id || rowIndex}
                  className="command-table-row group animate-stagger-fade"
                  style={{ animationDelay: `${rowIndex * 40}ms` }}
                >
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="px-4 py-3.5 font-mono">
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(row)}
                            className="ghost-action-btn"
                            title="Edit Record"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => setDeleteItem(row)}
                            className="ghost-action-btn danger"
                            title="Delete Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Table Pagination Footer */}
      <div className="p-3.5 border-t border-border bg-surface-warm/50 text-xs font-mono text-ink-muted flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span>Showing {sortedData.length > 0 ? startIndex + 1 : 0}–{Math.min(startIndex + pageSize, sortedData.length)} of {sortedData.length} records</span>
          {sortedData.length > 0 && (
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-0.5 bg-surface border border-border rounded text-[10px] text-ink focus:outline-none font-mono"
            >
              <option value={5}>5 / page</option>
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
              <option value={50}>50 / page</option>
            </select>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={safeCurrentPage <= 1 || isLoading}
            className="p-1 rounded-lg border border-border bg-surface hover:bg-surface-warm text-ink disabled:opacity-40 disabled:hover:bg-surface transition-all"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-[11px] font-semibold text-ink px-1">
            Page {safeCurrentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={safeCurrentPage >= totalPages || isLoading}
            className="p-1 rounded-lg border border-border bg-surface hover:bg-surface-warm text-ink disabled:opacity-40 disabled:hover:bg-surface transition-all"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteItem && (
        <ConfirmModal
          isOpen={true}
          title="Confirm Deletion"
          message={`Are you sure you want to delete "${deleteItem.name || deleteItem.code || deleteItem.id}"? This action cannot be undone.`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteItem(null)}
        />
      )}
    </div>
  );
}

