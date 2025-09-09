import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import LocationRangeSetup from '../components/LocationRangeSetup.jsx'
import { useEffect, useState } from 'react'
import { useLocation } from '../contexts/LocationContext'
import { useLanguage } from '../contexts/LanguageContext'
import { useLocationRange } from '../contexts/LocationRangeContext'
import { Settings, MapPin } from 'lucide-react'

function FarmerDashboard() {
	const [newOrders, setNewOrders] = useState([])
	const [activeOrders, setActiveOrders] = useState([])
	const [stats, setStats] = useState({
		newOrders: 0,
		activeOrders: 0,
		monthlyEarnings: 0,
		completedOrders: 0
	})
	const [showLocationSetup, setShowLocationSetup] = useState(false)
	const { location, radius, isLocationSet } = useLocation()
	const { t } = useLanguage()
	const { farmerLocation, isWithinDeliveryRange, getCoordinatesFromLocation } = useLocationRange()

	// Helper function to get API base URL with fallbacks
	function getApiBaseUrl() {
		if (import.meta?.env?.VITE_API_URL) {
			return import.meta.env.VITE_API_URL
		}
		return 'http://localhost:3000'
	}

	// Filter orders based on farmer's delivery range
	const filterOrdersByDeliveryRange = async (orders) => {
		if (!farmerLocation.isSet || !farmerLocation.latitude || !farmerLocation.longitude) {
			return orders // Return all orders if farmer location not set
		}

		const filteredOrders = []
		for (const order of orders) {
			try {
				const buyerCoords = await getCoordinatesFromLocation(order.location)
				const isWithinRange = isWithinDeliveryRange(
					farmerLocation.latitude,
					farmerLocation.longitude,
					farmerLocation.deliveryRadius,
					buyerCoords.lat,
					buyerCoords.lon
				)
				if (isWithinRange) {
					filteredOrders.push(order)
				}
			} catch (error) {
				// If we can't get coordinates, include the order
				filteredOrders.push(order)
			}
		}
		return filteredOrders
	}

	// Mock data for demonstration - replace with actual API calls
	useEffect(() => {
		const loadOrders = async () => {
			// Mock new orders
			const mockNewOrders = [
				{
					id: 1,
					productName: "Organic Tomatoes",
					buyerName: "Raj Patel",
					quantity: "50 kg",
					pricePerUnit: "₹40/kg",
					location: "Mumbai, Maharashtra",
					date: "2025-01-10",
					specialRequirements: "Need fresh tomatoes for restaurant supply",
					totalAmount: 2000
				},
				{
					id: 2,
					productName: "Fresh Onions",
					buyerName: "Priya Sharma",
					quantity: "100 kg",
					pricePerUnit: "₹25/kg",
					location: "Pune, Maharashtra",
					date: "2025-01-12",
					specialRequirements: "Bulk order for wholesale market",
					totalAmount: 2500
				},
				{
					id: 3,
					productName: "Sweet Corn",
					buyerName: "Amit Singh",
					quantity: "75 kg",
					pricePerUnit: "₹30/kg",
					location: "Delhi",
					date: "2025-01-15",
					specialRequirements: "Fresh corn for retail store",
					totalAmount: 2250
				}
			]

			// Filter orders based on delivery range
			const filteredNewOrders = await filterOrdersByDeliveryRange(mockNewOrders)
			setNewOrders(filteredNewOrders)

			// Mock active orders
			setActiveOrders([
				{
					id: 3,
					productName: "Basmati Rice",
					buyerName: "Amit Kumar",
					quantity: "200 kg",
					totalPrice: "₹15,000",
					location: "Delhi",
				deliveryDate: "2025-01-15",
				status: "Ready for Pickup",
				badge: "Accepted"
			},
			{
				id: 4,
				productName: "Wheat Flour",
				buyerName: "Sunita Devi",
				quantity: "150 kg",
				totalPrice: "₹7,500",
				location: "Jaipur, Rajasthan",
				deliveryDate: "2025-01-18",
				status: "Order in Transit",
				badge: "In Progress"
			}
		])

			// Mock stats
			setStats({
				newOrders: filteredNewOrders.length,
				activeOrders: 2,
				monthlyEarnings: 45000,
				completedOrders: 12
			})
		}

		loadOrders()
	}, [farmerLocation])

	const handleAcceptOrder = (orderId) => {
		setNewOrders(prev => prev.filter(order => order.id !== orderId))
		setStats(prev => ({ ...prev, newOrders: prev.newOrders - 1, activeOrders: prev.activeOrders + 1 }))
	}

	const handleDeclineOrder = (orderId) => {
		setNewOrders(prev => prev.filter(order => order.id !== orderId))
		setStats(prev => ({ ...prev, newOrders: prev.newOrders - 1 }))
	}

	return (
		<div className="min-h-screen flex flex-col bg-gray-50">
			<Navbar />
			<main className="flex-1">
				<div className="mx-auto max-w-7xl px-4 py-8">
					{/* Dashboard Header */}
					<div className="mb-8">
						<div className="flex items-center justify-between">
							<div>
								<h1 className="text-3xl font-bold text-gray-900 mb-2">Farmer Dashboard</h1>
								<p className="text-gray-600">Manage your incoming orders and deliveries.</p>
								{farmerLocation.isSet && (
									<div className="flex items-center gap-2 mt-2 text-sm text-green-700 bg-green-50 px-3 py-1 rounded-full w-fit">
										<MapPin className="h-4 w-4" />
										<span>Delivering up to {farmerLocation.deliveryRadius}km from {farmerLocation.city}, {farmerLocation.state}</span>
									</div>
								)}
							</div>
							<button 
								onClick={() => setShowLocationSetup(!showLocationSetup)}
								className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
							>
								<Settings className="h-4 w-4" />
								{farmerLocation.isSet ? 'Update Range' : 'Set Delivery Range'}
							</button>
						</div>
					</div>

					{/* Location Range Setup */}
					{(!farmerLocation.isSet || showLocationSetup) && (
						<div className="mb-8">
							<LocationRangeSetup 
								isOnboarding={!farmerLocation.isSet}
								onComplete={() => setShowLocationSetup(false)}
							/>
						</div>
					)}

					{/* Summary Stats Cards */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
						{/* New Orders Card */}
						<div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
							<div className="flex items-center">
								<div className="bg-blue-100 p-3 rounded-lg">
									<span className="text-2xl">📦</span>
								</div>
								<div className="ml-4">
									<p className="text-sm font-medium text-gray-600">New Orders</p>
									<p className="text-2xl font-bold text-gray-900">{stats.newOrders}</p>
								</div>
							</div>
						</div>

						{/* Active Orders Card */}
						<div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
							<div className="flex items-center">
								<div className="bg-orange-100 p-3 rounded-lg">
									<span className="text-2xl">⏱</span>
								</div>
								<div className="ml-4">
									<p className="text-sm font-medium text-gray-600">Active Orders</p>
									<p className="text-2xl font-bold text-gray-900">{stats.activeOrders}</p>
								</div>
							</div>
						</div>

						{/* Monthly Earnings Card */}
						<div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
							<div className="flex items-center">
								<div className="bg-green-100 p-3 rounded-lg">
									<span className="text-2xl">💰</span>
								</div>
								<div className="ml-4">
									<p className="text-sm font-medium text-gray-600">This Month</p>
									<p className="text-2xl font-bold text-green-600">₹{stats.monthlyEarnings.toLocaleString()}</p>
								</div>
							</div>
						</div>

						{/* Completed Orders Card */}
						<div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
							<div className="flex items-center">
								<div className="bg-gray-100 p-3 rounded-lg">
									<span className="text-2xl">✔️</span>
								</div>
								<div className="ml-4">
									<p className="text-sm font-medium text-gray-600">Completed</p>
									<p className="text-2xl font-bold text-gray-900">{stats.completedOrders}</p>
								</div>
							</div>
						</div>
					</div>

					{/* New Incoming Orders Section */}
					<div className="mt-8">
						<h2 className="text-2xl font-bold text-orange-600 mb-6">New Incoming Orders</h2>
						{newOrders.length > 0 ? (
							<div className="space-y-6">
								{newOrders.map(order => (
									<div key={order.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition relative">
										{/* New Order Badge */}
										<div className="absolute top-4 right-4">
											<span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
												New Order
											</span>
										</div>

										<div className="mb-4">
											<h3 className="text-xl font-bold text-gray-900 mb-2">{order.productName}</h3>
											<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
												<div><span className="font-medium">Buyer:</span> {order.buyerName}</div>
												<div><span className="font-medium">Quantity:</span> {order.quantity}</div>
												<div><span className="font-medium">Price/Unit:</span> {order.pricePerUnit}</div>
												<div><span className="font-medium">Location:</span> {order.location}</div>
												<div><span className="font-medium">Required Date:</span> {order.date}</div>
											</div>
											{order.specialRequirements && (
												<p className="text-sm text-gray-500 italic mt-2">{order.specialRequirements}</p>
											)}
										</div>

										{/* Total Amount Highlight */}
										<div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
											<p className="text-lg font-bold text-green-800">
												Total Amount: ₹{order.totalAmount.toLocaleString()}
											</p>
										</div>

										{/* Action Buttons */}
										<div className="flex gap-3">
											<button 
												onClick={() => handleAcceptOrder(order.id)}
												className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-medium"
											>
												Accept Order
											</button>
											<button 
												onClick={() => handleDeclineOrder(order.id)}
												className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition font-medium"
											>
												Decline
											</button>
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="bg-white rounded-xl shadow-sm p-8 text-center">
								<p className="text-gray-500">No new orders at the moment.</p>
							</div>
						)}
					</div>

					{/* Active Orders Section */}
					<div className="mt-8">
						<h2 className="text-2xl font-bold text-gray-900 mb-6">Your Active Orders</h2>
						{activeOrders.length > 0 ? (
							<div className="space-y-6">
								{activeOrders.map(order => (
									<div key={order.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
										<div className="flex justify-between items-start mb-4">
											<div>
												<h3 className="text-lg font-bold text-gray-900 mb-1">
													{order.productName} - {order.buyerName}
												</h3>
												<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
													<div><span className="font-medium">Quantity:</span> {order.quantity}</div>
													<div><span className="font-medium">Total Price:</span> {order.totalPrice}</div>
													<div><span className="font-medium">Location:</span> {order.location}</div>
													<div><span className="font-medium">Delivery Date:</span> {order.deliveryDate}</div>
												</div>
											</div>
											<div className="flex flex-col items-end gap-2">
												{/* Status Badge */}
												<span className={`px-3 py-1 rounded-full text-sm font-medium ${
													order.badge === 'Accepted' ? 'bg-green-100 text-green-800' :
													order.badge === 'In Progress' ? 'bg-orange-100 text-orange-800' :
													'bg-gray-100 text-gray-800'
												}`}>
													{order.badge}
												</span>
											</div>
										</div>

										{/* Status Area */}
										<div className={`p-3 rounded-lg ${
											order.status === 'Ready for Pickup' ? 'bg-green-50 border border-green-200' :
											'bg-gray-50 border border-gray-200'
										}`}>
											<p className={`font-medium ${
												order.status === 'Ready for Pickup' ? 'text-green-800' : 'text-gray-700'
											}`}>
												{order.status}
											</p>
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="bg-white rounded-xl shadow-sm p-8 text-center">
								<p className="text-gray-500">No active orders yet.</p>
							</div>
						)}
					</div>
				</div>
			</main>
			<Footer />
		</div>
	)
}

export default FarmerDashboard


