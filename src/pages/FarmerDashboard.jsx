import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import ListingCard from '../components/ListingCard.jsx'
import { useState } from 'react'
import BidModal from '../components/BidModal.jsx'

function FarmerDashboard() {
	const [open, setOpen] = useState(false)
	return (
		<div className="min-h-screen flex flex-col">
			<Navbar />
			<main className="flex-1">
				<div className="mx-auto max-w-7xl px-4 py-12">
					<h1 className="text-3xl font-bold text-neutral-900">My Listings</h1>
					<div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						<ListingCard title="Fresh Tomatoes" price={18} onClick={() => setOpen(true)} />
						<ListingCard title="Organic Potatoes" price={22} onClick={() => setOpen(true)} />
						<ListingCard title="Wheat" price={24} onClick={() => setOpen(true)} />
					</div>
				</div>
			</main>
			<Footer />
			<BidModal open={open} onClose={() => setOpen(false)} onSubmit={() => setOpen(false)} />
		</div>
	)
}

export default FarmerDashboard


