import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { useState } from 'react'

function Hero() {
	return (
		<section id="home" className="relative overflow-hidden">
			<div className="absolute inset-0 bg-gradient-to-b from-green-50 via-[--color-agri-beige] to-white" aria-hidden="true" />
			<div className="relative mx-auto max-w-7xl px-4 py-16 sm:py-20 md:py-24">
				<div className="max-w-3xl">
					<h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-neutral-900">
						Direct connection between farmers & buyers. Fair prices. No middlemen.
					</h1>
					<p className="mt-4 text-lg sm:text-xl text-neutral-700">
						Empowering farmers, supporting buyers.
					</p>
					<div className="mt-8 flex flex-col sm:flex-row gap-4">
						<a href="/farmer" className="btn-primary text-base sm:text-lg">
							I am a Farmer 👨‍🌾
						</a>
						<a href="/buyer" className="btn-primary text-base sm:text-lg !bg-emerald-600 hover:!bg-emerald-700">
							I am a Buyer 🛒
						</a>
					</div>
				</div>

				<div className="pointer-events-none absolute -right-10 -bottom-10 h-64 w-64 sm:h-80 sm:w-80 opacity-20">
					<div className="h-full w-full bg-[radial-gradient(circle_at_30%_30%,#86efac_0,transparent_60%),radial-gradient(circle_at_70%_70%,#a7f3d0_0,transparent_55%)]" />
				</div>
			</div>
		</section>
	)
}

function Benefits() {
	return (
		<section className="mx-auto max-w-7xl px-4 py-12 sm:py-16" aria-labelledby="why">
			<h2 id="why" className="text-3xl sm:text-4xl font-bold text-neutral-900">Why AgriConnect?</h2>
			<div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="card-base p-6">
					<div className="flex items-start gap-4">
						<div className="text-3xl">👨‍🌾</div>
						<div>
							<h3 className="text-xl font-semibold text-neutral-900">For Farmers</h3>
							<p className="mt-1 text-neutral-700">Sell directly to buyers, get better prices, avoid middlemen.</p>
						</div>
					</div>
				</div>
				<div className="card-base p-6">
					<div className="flex items-start gap-4">
						<div className="text-3xl">🛒</div>
						<div>
							<h3 className="text-xl font-semibold text-neutral-900">For Buyers</h3>
							<p className="mt-1 text-neutral-700">Buy fresh produce, transparent pricing, support farmers.</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

function HowItWorks() {
	const steps = [
		{ icon: '📋', title: 'Step 1', text: 'Farmer lists crops.' },
		{ icon: '💰', title: 'Step 2', text: 'Buyers place bids.' },
		{ icon: '🤝', title: 'Step 3', text: 'Deal is finalized.' },
	]
	return (
		<section className="mx-auto max-w-7xl px-4 py-12 sm:py-16" aria-labelledby="how">
			<h2 id="how" className="text-3xl sm:text-4xl font-bold text-neutral-900">How It Works</h2>
			<div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{steps.map((s, idx) => (
					<div key={idx} className="card-base p-6 group hover:-translate-y-0.5 transform transition">
						<div className="text-4xl">{s.icon}</div>
						<h3 className="mt-3 text-xl font-semibold text-neutral-900">{s.title}</h3>
						<p className="mt-1 text-neutral-700">{s.text}</p>
					</div>
				))}
			</div>
		</section>
	)
}

function Landing() {
	return (
		<div className="min-h-screen flex flex-col">
			<Navbar />
			<main className="flex-1">
				<Hero />
				<Benefits />
				<HowItWorks />
			</main>
			<Footer />
		</div>
	)
}

export default Landing


