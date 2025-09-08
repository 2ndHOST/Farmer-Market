export const storage = {
	get(key, fallback = null) {
		try {
			const v = localStorage.getItem(key)
			return v ? JSON.parse(v) : fallback
		} catch (_) {
			return fallback
		}
	},
	set(key, value) {
		try {
			localStorage.setItem(key, JSON.stringify(value))
			return true
		} catch (_) {
			return false
		}
	},
	remove(key) {
		try {
			localStorage.removeItem(key)
		} catch (_) {}
	},
}


