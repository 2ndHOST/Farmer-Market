import { useState } from 'react'
import { Link } from 'react-router-dom'

function Navbar() {
	const [open, setOpen] = useState(false)
	return (
		<header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow">
			<div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
				<Link to="/" className="flex items-center gap-2 font-extrabold text-xl text-[--color-agri-green]">
					<span className="text-2xl">🌱</span>
					<span>AgriConnect</span>
				</Link>
				<nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-neutral-700">
					<Link to="/" className="hover:text-[--color-agri-green]">Home</Link>
					<Link to="/prices" className="hover:text-[--color-agri-green]">Price Board</Link>
					<a href="#about" className="hover:text-[--color-agri-green]">About</a>
					<a href="#contact" className="hover:text-[--color-agri-green]">Contact</a>
					<Link to="/login" className="btn-primary px-4 py-2 text-sm">Login</Link>
				</nav>
				<button aria-label="Toggle Menu" className="sm:hidden p-2 rounded-md hover:bg-neutral-100" onClick={() => setOpen((v) => !v)}>
					<span className="i-heroicons-bars-3 text-2xl">≡</span>
				</button>
			</div>
			{open && (
				<div className="sm:hidden border-t border-neutral-200">
					<div className="px-4 py-3 flex flex-col gap-3 text-sm font-medium">
						<Link to="/" onClick={() => setOpen(false)} className="hover:text-[--color-agri-green]">Home</Link>
						<Link to="/prices" onClick={() => setOpen(false)} className="hover:text-[--color-agri-green]">Price Board</Link>
						<a href="#about" onClick={() => setOpen(false)} className="hover:text-[--color-agri-green]">About</a>
						<a href="#contact" onClick={() => setOpen(false)} className="hover:text-[--color-agri-green]">Contact</a>
						<Link to="/login" onClick={() => setOpen(false)} className="btn-primary text-center py-2">Login</Link>
					</div>
				</div>
			)}
		</header>
	)
}

export default Navbar


