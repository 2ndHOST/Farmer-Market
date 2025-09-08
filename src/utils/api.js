// Lightweight API shim backed by localStorage for demo flows
// Endpoints:
// GET /listings
// GET /bids
// POST /bid { crop, price, quantity, phone, address, farmerName, location }
// GET /equipment
// POST /rental-request { equipmentId, mode: 'money'|'barter', days?, barterType?, description?, contact? }

const KEY_LISTINGS = 'agri_listings'
const KEY_BIDS = 'agri_bids'
const KEY_EQUIPMENT = 'agri_equipment'
const KEY_RENTAL_REQUESTS = 'agri_rental_requests'
const KEY_NOTIFICATIONS = 'agri_notifications'

function read(key, fallback) {
	try {
		const v = localStorage.getItem(key)
		return v ? JSON.parse(v) : fallback
	} catch {
		return fallback
	}
}

function write(key, value) {
	try { localStorage.setItem(key, JSON.stringify(value)); return true } catch { return false }
}

// Seed demo listings if empty
if (!read(KEY_LISTINGS)) {
	write(KEY_LISTINGS, [
		{ id: '1', crop: 'Tomato', unit: 'kg', quantity: 120, minPrice: 18, farmerName: 'Farmer A', location: 'Nashik' },
		{ id: '2', crop: 'Potato', unit: 'kg', quantity: 200, minPrice: 22, farmerName: 'Farmer B', location: 'Pune' },
		{ id: '3', crop: 'Onion', unit: 'kg', quantity: 150, minPrice: 32, farmerName: 'Farmer C', location: 'Satara' },
	])
}
if (!read(KEY_BIDS)) write(KEY_BIDS, [])
// Seed demo equipment if empty
if (!read(KEY_EQUIPMENT)) {
  write(KEY_EQUIPMENT, [
    { id: 'e1', title: 'Tractor, 4WD', type: 'tractor', location: 'Nashik', rentPerDay: 1500, barter: true, imageUrl: '' },
    { id: 'e2', title: 'Rotavator', type: 'rotavator', location: 'Pune', rentPerDay: 700, barter: false, imageUrl: '' },
    { id: 'e3', title: 'Irrigation Pump', type: 'pump', location: 'Satara', rentPerDay: 500, barter: true, imageUrl: '' },
  ])
}
if (!read(KEY_RENTAL_REQUESTS)) write(KEY_RENTAL_REQUESTS, [])
if (!read(KEY_NOTIFICATIONS)) write(KEY_NOTIFICATIONS, [])

export const api = {
	async get(url) {
		switch (url) {
			case '/listings':
				return { data: read(KEY_LISTINGS, []) }
			case '/bids':
				return { data: read(KEY_BIDS, []) }
			case '/equipment':
				return { data: read(KEY_EQUIPMENT, []) }
			default:
				return { data: null }
		}
	},
	async post(url, body) {
		switch (url) {
			case '/bid': {
				const bids = read(KEY_BIDS, [])
				const bid = { id: String(Date.now()), createdAt: Date.now(), ...body }
				bids.push(bid)
				write(KEY_BIDS, bids)
				// update minPrice on listings if crop matches and lower
				const listings = read(KEY_LISTINGS, [])
				const matchIdx = listings.findIndex(l => (l.crop || l.name) === body.crop)
				if (matchIdx >= 0) {
					const current = listings[matchIdx]
					const price = Number(body.price)
					if (!Number.isNaN(price) && (current.minPrice == null || price < current.minPrice)) {
						listings[matchIdx] = { ...current, minPrice: price }
						write(KEY_LISTINGS, listings)
						// notify listeners of listings updates
						pubsub.emit('listings', listings)
					}
				}
				// notify listeners of new bids
				pubsub.emit('bids', bids)
				return { data: bid }
			}
			default:
				if (url === '/rental-request') {
					const requests = read(KEY_RENTAL_REQUESTS, [])
					const req = { id: String(Date.now()), createdAt: Date.now(), ...body }
					requests.push(req)
					write(KEY_RENTAL_REQUESTS, requests)
					pubsub.emit('rentalRequests', requests)
					// simplistic notification for equipment owner (mock)
					const notes = read(KEY_NOTIFICATIONS, [])
					notes.push({ id: req.id, createdAt: req.createdAt, type: 'rental_request', equipmentId: req.equipmentId, message: 'New rental request received' })
					write(KEY_NOTIFICATIONS, notes)
					pubsub.emit('notifications', notes)
					return { data: req }
				}
				return { data: null }
		}
	},
	/**
	 * Subscribe to resource changes ('listings' | 'bids' | 'equipment' | 'rentalRequests' | 'notifications').
	 * Returns an unsubscribe function.
	 */
	subscribe(resource, callback) {
		return pubsub.on(resource, callback)
	},
}


