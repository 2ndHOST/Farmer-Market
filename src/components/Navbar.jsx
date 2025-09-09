import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth.js'
import { useLanguage } from '../contexts/LanguageContext'
import { Languages } from 'lucide-react'

function Navbar() {
	const [open, setOpen] = useState(false)
	const [query, setQuery] = useState('')
	const navigate = useNavigate()
	const { user } = useAuth()
	const { t, toggleLanguage, isHindi } = useLanguage()

	function onSearch(e) {
		e.preventDefault()
		if (!query.trim()) return
		navigate('/prices')
	}

	return (
		<header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow">
			<div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
				<Link to="/" className="flex items-center gap-2 font-extrabold text-xl text-[--color-agri-green]">
					<span className="text-2xl">🌱</span>
					<span>AgriConnect</span>
				</Link>
				<nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-neutral-700">
					<Link to="/" className="hover:text-[--color-agri-green]">{t('navigation.home')}</Link>
					<Link to="/prices" className="hover:text-[--color-agri-green]">{t('navigation.market')}</Link>
					<Link to="/equipment" className="hover:text-[--color-agri-green]">{t('navigation.equipmentRental')}</Link>
					<a href="#community" className="hover:text-[--color-agri-green]">{t('navigation.community')}</a>
					<a href="#contact" className="hover:text-[--color-agri-green]">{t('navigation.contact')}</a>

					<form onSubmit={onSearch} className="ml-2">
						<label htmlFor="nav-search" className="sr-only">Search</label>
						<input id="nav-search" type="search" value={query} onChange={(e)=>setQuery(e.target.value)} placeholder={t('navigation.searchPlaceholder')} className="rounded-xl border border-neutral-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[--color-agri-green]" />
					</form>

					{/* Language Toggle Button */}
					<button
						onClick={toggleLanguage}
						className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 text-gray-700 shadow-md hover:bg-gray-200 transition"
						title={isHindi ? 'Switch to English' : 'हिंदी में बदलें'}
						aria-label="Toggle Language"
					>
						<Languages className="h-4 w-4" />
					</button>

					{user ? (
						<button className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-green-700 text-white shadow-md hover:bg-green-800 transition" title={user.name || user.phone} aria-label="Profile">
							<span className="text-lg">👤</span>
						</button>
					) : (
						<Link to="/login" className="inline-flex items-center justify-center rounded-lg bg-green-700 text-white shadow-md px-4 py-2 sm:px-3 sm:py-1 md:px-4 md:py-2 hover:bg-green-800 transition text-sm">{t('navigation.login')}</Link>
					)}
				</nav>
				<button aria-label="Toggle Menu" className="sm:hidden p-2 rounded-md hover:bg-neutral-100" onClick={() => setOpen((v) => !v)}>
					<span className="i-heroicons-bars-3 text-2xl">≡</span>
				</button>
			</div>
			{open && (
				<div className="sm:hidden border-t border-neutral-200">
					<div className="px-4 py-3 flex flex-col gap-3 text-sm font-medium">
						<Link to="/" onClick={() => setOpen(false)} className="hover:text-[--color-agri-green]">{t('navigation.home')}</Link>
						<Link to="/prices" onClick={() => setOpen(false)} className="hover:text-[--color-agri-green]">{t('navigation.market')}</Link>
						<Link to="/equipment" onClick={() => setOpen(false)} className="hover:text-[--color-agri-green]">{t('navigation.equipmentRental')}</Link>
						<a href="#community" onClick={() => setOpen(false)} className="hover:text-[--color-agri-green]">{t('navigation.community')}</a>
						<a href="#contact" onClick={() => setOpen(false)} className="hover:text-[--color-agri-green]">{t('navigation.contact')}</a>

						<form onSubmit={onSearch} className="flex gap-2">
							<label htmlFor="m-search" className="sr-only">Search</label>
							<input id="m-search" value={query} onChange={(e)=>setQuery(e.target.value)} placeholder={t('navigation.searchPlaceholder')} className="rounded-xl border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[--color-agri-green]" />
							<button className="rounded-lg bg-green-700 text-white px-3 py-2 shadow-md hover:bg-green-800 transition">Go</button>
						</form>

						{/* Language Toggle Button for Mobile */}
						<button
							onClick={() => {
								toggleLanguage()
								setOpen(false)
							}}
							className="inline-flex items-center justify-center gap-2 w-full rounded-lg bg-gray-100 text-gray-700 shadow-md hover:bg-gray-200 transition px-4 py-2"
							title={isHindi ? 'Switch to English' : 'हिंदी में बदलें'}
						>
							<Languages className="h-4 w-4" />
							<span>{isHindi ? 'English' : 'हिंदी'}</span>
						</button>

						{user ? (
							<button className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-700 text-white shadow-md hover:bg-green-800 transition" title={user.name || user.phone} aria-label="Profile">
								<span className="text-xl">👤</span>
							</button>
						) : (
							<Link to="/login" onClick={() => setOpen(false)} className="inline-flex items-center justify-center rounded-lg bg-green-700 text-white shadow-md px-4 py-2 hover:bg-green-800 transition text-center">{t('navigation.login')}</Link>
						)}

					</div>
				</div>
			)}
		</header>
	)
}

export default Navbar


