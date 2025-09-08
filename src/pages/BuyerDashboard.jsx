import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import ListingCard from '../components/ListingCard.jsx'

function BuyerDashboard() {
	return (
		<div className="min-h-screen flex flex-col">
			<Navbar />
			<main className="flex-1">
				<div className="mx-auto max-w-7xl px-4 py-12">
					<h1 className="text-3xl font-bold text-neutral-900">Browse Listings</h1>
					<div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						<ListingCard title="Fresh Tomatoes" price={18} />
						<ListingCard title="Organic Potatoes" price={22} />
						<ListingCard title="Wheat" price={24} />
					</div>
				</div>
			</main>
			<Footer />
		</div>
	)
}

export default BuyerDashboard


