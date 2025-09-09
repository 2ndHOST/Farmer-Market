import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import LocationRangeSetup from '../components/LocationRangeSetup.jsx'
import { useEffect, useMemo, useState } from 'react'
import { api } from '../utils/api.js'
import { useLocation } from '../contexts/LocationContext'
import { useLocationRange } from '../contexts/LocationRangeContext'
import { useLanguage } from '../contexts/LanguageContext'
import { filterByLocation, addDistanceToItems, sortByDistance, formatDistance } from '../utils/locationUtils.js'
import { MapPin, Settings, Plus } from 'lucide-react'
import AddEquipmentModal from '../components/AddEquipmentModal.jsx'

function TypeIcon({ type }) {
  const base = 'h-6 w-6 text-[--color-agri-green]'
  switch (type) {
    case 'tractor':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M4 17a3 3 0 1 0 6 0M14 17a3 3 0 1 0 6 0"/><path d="M2 17h2m4 0h6m0 0h2m0 0h2M8 17V7h6l2 4"/></svg>
      )
    case 'pump':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M7 7h10v10H7z"/><path d="M12 2v5M12 17v5"/></svg>
      )
    case 'rotavator':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M4 12h4M16 12h4M12 4v4M12 16v4"/></svg>
      )
    case 'custom':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
      )
    default:
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M4 12h4M16 12h4M12 4v4M12 16v4"/></svg>
      )
  }
}

function EquipmentCard({ item, onRequest }) {
	const { t } = useLanguage()
	
	return (
		<div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
			{item.imageUrl ? (
				<img src={item.imageUrl} alt={item.title} className="h-40 w-full object-cover rounded-lg" />
			) : (
				<div className="h-40 w-full rounded-lg bg-green-50" />
			)}
			<div className="mt-4 flex items-center gap-2">
				<TypeIcon type={item.type} />
				<h3 className="text-xl font-semibold text-green-800">{item.title}</h3>
			</div>
			<div className="flex items-center justify-between">
				<p className="text-sm text-neutral-600">{item.location}</p>
				{item.distance !== null && (
					<p className="text-xs text-green-600 font-medium">
						{formatDistance(item.distance)} {t('equipmentRental.away')}
					</p>
				)}
			</div>
			<div className="mt-3 space-y-1">
				{item.rentPerDay != null && (
					<div className="text-sm"><span className="font-medium">{t('equipmentRental.rent')}</span> ₹ {item.rentPerDay} / {t('equipmentRental.perDay')}</div>
				)}
				<div className="text-sm"><span className="font-medium">{t('equipmentRental.barter')}</span> {item.barter ? t('equipmentRental.barterAvailable') : t('equipmentRental.barterNotAvailable')}</div>
			</div>
			<button onClick={() => onRequest(item)} className="mt-4 bg-green-700 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-800">{t('equipmentRental.requestRental')}</button>
		</div>
	)
}

