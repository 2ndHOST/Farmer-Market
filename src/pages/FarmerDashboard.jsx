import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import ListingCard from '../components/ListingCard.jsx'
import { useEffect, useState } from 'react'
import BidModal from '../components/BidModal.jsx'
import SellModal from '../components/SellModal.jsx'
import { useLocation } from '../contexts/LocationContext'
import { MapPin, Settings } from 'lucide-react'

function FarmerDashboard() {
	const [open, setOpen] = useState(false)
	const [sellOpen, setSellOpen] = useState(false)
	const [successMsg, setSuccessMsg] = useState('')
	const [items, setItems] = useState([])
	const { location, radius, isLocationSet } = useLocation()

	// Helper function to get API base URL with fallbacks
	function getApiBaseUrl() {
		if (import.meta?.env?.VITE_API_URL) {
			return import.meta.env.VITE_API_URL
		}
		return 'http://localhost:3000'
	}

	async function fetchListings() {
		try {
			const res = await fetch(`${getApiBaseUrl()}/listings`)
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
					<div className="flex items-center justify-between mb-6">
						<h1 className="text-3xl font-bold text-neutral-900">My Listings</h1>
						<div className="flex items-center gap-4">
							{isLocationSet && (
								<div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg">
									<MapPin className="h-4 w-4 text-green-600" />
									<span className="text-sm text-green-800">
										{location.address} ({radius}km radius)
									</span>
								</div>
							)}
							<button onClick={() => { setSellOpen(true); setSuccessMsg('') }} className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition shadow">
								<span>Sell</span>
							</button>
						</div>
					</div>
					
					{!isLocationSet && (
						<div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
							<div className="flex items-center gap-2">
								<Settings className="h-5 w-5 text-yellow-600" />
								<div>
									<p className="text-yellow-800 font-medium">Set your location to see nearby buyers and equipment</p>
									<p className="text-yellow-700 text-sm">Go to the <a href="/" className="underline">Home page</a> to set your area radius</p>
								</div>
							</div>
						</div>
					)}
					{successMsg ? (
						<div className="mt-4 rounded-lg bg-green-50 text-green-700 px-4 py-2 border border-green-200">{successMsg}</div>
					) : null}
					<div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{items.map(item => (
							<ListingCard key={item.id} title={item.crop} price={item.minPrice} sellerName={item.farmerName} sellerPhone={item.farmerPhone} onClick={() => setOpen(true)} />
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


