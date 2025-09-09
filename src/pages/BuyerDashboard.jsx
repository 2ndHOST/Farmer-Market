import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import LocationRangeSetup from '../components/LocationRangeSetup.jsx'
import { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { useLocationRange } from '../contexts/LocationRangeContext'
import { MapPin, Settings } from 'lucide-react'

function BuyerDashboard() {
	const [requirements, setRequirements] = useState([])
	const [loading, setLoading] = useState(true)
	const [showDetailsId, setShowDetailsId] = useState(null)
	const [showForm, setShowForm] = useState(false)
	const [formData, setFormData] = useState({
		productType: '',
		quantity: '',
		qualityGrade: '',
		deliveryDeadline: '',
		deliveryLocation: '',
		budgetRange: '',
		specialRequirements: ''
	})
	const [showLocationSetup, setShowLocationSetup] = useState(false)
	const { t } = useLanguage()
	const { buyerLocation, isWithinDeliveryRange, getCoordinatesFromLocation } = useLocationRange()

	// Filter farmers based on delivery range
	const filterFarmersByDeliveryRange = async (farmers, buyerLoc) => {
		if (!buyerLoc || !buyerLoc.latitude || !buyerLoc.longitude) {
			return farmers // Return all farmers if buyer location not set
		}

		const filteredFarmers = []
		for (const farmer of farmers) {
			try {
				const farmerCoords = await getCoordinatesFromLocation(farmer.location)
				const isWithinRange = isWithinDeliveryRange(
					farmerCoords.lat,
					farmerCoords.lon,
					farmer.deliveryRadius || 50, // Default 50km if not specified
					buyerLoc.latitude,
					buyerLoc.longitude
				)
				if (isWithinRange) {
					filteredFarmers.push(farmer)
				}
			} catch (error) {
				// If we can't get coordinates, include the farmer
				filteredFarmers.push(farmer)
			}
		}
		return filteredFarmers
	}

	// Helper function to get crop icon
	const getCropIcon = (cropName) => {
		const crop = cropName?.toLowerCase() || ''
		if (crop.includes('tomato')) return '🍅'
		if (crop.includes('onion')) return '🧅'
		if (crop.includes('corn') || crop.includes('maize')) return '🌽'
		if (crop.includes('rice') || crop.includes('wheat')) return '🌾'
		if (crop.includes('potato')) return '🥔'
		if (crop.includes('carrot')) return '🥕'
		if (crop.includes('pepper') || crop.includes('chili')) return '🌶️'
		return '🌱' // default
	}

	// Helper function to get status badge styling
	const getStatusBadge = (status) => {
		switch (status?.toLowerCase()) {
			case 'approved':
				return { bg: 'bg-green-100', text: 'text-green-800', icon: '🟢' }
			case 'in transit':
				return { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: '🟡' }
			case 'pending':
			default:
				return { bg: 'bg-gray-100', text: 'text-gray-800', icon: '⚪' }
		}
	}

	// Load requirements with location-based farmer matching
	useEffect(() => {
		const loadRequirements = async () => {
			setLoading(true)
			
			// Mock farmers data with locations and delivery ranges
			const mockFarmers = [
				{ id: 1, name: "Raj Patel", location: "Mumbai, Maharashtra", deliveryRadius: 50 },
				{ id: 2, name: "Priya Sharma", location: "Pune, Maharashtra", deliveryRadius: 75 },
				{ id: 3, name: "Amit Singh", location: "Delhi", deliveryRadius: 40 },
				{ id: 4, name: "Sunita Devi", location: "Jaipur, Rajasthan", deliveryRadius: 60 }
			]

			// Mock requirements data
			const mockRequirements = [
				{
					id: 1,
					cropName: "Organic Tomatoes",
					quantity: "100 kg",
					location: "Mumbai, Maharashtra",
					deliveryDate: "2025-01-15",
					farmersMatched: 5,
					price: "₹4,000",
					status: "Approved"
				},
				{
					id: 2,
					cropName: "Fresh Onions",
					quantity: "200 kg",
					location: "Pune, Maharashtra", 
					deliveryDate: "2025-01-20",
					farmersMatched: 3,
					price: "₹5,000",
					status: "In Transit"
				},
				{
					id: 3,
					cropName: "Sweet Corn",
					quantity: "50 kg",
					location: "Delhi",
					deliveryDate: "2025-01-18",
					farmersMatched: 7,
					price: "₹2,500",
					status: "Pending"
				}
			]

			// Filter farmers by delivery range and update requirements
			const filteredFarmers = await filterFarmersByDeliveryRange(mockFarmers, buyerLocation)
			const updatedRequirements = mockRequirements.map(requirement => ({
				...requirement,
				farmersMatched: filteredFarmers.filter(farmer => farmer.location === requirement.location).length
			}))

			setRequirements(updatedRequirements)
			setLoading(false)
		}
		loadRequirements()
	}, [buyerLocation])

	const handleApprove = (requirementId) => {
		setRequirements(prev => 
			prev.map(req => 
				req.id === requirementId 
					? { ...req, status: "Approved" }
					: req
			)
		)
	}

	const handleShowDetails = (requirementId) => {
		setShowDetailsId(showDetailsId === requirementId ? null : requirementId)
	}

	const handleFormInputChange = (field, value) => {
		setFormData(prev => ({
			...prev,
			[field]: value
		}))
	}

	const handleToggleForm = () => {
		setShowForm(!showForm)
		if (!showForm) {
			// Reset form when opening
			setFormData({
				productType: '',
				quantity: '',
				qualityGrade: '',
				deliveryDeadline: '',
				deliveryLocation: '',
				budgetRange: '',
				specialRequirements: ''
			})
		}
	}

	const handleCancelForm = () => {
		setShowForm(false)
		setFormData({
			productType: '',
			quantity: '',
			qualityGrade: '',
			deliveryDeadline: '',
			deliveryLocation: '',
			budgetRange: '',
			specialRequirements: ''
		})
	}

	const handleSubmitForm = (e) => {
		e.preventDefault()
		// Add new requirement to the list
		const newRequirement = {
			id: Date.now(),
			cropName: formData.productType,
			quantity: formData.quantity,
			location: formData.deliveryLocation,
			deliveryDate: formData.deliveryDeadline,
			farmersMatched: Math.floor(Math.random() * 10) + 1,
			price: formData.budgetRange,
			status: "Pending"
		}
		setRequirements(prev => [newRequirement, ...prev])
		handleCancelForm()
	}

return (
	<div className="min-h-screen flex flex-col bg-gray-50">
		<Navbar />
		<main className="flex-1">
			<div className="mx-auto max-w-7xl px-4 py-8">
				{/* Dashboard Header */}
				<div className="mb-8">
					<div className="flex items-center justify-between mb-6">
						<div>
							<h1 className="text-3xl font-bold text-gray-900 mb-2">Buyer Dashboard</h1>
							<p className="text-gray-600">Find farmers and manage your requirements.</p>
							{buyerLocation.isSet && (
								<div className="flex items-center gap-2 mt-2 text-sm text-blue-700 bg-blue-50 px-3 py-1 rounded-full w-fit">
									<MapPin className="h-4 w-4" />
									<span>Searching within {buyerLocation.searchRadius}km of {buyerLocation.city}, {buyerLocation.state}</span>
								</div>
							)}
						</div>
						<button 
							onClick={() => setShowLocationSetup(!showLocationSetup)}
							className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
						>
							<Settings className="h-4 w-4" />
							{buyerLocation.isSet ? 'Update Location' : 'Set Location'}
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

				{/* Top Section with New Requirement Button */}
				<div className="mb-8">
					<button 
						onClick={() => setShowForm(!showForm)}
						className="w-full bg-[#16a34a] text-white text-xl font-semibold py-6 px-8 rounded-xl hover:bg-green-700 transition shadow-lg"
					>
						{showForm ? 'Close Form' : '+ New Requirement'}
					</button>
				</div>

				{/* Expandable Form */}
				<div className={`transition-all duration-300 ease-in-out overflow-hidden ${showForm ? 'max-h-screen opacity-100 mb-8' : 'max-h-0 opacity-0'}`}>
					<div className="bg-white rounded-xl shadow-sm p-6">
						<h2 className="text-2xl font-bold text-gray-900 mb-6">Post New Requirement</h2>
						<form onSubmit={handleSubmitForm} className="space-y-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									{/* Product Type */}
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">Product Type</label>
										<select
											value={formData.productType}
											onChange={(e) => handleFormInputChange('productType', e.target.value)}
											className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
											required
										>
											<option value="">Select a crop</option>
											<option value="Organic Tomatoes">Organic Tomatoes</option>
											<option value="Fresh Onions">Fresh Onions</option>
											<option value="Sweet Corn">Sweet Corn</option>
											<option value="Basmati Rice">Basmati Rice</option>
											<option value="Wheat">Wheat</option>
											<option value="Potatoes">Potatoes</option>
											<option value="Carrots">Carrots</option>
											<option value="Bell Peppers">Bell Peppers</option>
										</select>
									</div>

									{/* Quantity Required */}
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">Quantity Required</label>
										<input
											type="text"
											value={formData.quantity}
											onChange={(e) => handleFormInputChange('quantity', e.target.value)}
											placeholder="e.g., 100 kg"
											className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
											required
										/>
									</div>

									{/* Quality Grade */}
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">Quality Grade</label>
										<select
											value={formData.qualityGrade}
											onChange={(e) => handleFormInputChange('qualityGrade', e.target.value)}
											className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
											required
										>
											<option value="">Select quality grade</option>
											<option value="Premium">Premium</option>
											<option value="Grade A">Grade A</option>
											<option value="Grade B">Grade B</option>
											<option value="Standard">Standard</option>
											<option value="Organic">Organic</option>
										</select>
									</div>

									{/* Delivery Deadline */}
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">Delivery Deadline</label>
										<input
											type="date"
											value={formData.deliveryDeadline}
											onChange={(e) => handleFormInputChange('deliveryDeadline', e.target.value)}
											className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
											required
										/>
									</div>

									{/* Delivery Location */}
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">Delivery Location</label>
										<input
											type="text"
											value={formData.deliveryLocation}
											onChange={(e) => handleFormInputChange('deliveryLocation', e.target.value)}
											placeholder="e.g., Mumbai, Maharashtra"
											className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
											required
										/>
									</div>

									{/* Budget Range */}
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
										<input
											type="text"
											value={formData.budgetRange}
											onChange={(e) => handleFormInputChange('budgetRange', e.target.value)}
											placeholder="e.g., ₹5,000"
											className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
											required
										/>
									</div>
								</div>

								{/* Special Requirements */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Special Requirements</label>
									<textarea
										value={formData.specialRequirements}
										onChange={(e) => handleFormInputChange('specialRequirements', e.target.value)}
										placeholder="Any special requirements or notes..."
										rows="4"
										className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
									/>
								</div>

								{/* Form Buttons */}
								<div className="flex gap-4 pt-4">
									<button
										type="submit"
										className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition font-semibold text-lg"
									>
										Post Requirement
									</button>
									<button
										type="button"
										onClick={handleCancelForm}
										className="bg-gray-500 text-white px-8 py-3 rounded-lg hover:bg-gray-600 transition font-semibold text-lg"
									>
										Cancel
									</button>
								</div>
							</form>
						</div>
					</div>

					{/* Requirements List */}
					<div className="space-y-6">
						{loading ? (
							<div className="text-center py-8">
								<div className="text-gray-500">Loading requirements...</div>
							</div>
						) : requirements.length === 0 ? (
							<div className="text-center py-8">
								<div className="text-gray-500 mb-4">
									{buyerLocation.isSet 
										? "No farmers found within your search radius." 
										: "No requirements posted yet. Create your first requirement above!"
									}
								</div>
								{buyerLocation.isSet && (
									<button 
										onClick={() => {
											// Expand search radius by 50km
											const newRadius = buyerLocation.searchRadius + 50
											// This would call updateBuyerLocation with expanded radius
											console.log(`Expanding search radius to ${newRadius}km`)
										}}
										className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
									>
										Expand search to {buyerLocation.searchRadius + 50}km radius
									</button>
								)}
							</div>
						) : (
							requirements.map((requirement) => {
								const statusBadge = getStatusBadge(requirement.status)
								return (
									<div key={requirement.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
										{/* Crop Name with Icon */}
										<div className="flex items-center gap-4 mb-4">
											<span className="text-4xl">{getCropIcon(requirement.cropName)}</span>
											<h3 className="text-2xl font-bold text-gray-900">{requirement.cropName}</h3>
										</div>

										{/* Essential Info in One Line */}
										<div className="flex items-center gap-6 mb-4 text-gray-700">
											<div className="flex items-center gap-2">
												<span className="text-lg">📦</span>
												<span className="font-medium">{requirement.quantity}</span>
											</div>
											<div className="flex items-center gap-2">
												<span className="text-lg">📍</span>
												<span className="font-medium">{requirement.location}</span>
											</div>
											<div className="flex items-center gap-2">
												<span className="text-lg">📅</span>
												<span className="font-medium">{requirement.deliveryDate}</span>
											</div>
										</div>

										{/* Farmers Matched */}
										<div className="mb-4">
											<span className="text-lg font-semibold text-green-600">
												{requirement.farmersMatched} Farmers Ready!
											</span>
										</div>

										{/* Price and Status */}
										<div className="flex items-center justify-between mb-6">
											<div className="flex items-center gap-2">
												<span className="text-lg">💰</span>
												<span className="text-2xl font-bold text-gray-900">{requirement.price}</span>
											</div>
											<div className={`px-4 py-2 rounded-full ${statusBadge.bg} ${statusBadge.text} font-medium flex items-center gap-2`}>
												<span>{statusBadge.icon}</span>
												{requirement.status}
											</div>
										</div>

										{/* Action Buttons */}
										<div className="flex gap-4">
											{requirement.status.toLowerCase() === 'pending' && (
												<button 
													onClick={() => handleApprove(requirement.id)}
													className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition font-semibold text-lg flex items-center gap-2"
												>
													✅ Approve
												</button>
											)}
											<button 
												onClick={() => handleShowDetails(requirement.id)}
												className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-medium flex items-center gap-2"
											>
												🔍 Details
											</button>
										</div>

										{/* Details Section (Expandable) */}
										{showDetailsId === requirement.id && (
											<div className="mt-6 p-4 bg-gray-50 rounded-lg">
												<h4 className="font-semibold text-gray-900 mb-3">Requirement Details</h4>
												<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
													<div>
														<span className="text-gray-600">Crop:</span>
														<span className="ml-2 font-medium">{requirement.cropName}</span>
													</div>
													<div>
														<span className="text-gray-600">Quantity:</span>
														<span className="ml-2 font-medium">{requirement.quantity}</span>
													</div>
													<div>
														<span className="text-gray-600">Location:</span>
														<span className="ml-2 font-medium">{requirement.location}</span>
													</div>
													<div>
														<span className="text-gray-600">Delivery Date:</span>
														<span className="ml-2 font-medium">{requirement.deliveryDate}</span>
													</div>
													<div>
														<span className="text-gray-600">Total Price:</span>
														<span className="ml-2 font-medium">{requirement.price}</span>
													</div>
													<div>
														<span className="text-gray-600">Status:</span>
														<span className="ml-2 font-medium">{requirement.status}</span>
													</div>
												</div>
											</div>
										)}
									</div>
								)
							})
						)}
					</div>
				</div>
			</main>
			<Footer />
		</div>
	)
}

export default BuyerDashboard


