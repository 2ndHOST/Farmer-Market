import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LocationProvider } from './contexts/LocationContext'
import { LanguageProvider } from './contexts/LanguageContext'
import { LocationRangeProvider } from './contexts/LocationRangeContext'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import FarmerDashboard from './pages/FarmerDashboard.jsx'
import BuyerDashboard from './pages/BuyerDashboard.jsx'
import PriceBoardPage from './pages/PriceBoardPage.jsx'
import EquipmentRentalPage from './pages/EquipmentRentalPage.jsx'

function App() {
	return (
		<LanguageProvider>
			<LocationProvider>
				<LocationRangeProvider>
					<BrowserRouter>
						<Routes>
							<Route path="/" element={<Landing />} />
							<Route path="/login" element={<Login />} />
							<Route path="/farmer" element={<FarmerDashboard />} />
							<Route path="/buyer" element={<BuyerDashboard />} />
							<Route path="/prices" element={<PriceBoardPage />} />
							<Route path="/equipment" element={<EquipmentRentalPage />} />
						</Routes>
					</BrowserRouter>
				</LocationRangeProvider>
			</LocationProvider>
		</LanguageProvider>
	)
}

export default App
