import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { prisma } from '../util/prisma.js'

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me'

// Create JWT token
function createJwtToken(payload) {
	return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

// Create user response object
function createUserResponse(user) {
	return {
		id: user.id,
		phone: user.phone,
		name: user.name,
		role: user.role,
		firebaseUid: user.firebaseUid
	}
}

// Firebase user registration/login endpoint
router.post('/firebase-auth', async (req, res, next) => {
	try {
		const { firebaseUid, phone, name, email } = req.body
		
		if (!firebaseUid || !phone) {
			return res.status(400).json({ error: 'firebaseUid and phone are required' })
		}

		// Find or create user
		let user = await prisma.user.findFirst({
			where: {
				OR: [{ firebaseUid }, { phone }]
			}
		})

		if (!user) {
			// Create new user
			user = await prisma.user.create({ 
				data: { 
					firebaseUid,
					phone, 
					name: name || null,
					email: email || null
				} 
			})
		} else {
			// Update existing user
			const updateData = {}
			if (!user.firebaseUid) updateData.firebaseUid = firebaseUid
			if (name && !user.name) updateData.name = name
			if (email && !user.email) updateData.email = email
			
			if (Object.keys(updateData).length > 0) {
				user = await prisma.user.update({ 
					where: { id: user.id }, 
					data: updateData 
				})
			}
		}

		const token = createJwtToken({ 
			sub: user.id, 
			phone: user.phone, 
			role: user.role,
			firebaseUid: user.firebaseUid
		})
		
		res.json({ 
			token, 
			user: createUserResponse(user)
		})
	} catch (e) { next(e) }
})

// Simple user registration endpoint (for non-Firebase auth)
router.post('/register', async (req, res, next) => {
	try {
		const { phone, name, email } = req.body
		
		if (!phone) {
			return res.status(400).json({ error: 'phone is required' })
		}

		let user = await prisma.user.findUnique({ where: { phone } })
		
		if (!user) {
			user = await prisma.user.create({ 
				data: { 
					phone, 
					name: name || null,
					email: email || null
				} 
			})
		} else {
			// Update user if name or email is provided
			const updateData = {}
			if (name && !user.name) updateData.name = name
			if (email && !user.email) updateData.email = email
			
			if (Object.keys(updateData).length > 0) {
				user = await prisma.user.update({ 
					where: { id: user.id }, 
					data: updateData 
				})
			}
		}

		const token = createJwtToken({ 
			sub: user.id, 
			phone: user.phone, 
			role: user.role 
		})
		
		res.json({ 
			token, 
			user: createUserResponse(user)
		})
	} catch (e) { next(e) }
})

// Legacy endpoints for compatibility
router.post('/send-otp', async (req, res, next) => {
	try {
		const { phone } = req.body
		
		if (!phone) {
			return res.status(400).json({ error: 'phone is required' })
		}

		// Firebase handles OTP sending on the frontend
		return res.json({ 
			ok: true, 
			message: 'Use Firebase authentication for OTP' 
		})
	} catch (e) { next(e) }
})

router.post('/verify-otp', async (req, res, next) => {
	try {
		const { phone, code, name } = req.body
		
		if (!phone || !code) {
			return res.status(400).json({ error: 'phone and code are required' })
		}

		// Development/testing only - use Firebase for production
		if (code === '123456') {
			let user = await prisma.user.findUnique({ where: { phone } })
			
			if (!user) {
				user = await prisma.user.create({ 
					data: { 
						phone, 
						name: name || null
					} 
				})
			} else if (name && !user.name) {
				user = await prisma.user.update({ 
					where: { id: user.id }, 
					data: { name } 
				})
			}

			const token = createJwtToken({ 
				sub: user.id, 
				phone: user.phone, 
				role: user.role 
			})
			
			res.json({ 
				token, 
				user: createUserResponse(user)
			})
		} else {
			res.status(400).json({ 
				error: 'Invalid code. Use 123456 for testing or Firebase for production.' 
			})
		}
	} catch (e) { next(e) }
})

export default router