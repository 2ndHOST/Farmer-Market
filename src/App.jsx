import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import FarmerDashboard from './pages/FarmerDashboard.jsx'
import BuyerDashboard from './pages/BuyerDashboard.jsx'
import PriceBoardPage from './pages/PriceBoardPage.jsx'

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Landing />} />
				<Route path="/login" element={<Login />} />
				<Route path="/farmer" element={<FarmerDashboard />} />
				<Route path="/buyer" element={<BuyerDashboard />} />
				<Route path="/prices" element={<PriceBoardPage />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
