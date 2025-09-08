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
	const navigate = useNavigate()
	const { requestOtp, verifyOtp } = useAuth()

	const handleNext = async (e) => {
		e.preventDefault()
		setError('')
		if (!name.trim()) {
			setError('Name is required')
			return
		}
		if (!mobileNumber.trim()) return
		try {
			setLoading(true)
			await requestOtp(mobileNumber)
			setStep(2)
		} catch (_err) {
			setError('Failed to send OTP. Please check the number and try again.')
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
			await verifyOtp({ phone: mobileNumber, code: otp, name })
			navigate('/')
		} catch (_err) {
			setError('Invalid OTP. Please try again.')
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

						{step === 1 ? (
							<button type="button" onClick={handleNext} className="w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-xl hover:bg-green-700 transition-all" disabled={!mobileNumber.trim() || !name.trim() || loading}>
								Next
							</button>
						) : (
							<button type="submit" className="w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-xl hover:bg-green-700 transition-all" disabled={!otp.trim() || loading}>
								Sign In
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