function EquipmentRentalPage() {
	const [items, setItems] = useState([])
	const [loading, setLoading] = useState(true)
	const [onlyBarter, setOnlyBarter] = useState(false)
	const [active, setActive] = useState(null) // equipment selected
	const [mode, setMode] = useState('money')
	const [days, setDays] = useState('')
	const [barterType, setBarterType] = useState('produce')
	const [description, setDescription] = useState('')
	const [contact, setContact] = useState('')
	const [showAddModal, setShowAddModal] = useState(false)
	const [showLocationSetup, setShowLocationSetup] = useState(false)
	const { location, radius, isLocationSet } = useLocation()
	const { buyerLocation, isWithinDeliveryRange, getCoordinatesFromLocation } = useLocationRange()
	const { t } = useLanguage()
	
	const filtered = useMemo(() => {
		let data = Array.isArray(items) ? items : []
		
		// Filter by barter option
		if (onlyBarter) {
			data = data.filter(e => !!e.barter)
		}
		
		// Filter by location using LocationRangeContext if buyer location is set
		if (buyerLocation.isSet && buyerLocation.latitude && buyerLocation.longitude) {
			// Add mock location data to equipment for demo
			const itemsWithLocation = data.map(item => ({
				...item,
				lat: 19.0760 + (Math.random() - 0.5) * 0.2, // Mock coordinates around Mumbai
				lng: 72.8777 + (Math.random() - 0.5) * 0.2
			}))
			
			const buyerLoc = {
				lat: buyerLocation.latitude,
				lng: buyerLocation.longitude
			}
			
			data = filterByLocation(itemsWithLocation, buyerLoc, buyerLocation.searchRadius)
			data = addDistanceToItems(data, buyerLoc)
			data = sortByDistance(data)
		}
		// Fallback to old LocationContext if new one isn't set
		else if (isLocationSet && location) {
			// Add mock location data to equipment for demo
			const itemsWithLocation = data.map(item => ({
				...item,
				lat: 19.0760 + (Math.random() - 0.5) * 0.2, // Mock coordinates around Mumbai
				lng: 72.8777 + (Math.random() - 0.5) * 0.2
			}))
			
			data = filterByLocation(itemsWithLocation, location, radius)
			data = addDistanceToItems(data, location)
			data = sortByDistance(data)
		}
		
		return data
	}, [items, onlyBarter, location, radius, isLocationSet, buyerLocation])

	useEffect(() => {
		let mounted = true
		;(async () => {
			const res = await api.get('/equipment')
			if (mounted) setItems(Array.isArray(res?.data) ? res.data : [])
			setLoading(false)
		})()
		const unsub = api.subscribe?.('equipment', (next) => setItems(Array.isArray(next) ? next : []))
		return () => { unsub && unsub() }
	}, [])

	async function submitRequest() {
		if (!active) return
		const payload = { equipmentId: active.id, mode }
		if (mode === 'money') { payload.days = Number(days) || 1 }
		else { payload.barterType = barterType; payload.description = description }
		payload.contact = contact
		const { data } = await api.post('/rental-request', payload)
		setActive(null)
		setMode('money'); setDays(''); setBarterType('produce'); setDescription(''); setContact('')
		alert('Request sent')
	}

	function handleAddEquipment(newEquipment) {
		// Add new equipment to the local state
		setItems(prev => [newEquipment, ...prev])
		
		// For future backend integration, you would make an API call here:
		// await api.post('/equipment', newEquipment)
		
		console.log('New equipment added:', newEquipment)
	}

	function request(item) { setActive(item) }
	return (
		<div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-green-100">
			<Navbar />
			<main className="flex-1">
				<div className="mx-auto max-w-7xl px-4 py-12">
					{/* Header */}
					<div className="flex items-center justify-between mb-6">
						<div>
							<h1 className="text-3xl font-bold text-gray-900 mb-2">{t('equipmentRental.title')}</h1>
							<p className="text-gray-600">{t('equipmentRental.subtitle')}</p>
							{buyerLocation.isSet && (
								<div className="flex items-center gap-2 mt-2 text-sm text-blue-700 bg-blue-50 px-3 py-1 rounded-full w-fit">
									<MapPin className="h-4 w-4" />
									<span>Searching within {buyerLocation.searchRadius}km of {buyerLocation.city}, {buyerLocation.state}</span>
								</div>
							)}
						</div>
						<div className="flex items-center gap-4">
							<button 
								onClick={() => setShowLocationSetup(!showLocationSetup)}
								className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
							>
								<Settings className="h-4 w-4" />
								{buyerLocation.isSet ? 'Update Location' : 'Set Location'}
							</button>
							<button
								onClick={() => setShowAddModal(true)}
								className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-800 transition-colors"
							>
								<Plus className="h-4 w-4" />
								<span>{t('equipmentRental.addEquipment')}</span>
							</button>
						</div>
					</div>

					{/* Location Range Setup */}
					{(!buyerLocation.isSet || showLocationSetup) && (
						<div className="mb-8">
							<LocationRangeSetup 
								isBuyer={true}
								isOnboarding={!buyerLocation.isSet}
								onComplete={() => setShowLocationSetup(false)}
							/>
						</div>
					)}
					
					{!buyerLocation.isSet && !isLocationSet && (
						<div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
							<div className="flex items-center gap-2">
								<Settings className="h-5 w-5 text-yellow-600" />
								<div>
									<p className="text-yellow-800 font-medium">Set your location to find nearby equipment</p>
									<p className="text-yellow-700 text-sm">Click "Set Location" above to configure your search area and see distance-based results.</p>
								</div>
							</div>
						</div>
					)}
					
					<div className="mt-4 card-base p-4">
						<label className="inline-flex items-center gap-2 text-sm">
							<input type="checkbox" className="h-4 w-4" checked={onlyBarter} onChange={e=>setOnlyBarter(e.target.checked)} />
							<span>{t('equipmentRental.showBarterOnly')}</span>
						</label>
					</div>
					<div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{loading ? (
							<div className="col-span-full text-center text-neutral-600">{t('common.loading')}</div>
						) : filtered.length === 0 ? (
							<div className="col-span-full text-center py-8">
								<div className="text-gray-500 mb-4">
									{buyerLocation.isSet 
										? "No equipment found within your search radius." 
										: t('equipmentRental.noEquipmentFound')
									}
								</div>
								{buyerLocation.isSet && (
									<button 
										onClick={() => {
											// Expand search radius by 50km
											const newRadius = buyerLocation.searchRadius + 50
											console.log(`Expanding search radius to ${newRadius}km`)
											// This would call updateBuyerLocation with expanded radius
										}}
										className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
									>
										Expand search to {buyerLocation.searchRadius + 50}km radius
									</button>
								)}
							</div>
						) : (
							filtered.map((it) => (
								<EquipmentCard key={it.id} item={it} onRequest={request} />
							))
						)}
					</div>
				</div>
			</main>
			<Footer />

			{/* Request Modal */}
			{active && (
				<div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50" role="dialog" aria-modal="true">
					<div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
						<div className="flex items-start justify-between">
							<h2 className="text-xl font-semibold text-green-800">{t('equipmentRental.requestRental')}</h2>
							<button className="text-neutral-500" onClick={()=>setActive(null)} aria-label="Close">✕</button>
						</div>
						<p className="mt-1 text-sm text-neutral-600">{active.title} — {active.location}</p>
						<div className="mt-4 space-y-3">
							<div className="flex items-center gap-4">
								<label className="inline-flex items-center gap-2">
									<input type="radio" name="mode" value="money" checked={mode==='money'} onChange={()=>setMode('money')} />
									<span>{t('equipmentRental.payWithMoney')}</span>
								</label>
								{active.rentPerDay == null && <span className="text-xs text-neutral-500">{t('equipmentRental.notAvailable')}</span>}
							</div>
							{mode==='money' && active.rentPerDay != null && (
								<div className="grid grid-cols-2 gap-3">
									<div className="text-sm text-neutral-700">₹ {active.rentPerDay} {t('equipmentRental.perDay')}</div>
									<input value={days} onChange={e=>setDays(e.target.value)} placeholder={t('equipmentRental.numberOfDays')} inputMode="numeric" className="rounded-lg border border-neutral-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
								</div>
							)}

							<div className="flex items-center gap-4">
								<label className="inline-flex items-center gap-2">
									<input type="radio" name="mode" value="barter" checked={mode==='barter'} onChange={()=>setMode('barter')} />
									<span>{t('equipmentRental.barterOption')}</span>
								</label>
								{!active.barter && <span className="text-xs text-neutral-500">{t('equipmentRental.notAvailable')}</span>}
							</div>
							{mode==='barter' && active.barter && (
								<div className="grid grid-cols-1 gap-3">
									<select value={barterType} onChange={e=>setBarterType(e.target.value)} className="rounded-lg border border-neutral-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
										<option value="produce">Produce</option>
										<option value="services">Services</option>
										<option value="other">Other</option>
									</select>
									<textarea value={description} onChange={e=>setDescription(e.target.value)} rows="3" placeholder={t('equipmentRental.describeOffer')} className="rounded-lg border border-neutral-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
								</div>
							)}

							<div className="grid grid-cols-1 gap-3">
								<input value={contact} onChange={e=>setContact(e.target.value)} placeholder={t('equipmentRental.yourContact')} className="rounded-lg border border-neutral-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
							</div>
						</div>
						<div className="mt-6 flex justify-end gap-3">
							<button className="px-4 py-2 rounded-lg border border-neutral-300" onClick={()=>setActive(null)}>{t('common.cancel')}</button>
							<button className="bg-green-700 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-800" onClick={submitRequest}>{t('equipmentRental.sendRequest')}</button>
						</div>
					</div>
				</div>
			)}
			
			{/* Add Equipment Modal */}
			<AddEquipmentModal
				isOpen={showAddModal}
				onClose={() => setShowAddModal(false)}
				onSubmit={handleAddEquipment}
			/>
		</div>
	)
}

export default EquipmentRentalPage


