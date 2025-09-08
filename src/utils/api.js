import axios from 'axios'

export const api = axios.create({
	baseURL: 'http://localhost:3000',
})

api.interceptors.request.use((config) => {
	const token = localStorage.getItem('token')
	if (token) config.headers.Authorization = `Bearer ${token}`
	return config
})

export const AuthAPI = {
	sendOtp(phone) {
		return api.post('/auth/send-otp', { phone })
	},
	verifyOtp({ phone, code, name }) {
		return api.post('/auth/verify-otp', { phone, code, name })
	},
}