// Simple pub/sub implementation and background polling to simulate live updates
const pubsub = (() => {
  const topicToSubscribers = new Map()

  function on(topic, callback) {
    if (!topicToSubscribers.has(topic)) topicToSubscribers.set(topic, new Set())
    const set = topicToSubscribers.get(topic)
    set.add(callback)
    return () => {
      set.delete(callback)
    }
  }

  function emit(topic, payload) {
    const set = topicToSubscribers.get(topic)
    if (!set) return
    for (const cb of Array.from(set)) {
      try { cb(payload) } catch {}
    }
  }

  return { on, emit }
})()

// Broadcast when localStorage changes (e.g., across tabs)
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === KEY_LISTINGS) {
      const listings = read(KEY_LISTINGS, [])
      pubsub.emit('listings', listings)
    } else if (e.key === KEY_BIDS) {
      const bids = read(KEY_BIDS, [])
      pubsub.emit('bids', bids)
    } else if (e.key === KEY_EQUIPMENT) {
      const equipment = read(KEY_EQUIPMENT, [])
      pubsub.emit('equipment', equipment)
    } else if (e.key === KEY_RENTAL_REQUESTS) {
      const requests = read(KEY_RENTAL_REQUESTS, [])
      pubsub.emit('rentalRequests', requests)
    } else if (e.key === KEY_NOTIFICATIONS) {
      const notes = read(KEY_NOTIFICATIONS, [])
      pubsub.emit('notifications', notes)
    }
  })

  // Lightweight polling to mimic server-pushed updates
  let lastListingsJson = JSON.stringify(read(KEY_LISTINGS, []))
  let lastBidsJson = JSON.stringify(read(KEY_BIDS, []))
  let lastEquipmentJson = JSON.stringify(read(KEY_EQUIPMENT, []))
  let lastRequestsJson = JSON.stringify(read(KEY_RENTAL_REQUESTS, []))
  let lastNotesJson = JSON.stringify(read(KEY_NOTIFICATIONS, []))
  setInterval(() => {
    const listingsJson = JSON.stringify(read(KEY_LISTINGS, []))
    if (listingsJson !== lastListingsJson) {
      lastListingsJson = listingsJson
      pubsub.emit('listings', JSON.parse(listingsJson))
    }
    const bidsJson = JSON.stringify(read(KEY_BIDS, []))
    if (bidsJson !== lastBidsJson) {
      lastBidsJson = bidsJson
      pubsub.emit('bids', JSON.parse(bidsJson))
    }
    const equipmentJson = JSON.stringify(read(KEY_EQUIPMENT, []))
    if (equipmentJson !== lastEquipmentJson) {
      lastEquipmentJson = equipmentJson
      pubsub.emit('equipment', JSON.parse(equipmentJson))
    }
    const requestsJson = JSON.stringify(read(KEY_RENTAL_REQUESTS, []))
    if (requestsJson !== lastRequestsJson) {
      lastRequestsJson = requestsJson
      pubsub.emit('rentalRequests', JSON.parse(requestsJson))
    }
    const notesJson = JSON.stringify(read(KEY_NOTIFICATIONS, []))
    if (notesJson !== lastNotesJson) {
      lastNotesJson = notesJson
      pubsub.emit('notifications', JSON.parse(notesJson))
    }
  }, 2500)
}

export const AuthAPI = {
	sendOtp(phone) {
		return api.post('/auth/send-otp', { phone })
	},
	verifyOtp({ phone, code, name }) {
		return api.post('/auth/verify-otp', { phone, code, name })
	},
}


