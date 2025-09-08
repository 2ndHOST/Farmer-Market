import { useEffect, useState } from 'react'
import { storage } from '../utils/storage.js'
import { AuthAPI } from '../utils/api.js'

export function useAuth() {
	const [user, setUser] = useState(() => storage.get('agri_user', null))

	useEffect(() => {
		storage.set('agri_user', user)
	}, [user])

	async function requestOtp(phone) {
		await AuthAPI.sendOtp(phone)
		return true
	}

	async function verifyOtp({ phone, code, name }) {
		const { data } = await AuthAPI.verifyOtp({ phone, code, name })
		const { token, user: u } = data
		localStorage.setItem('token', token)
		setUser(u)
		return u
	}

	function logout() {
		setUser(null)
	}

	return { user, requestOtp, verifyOtp, logout, isAuthenticated: !!user }
}

export default useAuth


