import { Router } from 'express'
import { prisma } from '../util/prisma.js'

const router = Router()

router.get('/', async (req, res, next) => {
	try {
		const { crop, page = 1, pageSize = 20 } = req.query
		const where = crop ? { crop: { contains: String(crop), mode: 'insensitive' } } : {}
		const skip = (Number(page) - 1) * Number(pageSize)
		const listings = await prisma.listing.findMany({
			where,
			skip,
			take: Number(pageSize),
			orderBy: { createdAt: 'desc' },
		})
		res.json(listings)
	} catch (e) { next(e) }
})


router.post('/', async (req, res, next) => {
	try {
		const { crop, unit = 'kg', quantity, minPrice, farmerName = 'Unknown', farmerPhone = null } = req.body || {}
		if (!crop || quantity == null || minPrice == null) {
			return res.status(400).json({ error: 'crop, minPrice and quantity are required' })
		}
		const qtyNum = Number(quantity)
		const priceNum = Number(minPrice)
		if (!Number.isFinite(qtyNum) || !Number.isFinite(priceNum)) {
			return res.status(400).json({ error: 'minPrice and quantity must be numbers' })
		}
		const listing = await prisma.listing.create({
			data: { crop, unit, quantity: qtyNum, minPrice: priceNum, farmerName, farmerPhone },
		})
		res.status(201).json(listing)
	} catch (e) { next(e) }
})

export default router


