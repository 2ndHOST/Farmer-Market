import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { useEffect, useMemo, useRef, useState } from 'react'
import { api } from '../utils/api.js'
import useAuth from '../hooks/useAuth.js'

function BuyerDashboard() {
	const [listings, setListings] = useState([])
	const [loading, setLoading] = useState(true)
	const [bids, setBids] = useState([])
	const [showContactId, setShowContactId] = useState(null)
	const [query, setQuery] = useState('')
	const [location, setLocation] = useState('')
	const [minPrice, setMinPrice] = useState('')
	const [maxPrice, setMaxPrice] = useState('')
	const [sortBy, setSortBy] = useState('createdAt-desc')
	const newRowIdsRef = useRef(new Set())
  const { user } = useAuth()
  
  // Helper function to get API base URL with fallbacks
  function getApiBaseUrl() {
    if (import.meta?.env?.VITE_API_URL) {
      return import.meta.env.VITE_API_URL
    }
    return 'http://localhost:3000'
  }

	useEffect(() => {
		let mounted = true
		;(async () => {
			try {
        const [l, b] = await Promise.all([
          fetch(`${getApiBaseUrl()}/listings`).then(r=>r.json()).catch(()=>[]),
          api.get('/bids').then(r=>r.data).catch(()=>[]),
        ])
				if (mounted) {
					setListings(Array.isArray(l) ? l : [])
					setBids(Array.isArray(b) ? b : [])
				}
			} finally { if (mounted) setLoading(false) }
		})()

		// live updates
		const unsubListings = api.subscribe?.('listings', (next) => {
			setListings((prev) => {
				const prevIds = new Set(prev.map(x => x.id))
				const nextArr = Array.isArray(next) ? next : []
				for (const item of nextArr) { if (!prevIds.has(item.id)) newRowIdsRef.current.add(item.id) }
				return nextArr
			})
		})
		const unsubBids = api.subscribe?.('bids', (next) => { setBids(Array.isArray(next) ? next : []) })

		return () => { mounted = false; unsubListings && unsubListings(); unsubBids && unsubBids() }
	}, [user])

	const filteredAndSorted = useMemo(() => {
		let data = Array.isArray(listings) ? listings.slice() : []
		const q = query.trim().toLowerCase()
		if (q) data = data.filter(x => String(x.crop || x.name || '').toLowerCase().includes(q))
		const loc = location.trim().toLowerCase()
		if (loc) data = data.filter(x => String(x.location || '').toLowerCase().includes(loc))
		const min = Number(minPrice)
		if (!Number.isNaN(min) && minPrice !== '') data = data.filter(x => Number(x.minPrice ?? x.price ?? 0) >= min)
		const max = Number(maxPrice)
		if (!Number.isNaN(max) && maxPrice !== '') data = data.filter(x => Number(x.minPrice ?? x.price ?? 0) <= max)

		const [field, dir] = String(sortBy).split('-')
		const mult = dir === 'desc' ? -1 : 1
		data.sort((a,b) => {
			let va, vb
			switch (field) {
				case 'price': va = Number(a.minPrice ?? a.price ?? 0); vb = Number(b.minPrice ?? b.price ?? 0); break
				case 'quantity': va = Number(a.quantity ?? 0); vb = Number(b.quantity ?? 0); break
				case 'location': va = String(a.location || ''); vb = String(b.location || ''); break
				default: va = Number(a.createdAt ?? 0); vb = Number(b.createdAt ?? 0)
			}
			if (va < vb) return -1 * mult
			if (va > vb) return 1 * mult
			return 0
		})
		return data
	}, [listings, query, location, minPrice, maxPrice, sortBy])

	return (
		<div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-green-100">
			<Navbar />
			<main className="flex-1">
				<div className="mx-auto max-w-7xl px-4 py-12">
					<h1 className="text-2xl font-bold text-green-800">Browse Listings</h1>
					<div className="mt-4 card-base p-6 shadow-lg" aria-labelledby="browse-listings-heading">
						<div className="grid grid-cols-1 md:grid-cols-4 gap-3" role="search" aria-label="Listings filters">
							<label className="sr-only" htmlFor="filter-query">Search crop</label>
							<input id="filter-query" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search crop..." className="w-full rounded-lg border border-neutral-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" aria-label="Search by crop name" />
							<label className="sr-only" htmlFor="filter-location">Filter by location</label>
							<input id="filter-location" value={location} onChange={e=>setLocation(e.target.value)} placeholder="Filter by location..." className="w-full rounded-lg border border-neutral-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" aria-label="Filter by location" />
							<div className="flex gap-2">
								<label className="sr-only" htmlFor="filter-min">Min price</label>
								<input id="filter-min" value={minPrice} onChange={e=>setMinPrice(e.target.value)} placeholder="Min price" inputMode="numeric" className="w-full rounded-lg border border-neutral-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" aria-label="Minimum price" />
								<label className="sr-only" htmlFor="filter-max">Max price</label>
								<input id="filter-max" value={maxPrice} onChange={e=>setMaxPrice(e.target.value)} placeholder="Max price" inputMode="numeric" className="w-full rounded-lg border border-neutral-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" aria-label="Maximum price" />
							</div>
							<label className="sr-only" htmlFor="sort-by">Sort by</label>
							<select id="sort-by" value={sortBy} onChange={e=>setSortBy(e.target.value)} className="w-full rounded-lg border border-neutral-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" aria-label="Sort listings">
								<option value="createdAt-desc">Newest</option>
								<option value="price-asc">Price: Low to High</option>
								<option value="price-desc">Price: High to Low</option>
								<option value="quantity-desc">Quantity: High to Low</option>
								<option value="quantity-asc">Quantity: Low to High</option>
								<option value="location-asc">Location A-Z</option>
								<option value="location-desc">Location Z-A</option>
							</select>
						</div>
					</div>
					{/* Desktop table */}
					<div className="mt-6 card-base overflow-hidden p-6 shadow-lg hidden md:block">
						<div className="overflow-x-auto">
							<table className="min-w-full text-sm" aria-labelledby="browse-listings-heading">
								<caption className="sr-only">Browse Listings</caption>
								<thead className="bg-[--color-agri-beige] text-neutral-700 font-semibold">
									<tr>
										<th scope="col" className="px-4 py-2 text-left">Product</th>
										<th scope="col" className="px-4 py-2 text-left">Unit</th>
										<th scope="col" className="px-4 py-2 text-left">Quantity</th>
										<th scope="col" className="px-4 py-2 text-left">Farmer Price (₹)</th>
										<th scope="col" className="px-4 py-2 text-left">Farmer</th>
										<th scope="col" className="px-4 py-2 text-left">Location</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-neutral-200">
									{loading ? (
										<tr>
											<td colSpan="6" className="px-4 py-6 text-center text-neutral-500">Loading...</td>
										</tr>
									) : filteredAndSorted.length === 0 ? (
										<tr>
											<td colSpan="6" className="px-4 py-6 text-center text-neutral-500">No listings available</td>
										</tr>
									) : (
										filteredAndSorted.map((item) => (
											<tr key={item.id} className={`hover:bg-neutral-50 ${newRowIdsRef.current.has(item.id) ? 'fade-in' : ''}`} onAnimationEnd={() => { newRowIdsRef.current.delete(item.id) }}>
												<td className="px-4 py-3 font-medium text-neutral-900">{item.crop || item.name}</td>
												<td className="px-4 py-3">{item.unit || 'kg'}</td>
												<td className="px-4 py-3">{item.quantity ?? '-'}</td>
												<td className="px-4 py-3 text-green-700 font-semibold">{item.minPrice ?? item.price}</td>
												<td className="px-4 py-3">{item.farmerName || '—'}{item.farmerPhone ? ` (${item.farmerPhone})` : ''}</td>
												<td className="px-4 py-3">{item.location || '—'}</td>
											</tr>
										))
									)}
								</tbody>
							</table>
							</div>
						</div>

					{/* Mobile cards */}
					<div className="mt-6 grid md:hidden grid-cols-1 gap-4">
						{loading ? (
							<div className="card-base p-4 shadow-lg text-center text-neutral-500">Loading...</div>
						) : filteredAndSorted.length === 0 ? (
							<div className="card-base p-4 shadow-lg text-center text-neutral-500">No listings available</div>
						) : (
							filteredAndSorted.map((item) => (
								<div key={item.id} className={`card-base p-4 shadow-lg ${newRowIdsRef.current.has(item.id) ? 'fade-in' : ''}`} onAnimationEnd={() => { newRowIdsRef.current.delete(item.id) }}>
									<div className="flex items-start justify-between">
										<div>
											<div className="text-base font-semibold text-neutral-900">{item.crop || item.name}</div>
											<div className="text-sm text-neutral-600">{item.location || '—'}</div>
										</div>
										<div className="text-green-700 font-semibold">₹{item.minPrice ?? item.price}</div>
									</div>
									<div className="mt-2 flex gap-4 text-sm text-neutral-700">
										<div><span className="font-medium">Qty:</span> {item.quantity ?? '-'}</div>
										<div><span className="font-medium">Unit:</span> {item.unit || 'kg'}</div>
									</div>
									<div className="mt-2 text-sm text-neutral-700">
										<div><span className="font-medium">Seller:</span> {item.farmerName || '—'}</div>
										<div><span className="font-medium">Phone:</span> {item.farmerPhone || '—'}</div>
									</div>
								</div>
							))
						)}
					</div>

					<h2 className="mt-10 text-2xl font-bold text-green-800">Latest Bids</h2>
					{/* Desktop table */}
					<div className="mt-4 card-base overflow-hidden p-6 shadow-lg hidden md:block">
						<div className="overflow-x-auto">
							<table className="min-w-full text-sm" aria-label="Latest bids">
								<caption className="sr-only">Latest Bids</caption>
								<thead className="bg-[--color-agri-beige] text-neutral-700 font-semibold">
									<tr>
										<th scope="col" className="px-4 py-2 text-left">Crop</th>
										<th scope="col" className="px-4 py-2 text-left">Farmer</th>
										<th scope="col" className="px-4 py-2 text-left">Price (₹)</th>
										<th scope="col" className="px-4 py-2 text-left">Quantity</th>
										<th scope="col" className="px-4 py-2 text-left">Location</th>
										<th scope="col" className="px-4 py-2 text-left">Contact</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-neutral-200">
									{bids.length === 0 ? (
										<tr>
											<td colSpan="6" className="px-4 py-6 text-center text-neutral-500">No bids yet</td>
										</tr>
									) : (
										bids.map((b) => (
											<tr key={b.id} className="hover:bg-neutral-50">
												<td className="px-4 py-3 font-medium">{b.crop}</td>
												<td className="px-4 py-3">{b.farmerName || '—'}</td>
												<td className="px-4 py-3 text-green-700 font-semibold">{b.price}</td>
												<td className="px-4 py-3">{b.quantity}</td>
												<td className="px-4 py-3">{b.address || '—'}</td>
												<td className="px-4 py-3">
													{showContactId === b.id ? (
														<div className="text-sm">
															<div>{b.phone}</div>
															<div className="text-neutral-600">{b.address}</div>
														</div>
													) : (
														<button onClick={()=>setShowContactId(b.id)} aria-expanded={showContactId === b.id} className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition shadow-md">Contact</button>
													)}
												</td>
											</tr>
										))
									)}
								</tbody>
							</table>
							</div>
						</div>

					{/* Mobile cards */}
					<div className="mt-4 grid md:hidden grid-cols-1 gap-4">
						{bids.length === 0 ? (
							<div className="card-base p-4 shadow-lg text-center text-neutral-500">No bids yet</div>
						) : (
							bids.map((b) => (
								<div key={b.id} className="card-base p-4 shadow-lg">
									<div className="flex items-start justify-between">
										<div>
											<div className="text-base font-semibold">{b.crop}</div>
											<div className="text-sm text-neutral-600">{b.address || '—'}</div>
										</div>
										<div className="text-green-700 font-semibold">₹{b.price}</div>
									</div>
									<div className="mt-2 flex gap-4 text-sm text-neutral-700">
										<div><span className="font-medium">Farmer:</span> {b.farmerName || '—'}</div>
										<div><span className="font-medium">Qty:</span> {b.quantity}</div>
									</div>
									<div className="mt-3">
										{showContactId === b.id ? (
											<div className="text-sm">
												<div>{b.phone}</div>
												<div className="text-neutral-600">{b.address}</div>
											</div>
										) : (
											<button onClick={()=>setShowContactId(b.id)} aria-expanded={showContactId === b.id} className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition shadow-md w-full">Contact</button>
										)}
									</div>
								</div>
							))
						)}
					</div>
					</div>
			</main>
			<Footer />
		</div>
	)
}

export default BuyerDashboard


