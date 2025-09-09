import { useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth.js'

function Login() {
	const [mobileNumber, setMobileNumber] = useState('')
	const [name, setName] = useState('')
	const [otp, setOtp] = useState('')
	const [step, setStep] = useState(1) // 1: mobile input, 2: otp input
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const [devMode, setDevMode] = useState(false)
	const navigate = useNavigate()
	const { requestOtp, verifyOtp, loading: authLoading } = useAuth()

	function isE164(num) {
		return /^\+\d{10,15}$/.test(num)
	}

	const handleNext = async (e) => {
		e.preventDefault()
		setError('')
		if (!name.trim()) {
			setError('Name is required')
			return
		}
		if (!mobileNumber.trim()) return
		if (!isE164(mobileNumber.trim())) {
			setError('Enter phone in E.164 format, e.g. +9198XXXXXXXX')
			return
		}
		try {
			setLoading(true)
			const result = await requestOtp(mobileNumber.trim())
			setStep(2)
			// Check if we're in development mode
			if (result && result.devMode) {
				setDevMode(true)
			}
		} catch (err) {
			const msg = err?.response?.data?.error || err.message || 'Failed to send OTP. Please check the number and try again.'
			setError(msg)
		} finally {
			setLoading(false)
		}
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		setError('')
		if (step === 1) {
			return handleNext(e)
		}
		if (!otp.trim()) return
		try {
			setLoading(true)
			await verifyOtp({ phone: mobileNumber.trim(), code: otp.trim(), name: name.trim() })
			navigate('/')
		} catch (err) {
			const msg = err?.response?.data?.error || 'Invalid OTP. Please try again.'
			setError(msg)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-white">
			<Navbar />
			<main className="flex-1">
				<div className="mx-auto max-w-md px-4 py-16">
					<h1 className="text-3xl font-bold text-gray-900">Login</h1>
					<p className="text-gray-600 text-sm mb-4">Enter your name and mobile number to receive an OTP.</p>
					<form className="mt-6 space-y-4 bg-white p-8 rounded-2xl shadow-xl border border-gray-100" onSubmit={handleSubmit}>
						{/* reCAPTCHA container - required for Firebase Auth */}
						<div id="recaptcha-container"></div>
						<input
							type="text"
							placeholder="Your name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
							required
						/>

						<input
							type="tel"
							placeholder="Mobile number (e.g. +9198XXXXXXXX)"
							inputMode="tel"
							value={mobileNumber}
							onChange={(e) => setMobileNumber(e.target.value)}
							className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
						/>

						{step === 2 && (
							<input
								type="text"
								placeholder="OTP"
								inputMode="numeric"
								autoComplete="one-time-code"
								maxLength={6}
								value={otp}
								onChange={(e) => setOtp(e.target.value)}
								className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
							/>
						)}

						{error && <p className="text-red-600 text-sm">{error}</p>}
						
						{devMode && step === 2 && (
							<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
								<p className="text-yellow-800 text-sm">
									<strong>Development Mode:</strong> Firebase billing not enabled. 
									Use OTP: <code className="bg-yellow-100 px-1 rounded">123456</code> or <code className="bg-yellow-100 px-1 rounded">000000</code>
								</p>
							</div>
						)}

						{step === 1 ? (
							<button type="button" onClick={handleNext} className="w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-xl hover:bg-green-700 transition-all" disabled={!mobileNumber.trim() || !name.trim() || loading || authLoading}>
								{loading || authLoading ? 'Sending OTP...' : 'Next'}
							</button>
						) : (
							<button type="submit" className="w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-xl hover:bg-green-700 transition-all" disabled={!otp.trim() || loading || authLoading}>
								{loading || authLoading ? 'Verifying...' : 'Sign In'}
							</button>
						)}
					</form>
				</div>
			</main>
			<Footer />
		</div>
	)
}

export default Login


