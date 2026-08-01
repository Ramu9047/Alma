import React, { useState } from 'react';
import { Edit2, Trash2, Search } from 'lucide-react';
import ConfirmModal from './ConfirmModal';

export default function DataTable({
  columns,
  data,
  onEdit,
  onDelete,
  searchPlaceholder = "Filter records...",
  title,
  subtitle,
  actions
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteItem, setDeleteItem] = useState(null);

  const filteredData = data.filter(item =>
    Object.values(item).some(val =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

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
              onChange={(e) => setSearchTerm(e.target.value)}
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
              {columns.map((col, idx) => (
                <th key={idx} className="px-4 py-3.5 font-semibold">
                  {col.header}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="px-4 py-3.5 text-right font-semibold">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 text-xs font-sans text-ink">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-ink-muted font-mono">
                  No records matching search query.
                </td>
              </tr>
            ) : (
              filteredData.map((row, rowIndex) => (
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
      <div className="p-3 border-t border-border bg-surface-warm/50 text-xs font-mono text-ink-muted flex items-center justify-between">
        <span>Showing {filteredData.length} records</span>
        <span className="text-[10px] uppercase text-cobalt font-semibold">Alma Academic Data Grid</span>
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
