'use client'

import { useState, useEffect } from 'react'
import { FreezerItem } from '@/lib/supabase'

interface AddItemFormProps {
  onSubmit: (name: string, count: number) => Promise<void>
  editingItem: FreezerItem | null
  onCancelEdit: () => void
}

export function AddItemForm({ onSubmit, editingItem, onCancelEdit }: AddItemFormProps) {
  const [name, setName] = useState('')
  const [count, setCount] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name)
      setCount(editingItem.count.toString())
    }
  }, [editingItem])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (!name.trim() || !count) return

    const countNum = parseInt(count)
    if (isNaN(countNum) || countNum < 0) return

    setIsSubmitting(true)
    await onSubmit(name.trim(), countNum)
    setName('')
    setCount('')
    setIsSubmitting(false)
  }

  function handleCancel() {
    setName('')
    setCount('')
    onCancelEdit()
  }

  return (
    <div className="mb-8 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
      <h2 className="text-xl font-semibold text-white mb-4">
        {editingItem ? 'Edit Item' : 'Add New Freezer Item'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Chicken breast"
              className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
            />
          </div>
          
          <div>
            <label htmlFor="count" className="block text-sm font-medium text-gray-300 mb-2">
              Count
            </label>
            <input
              id="count"
              type="number"
              min="0"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              placeholder="0"
              className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isSubmitting ? 'Saving...' : editingItem ? 'Update Item' : 'Add Item'}
          </button>
          
          {editingItem && (
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 rounded-lg transition duration-200"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
