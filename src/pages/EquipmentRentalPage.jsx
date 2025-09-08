import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { useEffect, useMemo, useState } from 'react'
import { api } from '../utils/api.js'

function TypeIcon({ type }) {
  const base = 'h-6 w-6 text-[--color-agri-green]'
  switch (type) {
    case 'tractor':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M4 17a3 3 0 1 0 6 0M14 17a3 3 0 1 0 6 0"/><path d="M2 17h2m4 0h6m0 0h2m0 0h2M8 17V7h6l2 4"/></svg>
      )
    case 'pump':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M7 7h10v10H7z"/><path d="M12 2v5M12 17v5"/></svg>
      )
    case 'rotavator':
    default:
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M4 12h4M16 12h4M12 4v4M12 16v4"/></svg>
      )
  }
}

function EquipmentCard({ item, onRequest }) {
	return (
		<div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
			{item.imageUrl ? (
				<img src={item.imageUrl} alt={item.title} className="h-40 w-full object-cover rounded-lg" />
			) : (
				<div className="h-40 w-full rounded-lg bg-green-50" />
			)}
			<div className="mt-4 flex items-center gap-2">
				<TypeIcon type={item.type} />
				<h3 className="text-xl font-semibold text-green-800">{item.title}</h3>
			</div>
			<p className="text-sm text-neutral-600">{item.location}</p>
			<div className="mt-3 space-y-1">
				{item.rentPerDay != null && (
					<div className="text-sm"><span className="font-medium">Rent:</span> ₹ {item.rentPerDay} / day</div>
				)}
				<div className="text-sm"><span className="font-medium">Barter:</span> {item.barter ? 'Available (produce/services)' : 'Not available'}</div>
			</div>
			<button onClick={() => onRequest(item)} className="mt-4 bg-green-700 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-800">Request Rental</button>
		</div>
	)
}

function EquipmentRentalPage() {
	const [items, setItems] = useState([])
	const [loading, setLoading] = useState(true)
	const [onlyBarter, setOnlyBarter] = useState(false)
	const [active, setActive] = useState(null) // equipment selected
	const [mode, setMode] = useState('money')
	const [days, setDays] = useState('')
	const [barterType, setBarterType] = useState('produce')
	const [description, setDescription] = useState('')
	const [contact, setContact] = useState('')
	const filtered = useMemo(() => {
		const data = Array.isArray(items) ? items : []
		return onlyBarter ? data.filter(e => !!e.barter) : data
	}, [items, onlyBarter])

	useEffect(() => {
		let mounted = true
		;(async () => {
			const res = await api.get('/equipment')
			if (mounted) setItems(Array.isArray(res?.data) ? res.data : [])
			setLoading(false)
		})()
		const unsub = api.subscribe?.('equipment', (next) => setItems(Array.isArray(next) ? next : []))
		return () => { unsub && unsub() }
	}, [])

	async function submitRequest() {
		if (!active) return
		const payload = { equipmentId: active.id, mode }
		if (mode === 'money') { payload.days = Number(days) || 1 }
		else { payload.barterType = barterType; payload.description = description }
		payload.contact = contact
		const { data } = await api.post('/rental-request', payload)
		setActive(null)
		setMode('money'); setDays(''); setBarterType('produce'); setDescription(''); setContact('')
		alert('Request sent')
	}

	function request(item) { setActive(item) }
	return (
		<div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-green-100">
			<Navbar />
			<main className="flex-1">
				<div className="mx-auto max-w-7xl px-4 py-12">
					<h1 className="text-xl font-semibold text-green-800">Equipment Rental</h1>
					<p className="mt-2 text-neutral-700">Rent farm equipment. Pay with money or barter options.</p>
					<div className="mt-4 card-base p-4">
						<label className="inline-flex items-center gap-2 text-sm">
							<input type="checkbox" className="h-4 w-4" checked={onlyBarter} onChange={e=>setOnlyBarter(e.target.checked)} />
							<span>Show only barter-available equipment</span>
						</label>
					</div>
					<div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{loading ? (
							<div className="col-span-full text-center text-neutral-600">Loading...</div>
						) : filtered.length === 0 ? (
							<div className="col-span-full text-center text-neutral-600">No equipment found</div>
						) : (
							filtered.map((it) => (
								<EquipmentCard key={it.id} item={it} onRequest={request} />
							))
						)}
					</div>
				</div>
			</main>
			<Footer />

			{/* Request Modal */}
			{active && (
				<div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50" role="dialog" aria-modal="true">
					<div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
						<div className="flex items-start justify-between">
							<h2 className="text-xl font-semibold text-green-800">Request Rental</h2>
							<button className="text-neutral-500" onClick={()=>setActive(null)} aria-label="Close">✕</button>
						</div>
						<p className="mt-1 text-sm text-neutral-600">{active.title} — {active.location}</p>
						<div className="mt-4 space-y-3">
							<div className="flex items-center gap-4">
								<label className="inline-flex items-center gap-2">
									<input type="radio" name="mode" value="money" checked={mode==='money'} onChange={()=>setMode('money')} />
									<span>Pay with money</span>
								</label>
								{active.rentPerDay == null && <span className="text-xs text-neutral-500">(Not available)</span>}
							</div>
							{mode==='money' && active.rentPerDay != null && (
								<div className="grid grid-cols-2 gap-3">
									<div className="text-sm text-neutral-700">₹ {active.rentPerDay} per day</div>
									<input value={days} onChange={e=>setDays(e.target.value)} placeholder="Number of days" inputMode="numeric" className="rounded-lg border border-neutral-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
								</div>
							)}

							<div className="flex items-center gap-4">
								<label className="inline-flex items-center gap-2">
									<input type="radio" name="mode" value="barter" checked={mode==='barter'} onChange={()=>setMode('barter')} />
									<span>Barter</span>
								</label>
								{!active.barter && <span className="text-xs text-neutral-500">(Not available)</span>}
							</div>
							{mode==='barter' && active.barter && (
								<div className="grid grid-cols-1 gap-3">
									<select value={barterType} onChange={e=>setBarterType(e.target.value)} className="rounded-lg border border-neutral-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
										<option value="produce">Produce</option>
										<option value="services">Services</option>
										<option value="other">Other</option>
									</select>
									<textarea value={description} onChange={e=>setDescription(e.target.value)} rows="3" placeholder="Describe what you can offer" className="rounded-lg border border-neutral-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
								</div>
							)}

							<div className="grid grid-cols-1 gap-3">
								<input value={contact} onChange={e=>setContact(e.target.value)} placeholder="Your phone or email" className="rounded-lg border border-neutral-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
							</div>
						</div>
						<div className="mt-6 flex justify-end gap-3">
							<button className="px-4 py-2 rounded-lg border border-neutral-300" onClick={()=>setActive(null)}>Cancel</button>
							<button className="bg-green-700 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-800" onClick={submitRequest}>Send Request</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default EquipmentRentalPage


