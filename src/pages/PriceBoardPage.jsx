import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import PriceBoard from '../components/PriceBoard.jsx'

function PriceBoardPage() {
	return (
		<div className="min-h-screen flex flex-col">
			<Navbar />
			<main className="flex-1">
				<div className="mx-auto max-w-7xl px-4 py-12">
					<h1 className="text-3xl font-bold text-neutral-900">Price Board</h1>
					<div className="mt-6">
						<PriceBoard />
					</div>
				</div>
			</main>
			<Footer />
		</div>
	)
}

export default PriceBoardPage


