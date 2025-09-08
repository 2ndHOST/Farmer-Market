import { useEffect, useState } from 'react'
import { storage } from '../utils/storage.js'

export function useAuth() {
	const [user, setUser] = useState(() => storage.get('agri_user', null))

	useEffect(() => {
		storage.set('agri_user', user)
	}, [user])

	function login(email) {
		setUser({ id: 'demo', email })
	}

	function logout() {
		setUser(null)
	}

	return { user, login, logout, isAuthenticated: !!user }
}

export default useAuth


