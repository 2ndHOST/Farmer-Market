import { useState } from 'react'

function SellModal({ open, onClose, onSuccess }) {
  const [form, setForm] = useState({ name: '', minPrice: '', quantity: '', description: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!open) return null

  function updateField(key, value) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const { name, minPrice, quantity, description } = form
    if (!name || !minPrice || !quantity) {
      setError('Please fill all required fields.')
      return
    }
    const priceNum = Number(minPrice)
    const qtyNum = Number(quantity)
    if (!Number.isFinite(priceNum) || !Number.isFinite(qtyNum)) {
      setError('Minimum price and quantity must be valid numbers.')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('http://localhost:3000/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ crop: name, minPrice: priceNum, quantity: qtyNum, description, unit: 'kg' }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || 'Failed to submit')
      }
      onSuccess?.()
      onClose?.()
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-6">
        <h3 className="text-xl font-semibold text-green-700 mb-4">Sell Item</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Item name *</label>
            <input value={form.name} onChange={e => updateField('name', e.target.value)} type="text" placeholder="e.g., Tomatoes" className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Minimum price (₹) *</label>
              <input value={form.minPrice} onChange={e => updateField('minPrice', e.target.value)} type="number" min="0" step="0.01" placeholder="0" className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Quantity *</label>
              <input value={form.quantity} onChange={e => updateField('quantity', e.target.value)} type="number" min="0" step="1" placeholder="0" className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
            <textarea value={form.description} onChange={e => updateField('description', e.target.value)} rows={3} placeholder="Short description" className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          {error ? (
            <div className="text-sm text-red-600">{error}</div>
          ) : null}
          <div className="flex items-center justify-end gap-3 pt-1">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition">Cancel</button>
            <button type="submit" disabled={submitting} className="bg-green-600 disabled:opacity-60 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition shadow">
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SellModal


