import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import BidModal from '../components/BidModal.jsx'
import { api } from '../utils/api.js'

function PriceBoardPage() {
	const [listings, setListings] = useState([])
	const [loading, setLoading] = useState(true)
	const [selected, setSelected] = useState(null)
	const [open, setOpen] = useState(false)

	useEffect(() => {
		let mounted = true
		;(async () => {
			try {
				const res = await api.get('/listings')
				const data = res?.data || []
				if (mounted) setListings(Array.isArray(data) ? data : [])
			} catch (e) {
				// fallback demo data
				if (mounted) setListings([
					{ id: '1', crop: 'Tomato', unit: 'kg', quantity: 120, minPrice: 18, farmerName: 'Farmer A' },
					{ id: '2', crop: 'Potato', unit: 'kg', quantity: 200, minPrice: 22, farmerName: 'Farmer B' },
					{ id: '3', crop: 'Onion', unit: 'kg', quantity: 150, minPrice: 32, farmerName: 'Farmer C' },
				])
			}
			finally {
				if (mounted) setLoading(false)
			}
		})()
		return () => { mounted = false }
	}, [])

	function openBid(listing) {
		setSelected(listing)
		setOpen(true)
	}

	async function submitBid({ amount }) {
		if (!selected) return
		try {
			await api.post(`/bids/${selected.id}`, { amount: Number(amount) })
			alert('Bid submitted successfully')
		} catch (e) {
			alert('Failed to submit bid')
		} finally {
			setOpen(false)
			setSelected(null)
		}
	}

	return (
		<div className="min-h-screen flex flex-col">
			<Navbar />
			<main className="flex-1">
				<div className="mx-auto max-w-7xl px-4 py-12">
					<h1 className="text-3xl font-bold text-neutral-900">Price Board</h1>
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
									) : listings.length === 0 ? (
										<tr>
											<td colSpan="6" className="px-4 py-6 text-center text-neutral-500">No listings available</td>
										</tr>
									) : (
										listings.map((item) => (
											<tr key={item.id} className="hover:bg-neutral-50">
												<td className="px-4 py-3 font-medium text-neutral-900">{item.crop || item.name}</td>
												<td className="px-4 py-3">{item.unit || 'kg'}</td>
												<td className="px-4 py-3">{item.quantity ?? '-'}</td>
												<td className="px-4 py-3 text-[--color-agri-green] font-semibold">{item.minPrice ?? item.price}</td>
												<td className="px-4 py-3">{item.farmerName || '—'}</td>
												<td className="px-4 py-3">
													<button onClick={() => openBid(item)} className="btn-primary">Place Bid</button>
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
			<BidModal open={open} onClose={() => setOpen(false)} onSubmit={submitBid} />
		</div>
	)
}

export default PriceBoardPage


