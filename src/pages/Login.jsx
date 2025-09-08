import { useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

function Login() {
	const [mobileNumber, setMobileNumber] = useState('')
	const [otp, setOtp] = useState('')
	const [step, setStep] = useState(1) // 1: mobile input, 2: otp input

	const handleNext = (e) => {
		e.preventDefault()
		if (!mobileNumber.trim()) return
		setStep(2)
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		if (step === 1) {
			return handleNext(e)
		}
		if (!otp.trim()) return
		// TODO: integrate submit with API when available
		console.log('Submitting with', { mobileNumber, otp })
	}

	return (
		<div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-white">
			<Navbar />
			<main className="flex-1">
				<div className="mx-auto max-w-md px-4 py-16">
					<h1 className="text-3xl font-bold text-gray-900">Login</h1>
					<p className="text-gray-600 text-sm mb-4">Enter your mobile number to receive an OTP.</p>
					<form className="mt-6 space-y-4 bg-white p-8 rounded-2xl shadow-xl border border-gray-100" onSubmit={handleSubmit}>
						<input
							type="tel"
							placeholder="Mobile number"
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

						{step === 1 ? (
							<button type="button" onClick={handleNext} className="w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-xl hover:bg-green-700 transition-all" disabled={!mobileNumber.trim()}>
								Next
							</button>
						) : (
							<button type="submit" className="w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-xl hover:bg-green-700 transition-all" disabled={!otp.trim()}>
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


