'use client'

import { useEffect, useState } from 'react'
import { supabase, FreezerItem } from '@/lib/supabase'
import { FreezerItemCard } from '@/components/FreezerItemCard'
import { AddItemForm } from '@/components/AddItemForm'

export default function Home() {
  const [items, setItems] = useState<FreezerItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingItem, setEditingItem] = useState<FreezerItem | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    fetchItems()

    // Subscribe to real-time changes
    const channel = supabase
      .channel('freezer_items_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'freezer_items' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setItems((current) => [...current, payload.new as FreezerItem])
          } else if (payload.eventType === 'UPDATE') {
            setItems((current) =>
              current.map((item) =>
                item.id === payload.new.id ? (payload.new as FreezerItem) : item
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setItems((current) =>
              current.filter((item) => item.id !== payload.old.id)
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function fetchItems() {
    const { data, error } = await supabase
      .from('freezer_items')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching items:', error)
      setErrorMessage('Failed to load items. Please refresh and try again.')
    } else {
      setItems(data || [])
    }
    setLoading(false)
  }

  async function handleAddOrUpdate(name: string, count: number) {
    if (editingItem) {
      // Update existing item
      const { error } = await supabase
        .from('freezer_items')
        .update({ name, count, updated_at: new Date().toISOString() })
        .eq('id', editingItem.id)

      if (error) {
        console.error('Error updating item:', error)
        setErrorMessage('Failed to update item. Please try again.')
        return
      }
      setEditingItem(null)
    } else {
      // Add new item
      const { error } = await supabase
        .from('freezer_items')
        .insert([{ name, count }])

      if (error) {
        console.error('Error adding item:', error)
        setErrorMessage('Failed to add item. Please try again.')
      }
    }
  }

  async function handleDelete(id: string) {
    const { error } = await supabase
      .from('freezer_items')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting item:', error)
      setErrorMessage('Failed to delete item. Please try again.')
    }
  }

  async function handleIncrement(item: FreezerItem) {
    const { error } = await supabase
      .from('freezer_items')
      .update({ count: item.count + 1, updated_at: new Date().toISOString() })
      .eq('id', item.id)

    if (error) {
      console.error('Error incrementing count:', error)
      setErrorMessage('Failed to update count. Please try again.')
    }
  }

  async function handleDecrement(item: FreezerItem) {
    if (item.count > 0) {
      const { error } = await supabase
        .from('freezer_items')
        .update({ count: item.count - 1, updated_at: new Date().toISOString() })
        .eq('id', item.id)

      if (error) {
        console.error('Error decrementing count:', error)
        setErrorMessage('Failed to update count. Please try again.')
      }
    }
  }

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">
            Freezer List
          </h1>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className="mb-6 flex items-start justify-between gap-4 bg-red-900/40 border border-red-700 text-red-200 rounded-lg px-4 py-3">
            <p className="text-sm">{errorMessage}</p>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-red-300 hover:text-white transition shrink-0"
              aria-label="Dismiss error"
            >
              ✕
            </button>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        {/* Add/Edit Form */}
        <AddItemForm
          onSubmit={handleAddOrUpdate}
          editingItem={editingItem}
          onCancelEdit={() => setEditingItem(null)}
        />

        {/* Items List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading items...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12 bg-gray-800/50 rounded-lg border border-gray-700">
            <p className="text-gray-400 text-lg">
              {searchTerm ? 'No items found matching your search' : 'No items in the freezer yet'}
            </p>
            {!searchTerm && (
              <p className="text-gray-500 text-sm mt-2">
                Add your first item using the form above
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <FreezerItemCard
                key={item.id}
                item={item}
                onEdit={() => setEditingItem(item)}
                onDelete={() => handleDelete(item.id)}
                onIncrement={() => handleIncrement(item)}
                onDecrement={() => handleDecrement(item)}
              />
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>Total items: {filteredItems.length}</p>
          <p className="mt-1">
            Total count: {filteredItems.reduce((sum, item) => sum + item.count, 0)}
          </p>
        </div>
      </div>
    </main>
  )
}
