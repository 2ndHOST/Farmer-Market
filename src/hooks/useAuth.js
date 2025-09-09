import { useEffect, useState } from 'react'
import { storage } from '../utils/storage.js'
import { AuthAPI } from '../utils/api.js'
import firebaseAuth from '../services/firebaseAuth.js'

export function useAuth() {
	const [user, setUser] = useState(() => storage.get('agri_user', null))
	const [loading, setLoading] = useState(true)
	const [confirmationResult, setConfirmationResult] = useState(null)

	// Save user to storage when it changes
	useEffect(() => {
		storage.set('agri_user', user)
	}, [user])

	// Listen to Firebase auth state changes
	useEffect(() => {
		const unsubscribe = firebaseAuth.onAuthStateChanged(async (firebaseUser) => {
			if (firebaseUser) {
				await syncFirebaseUserWithBackend(firebaseUser)
			} else {
				// User is signed out
				setUser(null)
				localStorage.removeItem('token')
			}
			setLoading(false)
		})

		return () => unsubscribe()
	}, [])

	// Sync Firebase user with backend
	async function syncFirebaseUserWithBackend(firebaseUser) {
		try {
			const { data } = await AuthAPI.firebaseAuth({
				firebaseUid: firebaseUser.uid,
				phone: firebaseUser.phoneNumber,
				name: firebaseUser.displayName || null
			})
			
			const { token, user: backendUser } = data
			localStorage.setItem('token', token)
			setUser(backendUser)
		} catch (error) {
			console.error('Error syncing Firebase user with backend:', error)
			// Fallback to Firebase user data
			setUser({
				uid: firebaseUser.uid,
				phone: firebaseUser.phoneNumber,
				name: firebaseUser.displayName
			})
		}
	}

	// Request OTP
	async function requestOtp(phone) {
		setLoading(true)
		try {
			const result = await firebaseAuth.sendOTP(phone)
			if (result.success) {
				setConfirmationResult(result.confirmationResult)
				return result
			} else {
				throw new Error(result.error)
			}
		} catch (error) {
			console.error('Error sending OTP:', error)
			throw error
		} finally {
			setLoading(false)
		}
	}

	// Verify OTP
	async function verifyOtp({ phone, code, name }) {
		setLoading(true)
		try {
			if (!confirmationResult) {
				throw new Error('No confirmation result available. Please request OTP again.')
			}

			const result = await firebaseAuth.verifyOTP(confirmationResult, code)
			if (result.success) {
				setConfirmationResult(null)
				return result.user
			} else {
				throw new Error(result.error)
			}
		} catch (error) {
			console.error('Error verifying OTP:', error)
			throw error
		} finally {
			setLoading(false)
		}
	}

	// Logout
	async function logout() {
		setLoading(true)
		try {
			await firebaseAuth.signOut()
		} catch (error) {
			console.error('Error signing out:', error)
		} finally {
			setLoading(false)
		}
	}

	return { 
		user, 
		requestOtp, 
		verifyOtp, 
		logout, 
		isAuthenticated: !!user, 
		loading 
	}
}

export default useAuth


