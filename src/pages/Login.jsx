import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

function Login() {
	return (
		<div className="min-h-screen flex flex-col">
			<Navbar />
			<main className="flex-1">
				<div className="mx-auto max-w-md px-4 py-16">
					<h1 className="text-3xl font-bold text-neutral-900">Login</h1>
					<form className="mt-6 space-y-4 card-base p-6">
						<input type="email" placeholder="Email" className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[--color-agri-green]" />
						<input type="password" placeholder="Password" className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[--color-agri-green]" />
						<button className="btn-primary w-full">Sign In</button>
					</form>
				</div>
			</main>
			<Footer />
		</div>
	)
}

export default Login


