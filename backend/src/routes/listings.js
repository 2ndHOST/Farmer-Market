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
		const { crop, unit, quantity, minPrice, farmerName } = req.body
		const listing = await prisma.listing.create({
			data: { crop, unit, quantity, minPrice, farmerName },
		})
		res.status(201).json(listing)
	} catch (e) { next(e) }
})

export default router


