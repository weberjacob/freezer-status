'use client'

import { FreezerItem } from '@/lib/supabase'

interface FreezerItemCardProps {
  item: FreezerItem
  onEdit: () => void
  onDelete: () => void
  onIncrement: () => void
  onDecrement: () => void
}

export function FreezerItemCard({
  item,
  onEdit,
  onDelete,
  onIncrement,
  onDecrement,
}: FreezerItemCardProps) {
  return (
    <div className="group bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/10">
      <div className="flex items-center justify-between gap-4">
        {/* Item Name and Count */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium text-white truncate">{item.name}</h3>
          <p className="text-sm text-gray-400 mt-1">
            Updated: {new Date(item.updated_at).toLocaleDateString()}
          </p>
        </div>

        {/* Count Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onDecrement}
            disabled={item.count === 0}
            className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white transition transform hover:scale-110 active:scale-95"
            aria-label="Decrease count"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>

          <div className="w-12 sm:w-16 text-center">
            <span className="text-2xl sm:text-3xl font-bold text-white">{item.count}</span>
          </div>

          <button
            onClick={onIncrement}
            className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition transform hover:scale-110 active:scale-95"
            aria-label="Increase count"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {/* Edit and Delete Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition sm:opacity-0 sm:group-hover:opacity-100"
            aria-label="Edit item"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          <button
            onClick={() => {
              if (confirm(`Delete "${item.name}" from the freezer list?`)) {
                onDelete()
              }
            }}
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg bg-red-600/80 hover:bg-red-600 text-white transition sm:opacity-0 sm:group-hover:opacity-100"
            aria-label="Delete item"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
