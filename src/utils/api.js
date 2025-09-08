// Axios instance placeholder
// Replace with real baseURL and interceptors later
export function createApiClient() {
	return {
		get: async (url) => Promise.resolve({ data: null, url }),
		post: async (url, body) => Promise.resolve({ data: body, url }),
	}
}

export const api = createApiClient()


