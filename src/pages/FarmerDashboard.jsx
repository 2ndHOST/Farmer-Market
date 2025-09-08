import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import ListingCard from '../components/ListingCard.jsx'
import { useEffect, useState } from 'react'
import BidModal from '../components/BidModal.jsx'
import SellModal from '../components/SellModal.jsx'

function FarmerDashboard() {
	const [open, setOpen] = useState(false)
	const [sellOpen, setSellOpen] = useState(false)
	const [successMsg, setSuccessMsg] = useState('')
	const [items, setItems] = useState([])

	async function fetchListings() {
		try {
			const res = await fetch('http://localhost:3000/listings')
			const data = await res.json()
			setItems(Array.isArray(data) ? data : [])
		} catch {}
	}

	useEffect(() => { fetchListings() }, [])
	return (
		<div className="min-h-screen flex flex-col">
			<Navbar />
			<main className="flex-1">
				<div className="mx-auto max-w-7xl px-4 py-12">
					<div className="flex items-center justify-between">
						<h1 className="text-3xl font-bold text-neutral-900">My Listings</h1>
						<button onClick={() => { setSellOpen(true); setSuccessMsg('') }} className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition shadow">
							<span>Sell</span>
						</button>
					</div>
					{successMsg ? (
						<div className="mt-4 rounded-lg bg-green-50 text-green-700 px-4 py-2 border border-green-200">{successMsg}</div>
					) : null}
					<div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{items.map(item => (
							<ListingCard key={item.id} title={item.crop} price={item.minPrice} onClick={() => setOpen(true)} />
						))}
						{items.length === 0 ? (
							<div className="text-neutral-500">No listings yet. Use Sell to add one.</div>
						) : null}
					</div>
				</div>
			</main>
			<Footer />
			<BidModal open={open} onClose={() => setOpen(false)} onSubmit={() => setOpen(false)} />
			<SellModal open={sellOpen} onClose={() => setSellOpen(false)} onSuccess={() => { setSuccessMsg('Item listed successfully.'); fetchListings() }} />
		</div>
	)
}

export default FarmerDashboard


