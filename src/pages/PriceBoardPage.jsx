import { useEffect, useMemo, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import BidModal from '../components/BidModal.jsx'
import { api } from '../utils/api.js'

function PriceBoardPage() {
	const [listings, setListings] = useState([])
	const [loading, setLoading] = useState(true)
	const [selected, setSelected] = useState(null)
	const [open, setOpen] = useState(false)
	const [query, setQuery] = useState('')
	const [sortAsc, setSortAsc] = useState(true)

	useEffect(() => {
		let mounted = true
		;(async () => {
			const res = await api.get('/listings')
			if (mounted) setListings(Array.isArray(res?.data) ? res.data : [])
			setLoading(false)
		})()
		return () => { mounted = false }
	}, [])

	function openBid(listing) {
		setSelected(listing)
		setOpen(true)
	}

	async function submitBid({ price }) {
		if (!selected) return
		await api.post('/bid', { crop: selected.crop || selected.name, price })
		setOpen(false)
		setSelected(null)
		// refresh after bid to reflect latest min price
		const res = await api.get('/listings')
		setListings(Array.isArray(res?.data) ? res.data : [])
	}

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase()
		const arr = q ? listings.filter(x => (x.crop || x.name || '').toLowerCase().includes(q)) : listings
		return [...arr].sort((a, b) => {
			const ap = a.minPrice ?? a.price ?? 0
			const bp = b.minPrice ?? b.price ?? 0
			return sortAsc ? ap - bp : bp - ap
		})
	}, [listings, query, sortAsc])

	return (
		<div className="min-h-screen flex flex-col">
			<Navbar />
			<main className="flex-1">
				<div className="mx-auto max-w-7xl px-4 py-12">
					<h1 className="text-3xl font-bold text-neutral-900">Price Board</h1>
					<div className="mt-4 flex flex-wrap items-center gap-3">
						<input aria-label="Filter by product" value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Filter by product" className="rounded-xl border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[--color-agri-green]" />
						<button onClick={()=>setSortAsc(v=>!v)} className="rounded-lg bg-green-700 text-white px-4 py-2 shadow-md hover:bg-green-800 transition">Sort by Price {sortAsc ? '▲' : '▼'}</button>
					</div>
					<div className="mt-6 card-base overflow-hidden">
						<div className="overflow-x-auto">
							<table className="min-w-full text-sm">
								<thead className="bg-[--color-agri-beige] text-neutral-700 font-semibold">
									<tr>
										<th className="px-4 py-2 text-left">Product</th>
										<th className="px-4 py-2 text-left">Unit</th>
										<th className="px-4 py-2 text-left">Quantity</th>
										<th className="px-4 py-2 text-left">Min Price (₹)</th>
										<th className="px-4 py-2 text-left">Farmer</th>
										<th className="px-4 py-2 text-left">Action</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-neutral-200">
									{loading ? (
										<tr>
											<td colSpan="6" className="px-4 py-6 text-center text-neutral-500">Loading...</td>
										</tr>
									) : filtered.length === 0 ? (
										<tr>
											<td colSpan="6" className="px-4 py-6 text-center text-neutral-500">No listings available</td>
										</tr>
									) : (
										filtered.map((item) => (
											<tr key={item.id} className="hover:bg-neutral-50">
												<td className="px-4 py-3 font-medium text-neutral-900">{item.crop || item.name}</td>
												<td className="px-4 py-3">{item.unit || 'kg'}</td>
												<td className="px-4 py-3">{item.quantity ?? '-'}</td>
												<td className="px-4 py-3 text-[--color-agri-green] font-semibold">{item.minPrice ?? item.price}</td>
												<td className="px-4 py-3">{item.farmerName || '—'}</td>
												<td className="px-4 py-3">
													<button onClick={() => openBid(item)} className="rounded-lg bg-green-700 text-white px-3 py-2 shadow-md hover:bg-green-800 transition">Place Bid</button>
												</td>
											</tr>
										))
									)}
							</tbody>
						</table>
						</div>
					</div>
				</div>
			</main>
			<Footer />
			<BidModal open={open} onClose={() => setOpen(false)} onSubmit={submitBid} defaultCrop={selected?.crop || selected?.name} />
		</div>
	)
}

export default PriceBoardPage


